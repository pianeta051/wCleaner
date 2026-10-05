#!/usr/bin/env bash
# Packages and deploys one environment: infra/scripts/deploy.sh <env>
# The only way to deploy wcleaner-<env>, locally and in CI. Parameter values come
# from infra/params/<env>.json only; extra overrides are refused on purpose.
# Uses whatever AWS credentials and region the CLI is configured with.
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <env>   (parameters come from infra/params/<env>.json only)" >&2
  exit 1
fi
ENV=$1

cd "$(dirname "$0")/../.."
PARAMS=infra/params/$ENV.json
if [ ! -f "$PARAMS" ]; then
  echo "No parameters file $PARAMS" >&2
  exit 1
fi

STACK=wcleaner-$ENV
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region || true)
REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-$REGION}}
echo "Deploying $STACK to account $ACCOUNT, region $REGION"

bootstrap_output() {
  aws cloudformation describe-stacks --stack-name wcleaner-bootstrap \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}
BUCKET=$(bootstrap_output ArtifactsBucketName)
EXEC_ROLE=$(bootstrap_output ExecutionRoleArn)
if [ -z "$BUCKET" ] || [ "$BUCKET" = None ] || [ -z "$EXEC_ROLE" ] || [ "$EXEC_ROLE" = None ]; then
  echo "Couldn't read the wcleaner-bootstrap outputs. Is this account bootstrapped (README, \"Bootstrapping an AWS account\")?" >&2
  exit 1
fi

# A stack whose first create failed can't be updated, only deleted. Deleting is
# an admin action (the deployer role can't), so just say what to do.
STATUS=$(aws cloudformation describe-stacks --stack-name "$STACK" \
  --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo NONE)
if [ "$STATUS" = ROLLBACK_COMPLETE ]; then
  cat >&2 <<MSG
$STACK is in ROLLBACK_COMPLETE (its first create failed), so it can't be updated.
An admin has to delete it before deploying again:

  aws cloudformation delete-stack --stack-name $STACK
  aws cloudformation wait stack-delete-complete --stack-name $STACK
MSG
  exit 1
fi

# Prints the FAILED events of a stack since $START, oldest first, and recurses
# into the nested stacks that failed, where the actual cause is.
print_failures() {
  local stack=$1 indent=$2
  local id type status reason physical
  aws cloudformation describe-stack-events --stack-name "$stack" --max-items 200 --output json |
    jq -r --arg since "$START" '
      .StackEvents
      | map(select(.Timestamp >= $since and (.ResourceStatus | endswith("FAILED"))))
      | reverse[]
      | [.LogicalResourceId, .ResourceType, .ResourceStatus, (.ResourceStatusReason // "-"), (.PhysicalResourceId // "")]
      | @tsv' |
    while IFS=$'\t' read -r id type status reason physical; do
      echo "$indent$id ($type) $status: $reason" >&2
      if [ "$type" = AWS::CloudFormation::Stack ] && [[ $physical == arn:* ]] && [ "$id" != "${stack##*/}" ]; then
        print_failures "$physical" "$indent  "
      fi
    done
}

mkdir -p .build
aws cloudformation package \
  --template-file infra/main.yaml \
  --s3-bucket "$BUCKET" \
  --s3-prefix "$ENV" \
  --output-template-file .build/main.packaged.yaml

START=$(date -u +%Y-%m-%dT%H:%M:%S)
if ! aws cloudformation deploy \
  --stack-name "$STACK" \
  --template-file .build/main.packaged.yaml \
  --role-arn "$EXEC_ROLE" \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides "file://$PARAMS"; then
  # A change set that couldn't be created already printed its reason above;
  # a failed create/update only says "Failed", so show what failed and why.
  echo >&2
  echo "Failed resources (oldest first; the first one is usually the cause):" >&2
  print_failures "$STACK" "  "
  exit 1
fi

aws cloudformation describe-stacks --stack-name "$STACK" \
  --query 'Stacks[0].Outputs' --output table
