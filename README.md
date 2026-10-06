# wCleaner

Software to manage a cleaning business. Make a booking, calendar, list of clients etc.

The app is moving off AWS Amplify (see [meta/refactor-plan.md](meta/refactor-plan.md)). Until the cutover, **production still runs on the old Amplify app** (`amplify.yml`, `amplify/`): don't remove or change those yet.

- [Run the front-end locally](#run-the-front-end-locally)
- [Bootstrap an AWS account](#bootstrap-an-aws-account)
- [Update the bootstrap stack](#update-the-bootstrap-stack)
- [Configure a GitHub repo](#configure-a-github-repo)
- [Deploy an environment](#deploy-an-environment)
- [Add a parameter](#add-a-parameter)

## Run the front-end locally

The front-end still reads its backend config from `src/amplifyconfiguration.json`, which isn't committed. Once, install the [Amplify CLI](https://docs.amplify.aws/cli/start/install/), then copy the `amplify pull` command from the Amplify console (your app → Back end) and run it in the repo. Then:

```sh
yarn install
yarn start
```

## Bootstrap an AWS account

**When:** once per AWS account, before anything can be deployed to it. Needs an admin profile in that account (never root). It creates the artifacts bucket, the GitHub OIDC provider, the deployer role (used by GitHub Actions) and the execution role (used by CloudFormation).

**Requires:** AWS CLI v2, [`jq`](https://jqlang.org/), the repo checked out on `main`. Run everything from the repo root.

1. List the GitHub repos allowed to deploy to this account in `infra/bootstrap.env` (gitignored, so each admin keeps their own):

   ```sh
   cp infra/bootstrap.env.example infra/bootstrap.env
   ```

   Edit it and set `GITHUB_REPOS`, separated by spaces:

   ```sh
   GITHUB_REPOS="pianeta051/wCleaner"
   ```

   **Private repos:** the script can't look up their OIDC prefix, so write the prefix instead of `<owner>/<repo>`. It's `repo:<owner>/<repo>`, or `repo:<owner>@<owner id>/<repo>@<repo id>` if the repo uses immutable subject claims. Ask a repo admin if unsure.

2. Point the CLI at the account and the region the stacks will live in, and check it:

   ```sh
   export AWS_PROFILE=<profile>
   export AWS_DEFAULT_REGION=<region>
   aws sts get-caller-identity   # Account must be the target one, Arn must not end in :root
   ```

3. Deploy:

   ```sh
   infra/scripts/deploy-bootstrap.sh
   ```

   It prints the account, region and `GitHubSubjects` first: Ctrl-C if they're wrong. It reuses the account's GitHub OIDC provider if there's one already. It should end with `Successfully created/updated stack - wcleaner-bootstrap` and the stack outputs. You'll need `DeployerRoleArn` to [configure the GitHub repo](#configure-a-github-repo).

## Update the bootstrap stack

**When:** `infra/bootstrap.yaml` changed (e.g. the execution role needs a new permission), or a repo has to be added to or removed from the account. Admin only: CI can't change this stack.

1. Pull the latest `main`. To change the repos, edit `GITHUB_REPOS` in `infra/bootstrap.env` (it's the full list, not just the new ones).
2. Do [step 2 above](#bootstrap-an-aws-account) and run `infra/scripts/deploy-bootstrap.sh` again. If nothing changed it says `No changes to deploy`.

## Configure a GitHub repo

**When:** once per GitHub repo that deploys (`pianeta051/wCleaner`, or a fork deploying to its own account), after the AWS account is [bootstrapped](#bootstrap-an-aws-account) with that repo in `GitHubSubjects`. Needs admin access to the repo.

1. Check the repo is allowed to deploy (it must appear in the list):

   ```sh
   aws cloudformation describe-stacks --stack-name wcleaner-bootstrap \
     --query "Stacks[0].Parameters[?ParameterKey=='GitHubSubjects'].ParameterValue" --output text
   ```

   If it's missing, [update the bootstrap stack](#update-the-bootstrap-stack) first.

2. Get the deployer role ARN:

   ```sh
   aws cloudformation describe-stacks --stack-name wcleaner-bootstrap \
     --query "Stacks[0].Outputs[?OutputKey=='DeployerRoleArn'].OutputValue" --output text
   ```

3. Add the repository variables. On the repo's page on github.com:
   1. Click **Settings** (top bar, right of Insights; only visible to admins).
   2. In the left sidebar, open **Secrets and variables** → **Actions**.
   3. Pick the **Variables** tab (not Secrets), and click **New repository variable**.
   4. Enter the name and value, then **Add variable**. Repeat for each:

   | Name           | Value                                      |
   | -------------- | ------------------------------------------ |
   | `AWS_ROLE_ARN` | The ARN from step 2                        |
   | `AWS_REGION`   | The region the account was bootstrapped in |

4. Create the environments. **Settings** → **Environments** (left sidebar) → **New environment** → name it `dev` → **Configure environment**. You don't need to change anything on the next page. Go back and do the same for `prod`.

5. Check it works. Open the **Actions** tab, pick **Deploy infra** in the left sidebar, then the **Run workflow** dropdown on the right → branch `main` → **Run workflow**. Refresh and click the new run to follow it. It should go green, and the **Deploy** step should end with `Successfully created/updated stack - wcleaner-dev` (or `No changes to deploy`).

To deploy an environment to a different account, set `AWS_ROLE_ARN` (and `AWS_REGION`) as variables on that environment instead of on the repo: **Settings** → **Environments** → click the environment → **Environment variables** → **Add environment variable**.

## Deploy an environment

### From GitHub Actions (normal way)

**When:** automatically on every push to `main`, or by hand from Actions → **Deploy infra** → Run workflow. It only deploys `dev` for now.

A successful run ends with `Successfully created/updated stack - wcleaner-dev` (or `No changes to deploy`) and the stack outputs.

### Locally

**When:** while developing a new nested stack, or to deploy an environment the workflow doesn't deploy yet (`prod`). It runs the same script as CI.

**Requires:** AWS CLI v2, [`jq`](https://jqlang.org/), and a profile in the bootstrapped account with at least the deployer role's permissions (an admin profile works).

```sh
export AWS_PROFILE=<profile>
export AWS_DEFAULT_REGION=<bootstrap region>
aws sts get-caller-identity

infra/scripts/check-params.sh
infra/scripts/deploy.sh <env>   # dev or prod
```

The script prints the account and region first: Ctrl-C if they're wrong. It's safe to re-run with no changes.

## Add a parameter

Everything that differs between `dev` and `prod` is a parameter in `infra/params/<env>.json`; the templates never check which environment they're in.

1. Add it to `Parameters` in `infra/main.yaml` (and pass it to the nested stacks that need it). No default if the value differs between environments.
2. Add the key to **every** `infra/params/*.json` in the same commit. No secrets: store the name of an SSM parameter / Secrets Manager secret instead.
3. Check (no AWS credentials needed), it should print `Params files OK`:

   ```sh
   infra/scripts/check-params.sh
   ```
