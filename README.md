# wCleaner

Software to manage a cleaning business. Make a booking, calendar, list of clients etc.

# The old Amplify setup (until the cutover)

The app is moving off AWS Amplify (see [meta/refactor-plan.md](meta/refactor-plan.md)). Until the cutover, **production still runs on the old Amplify app**, built by Amplify Hosting from `amplify.yml` and `amplify/`. Don't remove or change those yet.

The front-end still reads its backend config from `src/amplifyconfiguration.json`, which isn't committed. To run it locally against the Amplify backend, install the [Amplify CLI](https://docs.amplify.aws/cli/start/install/), then copy the `amplify pull` command from the Amplify console (your app → Back end) and run it in the repo. This goes away when the front-end is migrated.

# AWS setup

The new infrastructure is defined with CloudFormation templates in `infra/`:

```
infra/
  bootstrap.yaml       wcleaner-bootstrap, once per account
  main.yaml            wcleaner-<env>: parameters, nested stacks, outputs for the front-end
  stacks/              the nested stacks
  params/<env>.json    the parameter values of each environment
  scripts/
    deploy.sh          packages and deploys one environment (locally and in CI)
    check-params.sh    checks the params files against each other and main.yaml
```

There are two kinds of stacks:

- **`wcleaner-bootstrap`** (`infra/bootstrap.yaml`): once per AWS account, deployed by hand by an admin. It creates what the deploys need to exist beforehand.
- **`wcleaner-<env>`** (`infra/main.yaml` and its nested stacks): one per environment (`dev`, `prod`), deployed by `infra/scripts/deploy.sh`, locally or from GitHub Actions.

Setting up from zero, in order:

1. [Bootstrapping an AWS account](#bootstrapping-an-aws-account), once per account.
2. [Deploying with GitHub Actions](#deploying-with-github-actions), once per repo that deploys.
3. Then deploys happen from GitHub Actions, or [by hand](#deploying-an-environment-by-hand). [Environments and parameters](#environments-and-parameters) explains how environments differ, and [Permissions](#permissions) what each identity can do.

## Bootstrapping an AWS account

### 1. What this is and when to do it

Do this **once per AWS account**, before anything can be deployed to it. It has to be done by a person with admin rights in that account. The `wcleaner-bootstrap` stack creates:

- **Artifacts bucket** (`wcleaner-artifacts-<account id>-<region>`): where `deploy.sh` uploads the packaged nested templates (and later the Lambda code). CloudFormation can only read nested templates from S3. Shared by all environments in the account, under one prefix per environment. Objects expire after 90 days, they're re-uploaded when needed.
- **GitHub OIDC provider** (`token.actions.githubusercontent.com`): lets GitHub Actions get temporary AWS credentials without storing any AWS keys in GitHub. Only one can exist per account, so if there's one already, it's reused (see step 3).
- **Deployer role** (`wcleaner-github-deployer`): the role GitHub Actions assumes. It can only drive CloudFormation on `wcleaner-*` stacks, upload to the artifacts bucket and hand the execution role over to CloudFormation. It can't create resources itself.
- **Execution role** (`wcleaner-cfn-execution`): the role CloudFormation uses to actually create the resources of the `wcleaner-<env>` stacks. Its permissions grow as new subsystems are added.

CI can't create any of this itself: it needs these roles to be able to log in to AWS in the first place, and creating IAM roles needs admin rights, which CI never gets. For the same reason, the deployer role is explicitly denied any change to the `wcleaner-bootstrap` stack: changing it is always a manual, admin action.

See [Permissions](#permissions) for exactly what each role can do.

### 2. Prerequisites

- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
- A CLI profile with admin rights in the target account (never the root user).
- A checkout of this repo, with the version of `infra/bootstrap.yaml` you want to deploy (normally the main branch). All the commands below are run from the repo root.

Choose the region the stacks will live in. The bootstrap stack, the artifacts bucket and the `wcleaner-<env>` stacks all go in that region, and every repo that deploys to this account uses it as its `AWS_REGION`. Point the CLI at the right profile and region for the rest of the terminal session:

```sh
export AWS_PROFILE=<profile>
export AWS_DEFAULT_REGION=<region>
```

Check that you're in the right account, as the right identity:

```sh
aws sts get-caller-identity
```

You should see something like:

```json
{
  "UserId": "AROA...:you",
  "Account": "123456789012",
  "Arn": "arn:aws:sts::123456789012:assumed-role/AdministratorAccess/you"
}
```

`Account` must be the account you want to bootstrap, and `Arn` must not end in `:root`. Then check the region:

```sh
aws configure list
```

The `region` row must say the region you chose.

### 3. Check for an existing GitHub OIDC provider

```sh
aws iam list-open-id-connect-providers \
  --query "OpenIDConnectProviderList[?ends_with(Arn, '/token.actions.githubusercontent.com')].Arn" \
  --output text
```

- **Nothing printed**: there's no provider yet. The stack will create it, skip to step 4.
- **An ARN printed** (`arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com`): someone already created one in this account. Keep that ARN, it's the value of `ExistingGitHubOidcProviderArn` in step 5. Also check that it accepts the `sts.amazonaws.com` audience:

  ```sh
  aws iam get-open-id-connect-provider --open-id-connect-provider-arn <arn> --query ClientIDList
  ```

  The list must include `"sts.amazonaws.com"`. If it doesn't, add it with `aws iam add-client-id-to-open-id-connect-provider --open-id-connect-provider-arn <arn> --client-id sts.amazonaws.com`.

### 4. Choose `GitHubSubjects`

`GitHubSubjects` is the list of GitHub repos (and environments) that are allowed to assume the deployer role. Each entry is a pattern for the `sub` claim of the GitHub OIDC token, which for our workflows looks like `<prefix>:environment:<env>`. Entries are separated by commas, with no spaces.

The prefix depends on the repo's settings, so look it up for each repo instead of guessing it ([GitHub CLI](https://cli.github.com/), with read access to the repo):

```sh
gh api repos/<owner>/<repo>/actions/oidc/customization/sub --jq .sub_claim_prefix
```

- Most repos print `repo:<owner>/<repo>`, for example `repo:pianeta051/wCleaner`.
- Repos with **immutable subject claims** (`"use_immutable_subject": true`, the default for newer repos) print the owner and repo with their numeric IDs, for example `repo:pianeta051@<owner id>/wCleaner@<repo id>`. The token carries that form, so `repo:pianeta051/wCleaner:…` would **not** match. (Those IDs don't change if the repo is renamed or a repo with the same name is created later, which is the point.)

Then add `:environment:*` to each prefix:

```
repo:pianeta051/wCleaner:environment:*
```

To only allow one environment, replace the `*` with its name (for example `repo:pianeta051/wCleaner:environment:prod`). A repo that isn't listed here can't deploy to this account, even if its `AWS_ROLE_ARN` variable points at the deployer role. You can change the list later (step 8).

### 5. Deploy the stack

If there was **no** existing OIDC provider in step 3:

```sh
aws cloudformation deploy \
  --stack-name wcleaner-bootstrap \
  --template-file infra/bootstrap.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    "GitHubSubjects=repo:pianeta051/wCleaner:environment:*"
```

If there **was** one, also pass its ARN:

```sh
aws cloudformation deploy \
  --stack-name wcleaner-bootstrap \
  --template-file infra/bootstrap.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    "GitHubSubjects=repo:pianeta051/wCleaner:environment:*" \
    "ExistingGitHubOidcProviderArn=arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
```

Replace the `GitHubSubjects` value with the one you chose in step 4. Keep the quotes: without them, the shell tries to expand the `*`.

The command waits until the stack is done, which takes a minute or two. You should see:

```
Waiting for changeset to be created..
Waiting for stack create/update to complete
Successfully created/updated stack - wcleaner-bootstrap
```

To follow the progress from another terminal (or afterwards), list the latest events:

```sh
aws cloudformation describe-stack-events --stack-name wcleaner-bootstrap --max-items 15 \
  --query 'StackEvents[].[Timestamp,LogicalResourceId,ResourceStatus]' --output table
```

or check the stack status, which must end up as `CREATE_COMPLETE`:

```sh
aws cloudformation describe-stacks --stack-name wcleaner-bootstrap --query 'Stacks[0].StackStatus'
```

You can also watch it in the AWS console: CloudFormation → Stacks → `wcleaner-bootstrap` → Events (make sure the console is in the region you chose). If it ends in `ROLLBACK_COMPLETE` instead, see step 9.

### 6. Read the outputs

```sh
aws cloudformation describe-stacks --stack-name wcleaner-bootstrap \
  --query 'Stacks[0].Outputs' --output table
```

| Output                | What it's for                                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ArtifactsBucketName` | The artifacts bucket. `deploy.sh` reads it from the stack, you don't need to copy it anywhere.                                                                    |
| `DeployerRoleArn`     | `arn:aws:iam::<account id>:role/wcleaner-github-deployer`. Goes into the `AWS_ROLE_ARN` variable of each GitHub repo that deploys to this account (next step).    |
| `ExecutionRoleArn`    | `arn:aws:iam::<account id>:role/wcleaner-cfn-execution`. `deploy.sh` reads it from the stack and passes it to CloudFormation, you don't need to copy it anywhere. |

### 7. Next step: connect the GitHub repos

Bootstrapping is per account; connecting GitHub is per repo. For each repo listed in `GitHubSubjects`, follow [Deploying with GitHub Actions](#deploying-with-github-actions), using the `DeployerRoleArn` output from step 6.

### 8. Updating the bootstrap later

Run the same `aws cloudformation deploy` command again when:

- `infra/bootstrap.yaml` has changed (for example, a new subsystem needs new execution role permissions). Pull the latest version first.
- A repo has to be added to or removed from `GitHubSubjects`.

Parameters you don't pass keep their current value. So:

- When only the template changed, pass no parameters at all (drop the `--parameter-overrides` lines).
- When changing `GitHubSubjects`, pass the **full new list**, not just the new entry. It replaces the old one.
- **Never pass `ExistingGitHubOidcProviderArn` on an update.** If the stack created the provider, passing its ARN now would make CloudFormation delete the provider it owns, breaking the deployer role.

To see the current parameter values:

```sh
aws cloudformation describe-stacks --stack-name wcleaner-bootstrap \
  --query 'Stacks[0].Parameters' --output table
```

Preview the update before applying it, by adding `--no-execute-changeset`. For example, to add the second repo:

```sh
aws cloudformation deploy \
  --stack-name wcleaner-bootstrap \
  --template-file infra/bootstrap.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-execute-changeset \
  --parameter-overrides \
    "GitHubSubjects=repo:pianeta051/wCleaner:environment:*,repo:pianeta051/wCleaner:environment:*"
```

It prints a `describe-change-set` command with the ARN of the change set it created. Use that ARN to list what it would change:

```sh
aws cloudformation describe-change-set --stack-name wcleaner-bootstrap --change-set-name <change set ARN> \
  --query 'Changes[].ResourceChange.[Action,LogicalResourceId,Replacement]' --output table
```

Expect `Modify` on the roles, with `Replacement` `False`. If the bucket or the OIDC provider shows up as `Remove` or with `Replacement` `True`, stop and check the parameters. If it looks right, apply it and wait:

```sh
aws cloudformation execute-change-set --stack-name wcleaner-bootstrap --change-set-name <change set ARN>
aws cloudformation wait stack-update-complete --stack-name wcleaner-bootstrap
```

(or run the command again without `--no-execute-changeset`). If there's nothing to change, `deploy` says `No changes to deploy. Stack wcleaner-bootstrap is up to date`, that's fine.

### 9. Troubleshooting

**Find out why it failed.** `deploy` prints `Failed to create/update the stack`. List the failed events:

```sh
aws cloudformation describe-stack-events --stack-name wcleaner-bootstrap \
  --query "StackEvents[?contains(ResourceStatus, 'FAILED')].[LogicalResourceId,ResourceStatusReason]" --output table
```

The first failure (bottom of the list) is the real cause; the rest are usually `Resource creation cancelled`.

**The stack is in `ROLLBACK_COMPLETE`.** That happens when the very first create fails. A stack in that state can't be updated, it has to be deleted before trying again:

```sh
aws cloudformation delete-stack --stack-name wcleaner-bootstrap
aws cloudformation wait stack-delete-complete --stack-name wcleaner-bootstrap
```

**The bucket is left behind.** The artifacts bucket has `DeletionPolicy: Retain`, so it survives deleting the stack (and also a failed create). Since it has a fixed name, the next create fails with `wcleaner-artifacts-... already exists`. It only holds artifacts that `deploy.sh` re-uploads, so empty it and delete it:

```sh
BUCKET=wcleaner-artifacts-$(aws sts get-caller-identity --query Account --output text)-$AWS_DEFAULT_REGION
aws s3 rm "s3://$BUCKET" --recursive
aws s3 rb "s3://$BUCKET"
```

(Alternatively, an existing bucket can be imported into the stack with a change set of type `IMPORT`, but there's no reason to do that for this bucket.)

**`EntityAlreadyExists` on `GitHubOidcProvider`.** There's already a GitHub OIDC provider in the account and the stack tried to create another one. Go back to step 3 and pass its ARN as `ExistingGitHubOidcProviderArn`.

**`EntityAlreadyExists` on `DeployerRole` or `ExecutionRole`.** A role named `wcleaner-github-deployer` or `wcleaner-cfn-execution` already exists, probably left over from an earlier attempt outside CloudFormation. Check what it is in IAM; if it's a leftover, delete it and try again.

**`AccessDenied` / `not authorized`.** Your profile isn't an admin in this account. Check `aws sts get-caller-identity` again (step 2).

## Deploying with GitHub Actions

Do this **once per GitHub repo** that deploys (`pianeta051/wCleaner`, and any fork that deploys to its own account). The workflow and the scripts are the same in every repo; only the repo's settings change.

### 1. What the workflow does

`.github/workflows/deploy.yml` (**Deploy infra** in the Actions tab) runs when it's started by hand (Run workflow) and on every push to the `new-infra-scaffolding` branch (temporary, until the workflow is merged). It:

1. Runs `infra/scripts/check-params.sh`, which needs no AWS credentials.
2. Gets temporary AWS credentials: GitHub issues an OIDC token for the run, and AWS exchanges it for a session of the **deployer role** (`AWS_ROLE_ARN`). The token says which repo and environment the run is for, and the role only accepts the ones listed in the bootstrap's `GitHubSubjects`.
3. Runs `infra/scripts/deploy.sh dev`, the same script as a deploy by hand. The deployer role uploads the templates and starts the CloudFormation deploy, and CloudFormation creates the resources with the **execution role**.

No AWS keys are stored in GitHub, and the credentials expire when the run ends. For now it only deploys `dev`.

### 2. Prerequisites

- The target account is bootstrapped ([Bootstrapping an AWS account](#bootstrapping-an-aws-account)).
- Its `GitHubSubjects` includes this repo, for example `repo:pianeta051/wCleaner:environment:*`. Check it with:

  ```sh
  aws cloudformation describe-stacks --stack-name wcleaner-bootstrap \
    --query "Stacks[0].Parameters[?ParameterKey=='GitHubSubjects'].ParameterValue" --output text
  ```

  If the repo isn't there, add it first ([Updating the bootstrap later](#8-updating-the-bootstrap-later)).

- The `DeployerRoleArn` output of the bootstrap stack ([Read the outputs](#6-read-the-outputs)).
- Admin access to the GitHub repo (to change its settings).

### 3. Connect the repo

**Repository variables.** In the repo on GitHub: Settings → Secrets and variables → Actions → **Variables** tab → New repository variable. Add these two (variables, not secrets: neither is sensitive, and variables show up in the logs, which helps when debugging):

| Name           | Value                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------ |
| `AWS_ROLE_ARN` | The bootstrap `DeployerRoleArn`, `arn:aws:iam::<account id>:role/wcleaner-github-deployer` |
| `AWS_REGION`   | The region the account was bootstrapped in                                                 |

**Environments.** Settings → Environments → New environment, create `dev`, and also `prod` (not used by the workflow yet). The job runs in the `dev` environment, which is what puts `environment:dev` in the OIDC token. You can leave the environments without protection rules for now; `prod` will get required reviewers once the workflow deploys it.

If an environment ever needs another account, add an `AWS_ROLE_ARN` (and `AWS_REGION` if different) **environment variable** on that environment (Settings → Environments → the environment → Environment variables). Jobs in that environment use it instead of the repository one, and nothing else changes. That account must be bootstrapped with this repo in its `GitHubSubjects`.

### 4. Run a deploy

Actions → **Deploy infra** → Run workflow → pick the branch → Run workflow. Or push to `new-infra-scaffolding`.

A successful run is green and ends with the `deploy.sh` output: `Successfully created/updated stack - wcleaner-dev` (or `No changes to deploy. Stack wcleaner-dev is up to date` if nothing changed), then a table with the stack outputs (for now, `PlaceholderMessage` = `wcleaner-dev placeholder is deployed`).

In the AWS console (in the `AWS_REGION` region), CloudFormation → Stacks shows `wcleaner-dev` and its nested stack in `CREATE_COMPLETE` or `UPDATE_COMPLETE`.

Runs for the same environment wait for each other, so two pushes in a row don't deploy at the same time. Runs from different repos aren't coordinated: if two repos deploy to the same account, don't run them at the same time.

### 5. Troubleshooting

**`Not authorized to perform sts:AssumeRoleWithWebIdentity`** in the `configure-aws-credentials` step. AWS rejected the OIDC token. Either:

- the repo or environment isn't in `GitHubSubjects` (check it as in step 2; the run's token is for `<prefix>:environment:dev`). Add it ([Updating the bootstrap later](#8-updating-the-bootstrap-later)). Even if the repo looks listed, check its prefix as in [Choose `GitHubSubjects`](#4-choose-githubsubjects): with immutable subject claims the token says `repo:<owner>@<id>/<repo>@<id>`, which `repo:<owner>/<repo>:…` doesn't match.
- `AWS_ROLE_ARN` is wrong or points at another account. Compare it with the bootstrap `DeployerRoleArn` output.

**`Input required and not supplied: aws-region`**, or `role-to-assume` empty: the `AWS_REGION` / `AWS_ROLE_ARN` variables are missing, or were added as secrets instead of variables (step 3).

**`Couldn't read the wcleaner-bootstrap outputs`** from `deploy.sh`: the login worked, but `AWS_REGION` isn't the region the account was bootstrapped in, so the script can't find the `wcleaner-bootstrap` stack. Fix the variable.

**`Credentials could not be loaded`** / `Could not fetch an OIDC token`: the run can't get an OIDC token. This is always the case for `pull_request` runs from forks (GitHub doesn't give them one), which is why deploys only run on push and dispatch in the repo itself.

**`AccessDenied` / `not authorized to perform` while CloudFormation creates a resource.** The deploy reached CloudFormation, but the execution role lacks a permission the templates need. `deploy.sh` prints the failed resources with the reason. Add the permission to `ExecutionRole` in `infra/bootstrap.yaml` (and the [Permissions](#permissions) table), then an admin updates the bootstrap stack ([Updating the bootstrap later](#8-updating-the-bootstrap-later)). CI can't do that itself, on purpose.

**`AccessDenied` for `wcleaner-github-deployer`** itself (before CloudFormation starts, for example on `s3:PutObject` or `cloudformation:CreateChangeSet`): the deployer role is missing a permission. Same fix, in `DeployerRole`.

**`wcleaner-dev is in ROLLBACK_COMPLETE`.** The first create of the stack failed. Fix the cause (the failure printed by the run), then an admin deletes the stack, with the commands `deploy.sh` prints, and you run the workflow again. The deployer role can't delete stacks.

## Environments and parameters

`dev` and `prod` run **exactly the same templates**, in whatever account they're deployed to. Everything that differs between them is a parameter value in `infra/params/<env>.json`:

```json
[{ "ParameterKey": "Environment", "ParameterValue": "dev" }]
```

The rules:

- **`Environment` is only a label**, used in resource names (`wcleaner-<env>-…`), tags and outputs. No condition, `Fn::If` or mapping in the templates ever looks at it.
- **Every difference is an explicit parameter with a neutral name** (`DomainName`, `LogRetentionDays`, `CertificateArn`…), never "if prod then…". A condition on a parameter's value is fine when it's a real setting (for example "is `CertificateArn` empty"), never on which environment it is.
- **No defaults for values that differ between environments**, so a forgotten value fails the deploy instead of quietly using dev's value in prod. Defaults are only for values that are the same everywhere.
- **No secrets in the params files.** They're committed. If a secret is ever needed, the parameter holds the name of an SSM parameter or Secrets Manager secret, not the value.
- **The params files are the only source of values**, for local and CI deploys alike. `deploy.sh` takes no overrides.

Moving an environment to another account means changing the params files (if anything differs there) and the repo's `AWS_ROLE_ARN` / `AWS_REGION`, never the templates.

**Adding a parameter**: add it to `Parameters` in `infra/main.yaml` (and pass it down to the nested stacks that need it), then add the key to **every** `infra/params/*.json` file in the same commit. Then run:

```sh
infra/scripts/check-params.sh
```

It needs no AWS credentials and prints `Params files OK`, or fails if the files don't all have the same keys, a key isn't a parameter of `main.yaml`, or a file's `Environment` isn't its own name. The deploy workflow runs it before deploying.

## Deploying an environment by hand

GitHub Actions is the normal way to deploy, but `deploy.sh` is the same script CI runs, so a local deploy does exactly what CI does. It's useful while writing a new nested stack, or to deploy an environment the workflow doesn't deploy yet (`prod`).

**Prerequisites**: AWS CLI v2, [`jq`](https://jqlang.org/), the account is [bootstrapped](#bootstrapping-an-aws-account), and a CLI profile in that account that can do at least what the [deployer role](#deployer-role-wcleaner-github-deployer) can (an admin profile works). Point the CLI at it and at the bootstrap region:

```sh
export AWS_PROFILE=<profile>
export AWS_DEFAULT_REGION=<region>
aws sts get-caller-identity
```

Then, from the repo root:

```sh
infra/scripts/check-params.sh
infra/scripts/deploy.sh dev
```

The script:

1. Prints the account and region it's deploying to. Stop it (Ctrl-C) if they're not the ones you expect.
2. Reads `ArtifactsBucketName` and `ExecutionRoleArn` from the `wcleaner-bootstrap` outputs, so nothing account-specific is hardcoded.
3. Packages `infra/main.yaml`: uploads the nested templates to the artifacts bucket under `<env>/` and writes `.build/main.packaged.yaml` (gitignored).
4. Deploys `wcleaner-<env>` with a change set, with the values from `infra/params/<env>.json` and the execution role, so CloudFormation creates the resources with exactly the same permissions as in CI.
5. Prints the stack outputs.

What you should see at the end is `Successfully created/updated stack - wcleaner-dev` (or `No changes to deploy. Stack wcleaner-dev is up to date`), and the outputs table. Running it again with no changes is safe: the change set is empty and it doesn't fail.

If the deploy fails, the script lists the failed resources with their reasons, including inside nested stacks; the first one is usually the cause. The fixes are the same as in [the GitHub Actions troubleshooting](#5-troubleshooting): a missing permission goes in `bootstrap.yaml`, and a stack in `ROLLBACK_COMPLETE` is deleted by an admin with the commands the script prints.
## Permissions

`infra/bootstrap.yaml` is the source of truth; these tables mirror it. Every change to the roles in `bootstrap.yaml` updates them in the same commit.

### Bootstrap admin (a person)

| Service | Actions | Resource          | Why                                                                                                                                                                                                   |
| ------- | ------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All     | Admin   | The whole account | Deploying and updating `wcleaner-bootstrap` creates IAM roles, an OIDC provider and an S3 bucket. Also break-glass operations the roles can't do, like deleting a stack stuck in `ROLLBACK_COMPLETE`. |

Any admin identity in the account works (an SSO admin role, an admin IAM role…), never the root user. Nothing in the repo depends on how it's set up.

### Deployer role (`wcleaner-github-deployer`)

Assumed by GitHub Actions through OIDC. The trust policy only accepts tokens with audience `sts.amazonaws.com` whose `sub` matches one of the `GitHubSubjects` patterns.

| Service        | Actions                                                                                                                                                                                                                                   | Resource                        | Why                                                                                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CloudFormation | `CreateStack`, `UpdateStack`, `DescribeStacks`, `DescribeStackEvents`, `DescribeStackResources`, `ListStackResources`, `GetTemplate`, `GetTemplateSummary`, `CreateChangeSet`, `DescribeChangeSet`, `ExecuteChangeSet`, `DeleteChangeSet` | `wcleaner-*` stacks, any region | Deploying the environment stacks with `aws cloudformation deploy` (change sets) and reporting progress. Any region so the `us-east-1` certificate stack fits later. |
| CloudFormation | **Deny** everything except `Describe*`, `Get*`, `List*`                                                                                                                                                                                   | `wcleaner-bootstrap` stack      | The bootstrap stack is only changed by an admin. `deploy.sh` still needs to read its outputs.                                                                       |
| CloudFormation | `ValidateTemplate`                                                                                                                                                                                                                        | `*`                             | Template validation; this action has no resource-level permissions.                                                                                                 |
| S3             | `PutObject`, `GetObject`                                                                                                                                                                                                                  | Objects in the artifacts bucket | `aws cloudformation package` uploads the nested templates (and later the Lambda code).                                                                              |
| S3             | `ListBucket`                                                                                                                                                                                                                              | The artifacts bucket            | `package` checks whether an object is already uploaded, to skip it.                                                                                                 |
| IAM            | `PassRole`, only to `cloudformation.amazonaws.com`                                                                                                                                                                                        | The execution role              | Lets CloudFormation create the resources with the execution role (`--role-arn`). This is the only role it can pass.                                                 |

Deliberately missing: `DeleteStack` (deleting an environment is a human action), any change to the bootstrap stack, and any permission to create resources directly.

### Execution role (`wcleaner-cfn-execution`)

Only assumable by CloudFormation (`cloudformation.amazonaws.com`). Used for every `wcleaner-<env>` deploy, from CI and by hand.

| Service        | Actions                                                       | Resource                        | Why                                                                                                        |
| -------------- | ------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| CloudFormation | `CreateStack`, `UpdateStack`, `DeleteStack`, `DescribeStacks` | `wcleaner-*` stacks, any region | Creating, updating and deleting the nested stacks, which CloudFormation does with the parent stack's role. |
| IAM            | `PassRole`, only to `cloudformation.amazonaws.com`            | The execution role itself       | CloudFormation hands the parent stack's role on to each nested stack it creates.                           |
| S3             | `GetObject`                                                   | Objects in the artifacts bucket | Reading the nested templates (and later the Lambda code).                                                  |

Each new subsystem adds the permissions its resources need, scoped to `wcleaner-*` names where the service allows it. In particular, IAM permissions (when stacks start creating roles) are limited to `arn:aws:iam::<account id>:role/wcleaner-*`.
