#!/usr/bin/env bash
# Deploys (creates or updates) wcleaner-bootstrap: infra/scripts/deploy-bootstrap.sh
# Run by hand by an admin of the target account, never by CI. The repos allowed
# to deploy come from infra/bootstrap.env (gitignored, see bootstrap.env.example).
# Uses whatever AWS credentials and region the CLI is configured with.
set -euo pipefail

cd "$(dirname "$0")/../.."
CONFIG=infra/bootstrap.env
if [ ! -f "$CONFIG" ]; then
  echo "No $CONFIG. Copy infra/bootstrap.env.example to $CONFIG and list the repos in it." >&2
  exit 1
fi
GITHUB_REPOS=""
# shellcheck source=/dev/null
source "$CONFIG"
if [ -z "$GITHUB_REPOS" ]; then
  echo "GITHUB_REPOS is empty in $CONFIG" >&2
  exit 1
fi

# Each repo becomes "<sub claim prefix>:environment:*". The prefix depends on the
# repo's settings (immutable subject claims use numeric IDs), so ask GitHub. That
# only works for public repos; private ones are written as the full prefix.
SUBJECTS=()
for repo in $GITHUB_REPOS; do
  if [[ $repo == repo:* ]]; then
    prefix=$repo
  else
    prefix=$(curl -fsS "https://api.github.com/repos/$repo/actions/oidc/customization/sub" | jq -r .sub_claim_prefix) || {
      echo "Couldn't read the OIDC prefix of $repo from GitHub. If it's private, write its prefix in $CONFIG instead (README, \"Bootstrap an AWS account\")." >&2
      exit 1
    }
  fi
  SUBJECTS+=("$prefix:environment:*")
done
GITHUB_SUBJECTS=$(IFS=,; echo "${SUBJECTS[*]}")

STACK=wcleaner-bootstrap
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region || true)
REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-$REGION}}
echo "Deploying $STACK to account $ACCOUNT, region $REGION"
echo "GitHubSubjects: $GITHUB_SUBJECTS"

STATUS=$(aws cloudformation describe-stacks --stack-name "$STACK" \
  --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo NONE)
if [ "$STATUS" = ROLLBACK_COMPLETE ]; then
  cat >&2 <<MSG
$STACK is in ROLLBACK_COMPLETE (its first create failed), so it can't be updated.
Check why it failed, then delete it and run this again:

  aws cloudformation delete-stack --stack-name $STACK
  aws cloudformation wait stack-delete-complete --stack-name $STACK
MSG
  exit 1
fi

PARAMS=("GitHubSubjects=$GITHUB_SUBJECTS")
# Only one GitHub OIDC provider can exist per account. On the first create, reuse
# one that's already there. On updates never pass it: if the stack created the
# provider, passing its ARN would make CloudFormation delete it.
if [ "$STATUS" = NONE ]; then
  PROVIDER=$(aws iam list-open-id-connect-providers \
    --query "OpenIDConnectProviderList[?ends_with(Arn, '/token.actions.githubusercontent.com')].Arn" \
    --output text)
  if [ -n "$PROVIDER" ] && [ "$PROVIDER" != None ]; then
    echo "Reusing the existing GitHub OIDC provider $PROVIDER"
    if ! aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$PROVIDER" \
      --query ClientIDList --output text | tr '\t' '\n' | grep -qx sts.amazonaws.com; then
      echo "Adding the sts.amazonaws.com audience to it"
      aws iam add-client-id-to-open-id-connect-provider \
        --open-id-connect-provider-arn "$PROVIDER" --client-id sts.amazonaws.com
    fi
    PARAMS+=("ExistingGitHubOidcProviderArn=$PROVIDER")
  fi
fi

aws cloudformation deploy \
  --stack-name "$STACK" \
  --template-file infra/bootstrap.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides "${PARAMS[@]}"

aws cloudformation describe-stacks --stack-name "$STACK" \
  --query 'Stacks[0].Outputs' --output table
