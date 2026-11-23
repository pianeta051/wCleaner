# wCleaner

Software to manage a cleaning business. Make a booking, calendar, list of clients etc.

The app is moving off AWS Amplify (see [meta/refactor-plan.md](meta/refactor-plan.md)). Until the cutover, **production still runs on the old Amplify app** (`amplify.yml`, `amplify/`): don't remove or change those yet.

- [Run the front-end locally](#run-the-front-end-locally)
- [Bootstrap an AWS account](#bootstrap-an-aws-account)
- [Update the bootstrap stack](#update-the-bootstrap-stack)
- [Configure a GitHub repo](#configure-a-github-repo)
- [Deploy an environment](#deploy-an-environment)
- [Deploy the front-end](#deploy-the-front-end)
- [Create the first admin user](#create-the-first-admin-user)
- [Add a parameter](#add-a-parameter)

## Run the front-end locally

The front-end still reads its backend config from `src/amplifyconfiguration.json`, which isn't committed. Once, install the [Amplify CLI](https://docs.amplify.aws/cli/start/install/), then copy the `amplify pull` command from the Amplify console (your app → Back end) and run it in the repo. Then:

```sh
yarn install
yarn start
```

### Against our own Cognito pool (no Amplify)

The app has a second mode that talks to a `wcleaner-<env>` user pool directly, with no Amplify library and no `amplifyconfiguration.json`. It's chosen at build time by `VITE_SWITCH_TO_NEW_INFRA`: anything other than exactly `true` (including not setting it) keeps the Amplify mode above, which is what Amplify Hosting builds.

**Requires:** the environment's infra deployed ([Deploy an environment](#deploy-an-environment)) and a user in its pool ([Create the first admin user](#create-the-first-admin-user)). Create `.env.local` (not committed):

```
VITE_SWITCH_TO_NEW_INFRA=true
VITE_COGNITO_USER_POOL_ID=<UserPoolId output of wcleaner-<env>>
VITE_COGNITO_CLIENT_ID=<UserPoolClientId output of wcleaner-<env>>
VITE_HOST=http://localhost:3000
VITE_API_URL=https://api.invalid/
VITE_ADMIN_QUERIES_URL=https://admin-queries.invalid/
```

The two outputs are in the AWS console: **CloudFormation** → `wcleaner-<env>` → **Outputs**. Then `yarn start`.

If one of the pool variables is missing the app stops at startup and says which. Sign-in, sign-out, forgot password and the profile work. The data API, AdminQueries and file storage aren't deployed yet, so the screens that use them show errors: the two `.invalid` URLs are on purpose. `VITE_HOST=http://localhost:3000` is an allowed link origin for `dev` only (`AllowedRedirectOrigins` in `infra/params/dev.json`): the emails still link to the deployed front-end unless the request comes from localhost.

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

A run has two steps: **Deploy** (the infra) and **Deploy front-end** ([below](#deploy-the-front-end)). The first ends with `Successfully created/updated stack - wcleaner-dev` (or `No changes to deploy`) and the stack outputs; the second with `Front-end published: <AppUrl>`.

### Locally

**When:** while developing a new nested stack, or to deploy an environment the workflow doesn't deploy yet (`prod`). It runs the same script as CI.

**Requires:** AWS CLI v2, [`jq`](https://jqlang.org/), Node 24 and Yarn (`deploy.sh` builds the Lambda code in `backend/functions`), and a profile in the bootstrapped account with at least the deployer role's permissions (an admin profile works).

```sh
export AWS_PROFILE=<profile>
export AWS_DEFAULT_REGION=<bootstrap region>
aws sts get-caller-identity

infra/scripts/check-params.sh
infra/scripts/deploy.sh <env>   # dev or prod
```

The script prints the account and region first: Ctrl-C if they're wrong. It's safe to re-run with no changes.

This deploys the infra only. To publish the front-end too, see [Deploy the front-end](#deploy-the-front-end).

## Deploy the front-end

**When:** after the infra of the environment is deployed, and every time the front-end code changes. The workflow does it right after the infra; locally it's a separate script.

The front-end is a static build served from a private S3 bucket through CloudFront. `infra/scripts/deploy-frontend.sh <env>` is the only way to publish it:

1. Reads `UserPoolId`, `UserPoolClientId`, `AppUrl`, `WebBucketName` and `DistributionId` from the `wcleaner-<env>` outputs (and stops with "Deploy the infra first" if one is missing).
2. Builds the app with `VITE_SWITCH_TO_NEW_INFRA=true` and those values (see [Against our own Cognito pool](#against-our-own-cognito-pool-no-amplify)), so the build talks to this environment's pool.
3. Uploads `build/` to the web bucket: the hashed files in `assets/` first, cached for a year; everything else (`index.html`, ...) with `no-cache`, deleting what's gone. Old `assets/` files are left on purpose, so a tab still open on the previous build keeps working.
4. Invalidates the CloudFront cache (`/*`) and prints the URL. The invalidation takes a few minutes; the new version can take that long to show up.

**`AppUrl`** is the front-end's URL: `https://<something>.cloudfront.net`, an output of `wcleaner-<env>` (`aws cloudformation describe-stacks --stack-name wcleaner-<env> --query "Stacks[0].Outputs[?OutputKey=='AppUrl'].OutputValue" --output text`). It is **not** a parameter: the stack creates the CloudFront distribution and passes its URL to the auth stack, so the links in the invitation and password reset emails point at the front-end that uses that pool. There's no custom domain yet (`w-cleaner.com` still points at Amplify). Until the API and AdminQueries are deployed, the screens that use them show errors.

**Locally** (same requirements as [deploying locally](#locally), and permissions to upload to the web bucket and invalidate the distribution, which the deployer role has):

```sh
export AWS_PROFILE=<profile>
export AWS_DEFAULT_REGION=<bootstrap region>
infra/scripts/deploy-frontend.sh dev
```

## Create the first admin user

**When:** once per environment, after its first deploy. The new user pool starts empty, there's no sign-up page, and only an `Admin` can create users from the app. Needs console access to the account.

1. Find the pool: it's the `UserPoolId` output of `wcleaner-<env>` (the pool is named `wcleaner-<env>`; `wcleaner_user_pool` is Amplify's, leave it alone).
2. In the AWS console, open **Amazon Cognito** → **User pools** → `wcleaner-<env>` → **Users** → **Create user**:
   - **Invitation message:** Send an email invitation.
   - **Email address:** the admin's email, and tick **Mark email address as verified**.
   - **Temporary password:** Generate a password.
   - **Create user**.
3. **Groups** tab → `Admin` → **Add user to group** → pick the user → **Add**.

The invitation email has the subject `Welcome to the WCleaner app`, the temporary password and a link to `<AppUrl>/log-in`, the front-end of the same environment ([Deploy the front-end](#deploy-the-front-end)). The first sign-in asks for a new password.

## Add a parameter

Everything that differs between `dev` and `prod` is a parameter in `infra/params/<env>.json`; the templates never check which environment they're in.

`AppUrl` isn't one of them: it's an output of the hosting stack.

1. Add it to `Parameters` in `infra/main.yaml` (and pass it to the nested stacks that need it). No default if the value differs between environments.
2. Add the key to **every** `infra/params/*.json` in the same commit. No secrets: store the name of an SSM parameter / Secrets Manager secret instead.
3. Check (no AWS credentials needed), it should print `Params files OK`:

   ```sh
   infra/scripts/check-params.sh
   ```
