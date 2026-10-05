# wCleaner

Software to manage a cleaning business. Make a booking, calendar, list of clients etc.

# Base project

- Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- Install the Amplify CLI: https://docs.amplify.aws/cli/start/install/#configure-the-amplify-cli
- Create a new access/secret key for my role in IAM
- Add the credentials to your CLI using `aws configure`
- Run `amplify init` in your project
- Go to your app in Amplify
- Navigate to the "Back end" section
- Copy the command to pull the back end and use it in your project

# AWS setup

The infrastructure is defined with CloudFormation templates in `infra/`.

There are two kinds of stacks:

- **`wcleaner-bootstrap`** (`infra/bootstrap.yaml`): once per AWS account, deployed by hand by an admin. It creates what the deploys need to exist beforehand.
- **`wcleaner-<env>`** (`infra/main.yaml` and its nested stacks): one per environment (`dev`, `prod`), deployed by `infra/scripts/deploy.sh`, locally or from GitHub Actions.

## Bootstrapping an AWS account

### 1. What this is and when to do it

Do this **once per AWS account**, before anything can be deployed to it. It has to be done by a person with admin rights in that account. The `wcleaner-bootstrap` stack creates:

- **Artifacts bucket** (`wcleaner-artifacts-<account id>-eu-west-2`): where `deploy.sh` uploads the packaged nested templates (and later the Lambda code). CloudFormation can only read nested templates from S3. Shared by all environments in the account, under one prefix per environment. Objects expire after 90 days, they're re-uploaded when needed.
- **GitHub OIDC provider** (`token.actions.githubusercontent.com`): lets GitHub Actions get temporary AWS credentials without storing any AWS keys in GitHub. Only one can exist per account, so if there's one already, it's reused (see step 3).
- **Deployer role** (`wcleaner-github-deployer`): the role GitHub Actions assumes. It can only drive CloudFormation on `wcleaner-*` stacks, upload to the artifacts bucket and hand the execution role over to CloudFormation. It can't create resources itself.
- **Execution role** (`wcleaner-cfn-execution`): the role CloudFormation uses to actually create the resources of the `wcleaner-<env>` stacks. Its permissions grow as new subsystems are added.

CI can't create any of this itself: it needs these roles to be able to log in to AWS in the first place, and creating IAM roles needs admin rights, which CI never gets. For the same reason, the deployer role is explicitly denied any change to the `wcleaner-bootstrap` stack: changing it is always a manual, admin action.

See [Permissions](#permissions) for exactly what each role can do.

### 2. Prerequisites

- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
- A CLI profile with admin rights in the target account (never the root user).
- A checkout of this repo, with the version of `infra/bootstrap.yaml` you want to deploy (normally the main branch). All the commands below are run from the repo root.

Point the CLI at the right profile and region for the rest of the terminal session:

```sh
export AWS_PROFILE=<profile>
export AWS_DEFAULT_REGION=eu-west-2
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

The `region` row must say `eu-west-2`.

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

`GitHubSubjects` is the list of GitHub repos (and environments) that are allowed to assume the deployer role. Each entry is a pattern for the `sub` claim of the GitHub OIDC token, which for our workflows looks like `repo:<owner>/<repo>:environment:<env>`. Entries are separated by commas, with no spaces.

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

You can also watch it in the AWS console: CloudFormation → Stacks → `wcleaner-bootstrap` → Events (make sure the console is in eu-west-2, London). If it ends in `ROLLBACK_COMPLETE` instead, see step 9.

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
BUCKET=wcleaner-artifacts-$(aws sts get-caller-identity --query Account --output text)-eu-west-2
aws s3 rm "s3://$BUCKET" --recursive
aws s3 rb "s3://$BUCKET"
```

(Alternatively, an existing bucket can be imported into the stack with a change set of type `IMPORT`, but there's no reason to do that for this bucket.)

**`EntityAlreadyExists` on `GitHubOidcProvider`.** There's already a GitHub OIDC provider in the account and the stack tried to create another one. Go back to step 3 and pass its ARN as `ExistingGitHubOidcProviderArn`.

**`EntityAlreadyExists` on `DeployerRole` or `ExecutionRole`.** A role named `wcleaner-github-deployer` or `wcleaner-cfn-execution` already exists, probably left over from an earlier attempt outside CloudFormation. Check what it is in IAM; if it's a leftover, delete it and try again.

**`AccessDenied` / `not authorized`.** Your profile isn't an admin in this account. Check `aws sts get-caller-identity` again (step 2).

## Deploying with GitHub Actions

_Not written yet._

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
| S3             | `GetObject`                                                   | Objects in the artifacts bucket | Reading the nested templates (and later the Lambda code).                                                  |

Each new subsystem adds the permissions its resources need, scoped to `wcleaner-*` names where the service allows it. In particular, IAM permissions (when stacks start creating roles) are limited to `arn:aws:iam::<account id>:role/wcleaner-*`.
