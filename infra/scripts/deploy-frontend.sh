#!/usr/bin/env bash
# Builds the front-end and publishes it: infra/scripts/deploy-frontend.sh <env>
# The only way to publish the front-end of wcleaner-<env>, locally and in CI.
# Everything the build needs comes from the outputs of the wcleaner-<env> stack,
# so deploy the infra first (infra/scripts/deploy.sh <env>).
# Uses whatever AWS credentials and region the CLI is configured with.
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <env>   (the build configuration comes from the wcleaner-<env> stack outputs)" >&2
  exit 1
fi
ENV=$1

cd "$(dirname "$0")/../.."
STACK=wcleaner-$ENV
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region || true)
REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-$REGION}}
echo "Publishing the front-end of $STACK to account $ACCOUNT, region $REGION"

stack_output() {
  local value
  value=$(aws cloudformation describe-stacks --stack-name "$STACK" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text 2>/dev/null || true)
  if [ -z "$value" ] || [ "$value" = None ]; then
    echo "$STACK has no output $1. Deploy the infra first: infra/scripts/deploy.sh $ENV" >&2
    exit 1
  fi
  echo "$value"
}
USER_POOL_ID=$(stack_output UserPoolId)
USER_POOL_CLIENT_ID=$(stack_output UserPoolClientId)
APP_URL=$(stack_output AppUrl)
WEB_BUCKET=$(stack_output WebBucketName)
DISTRIBUTION_ID=$(stack_output DistributionId)

# Vite bakes the VITE_* variables into the build, and variables already in the
# environment win over .env files, so a stray .env.local can't change these.
export VITE_SWITCH_TO_NEW_INFRA=true
export VITE_COGNITO_USER_POOL_ID=$USER_POOL_ID
export VITE_COGNITO_CLIENT_ID=$USER_POOL_CLIENT_ID
export VITE_HOST=$APP_URL
# The API and AdminQueries aren't deployed yet: these point at the reserved
# .invalid TLD, which never resolves, so those screens fail fast. Replace them
# with stack outputs in the API and AdminQueries slices.
export VITE_API_URL=https://api.invalid/
export VITE_ADMIN_QUERIES_URL=https://admin-queries.invalid/

yarn install --frozen-lockfile
yarn build:cd
if [ ! -f build/index.html ]; then
  echo "The build didn't produce build/index.html" >&2
  exit 1
fi

# Hashed assets first: a visitor never gets an index.html that points at chunks
# that aren't there yet. They never change, so they cache for a year. Old ones
# stay (no --delete): tabs still open on the previous build keep their chunks.
aws s3 sync build/assets "s3://$WEB_BUCKET/assets" \
  --cache-control "public,max-age=31536000,immutable"
# Everything else (index.html, favicon, ...) is revalidated on every load.
aws s3 sync build "s3://$WEB_BUCKET" \
  --exclude "assets/*" --delete \
  --cache-control "no-cache"

INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" --query Invalidation.Id --output text)
echo "Invalidation $INVALIDATION_ID started (takes a few minutes to finish)"
echo "Front-end published: $APP_URL"
