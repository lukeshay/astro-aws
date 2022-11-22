#!/bin/bash

set -e

ENVIRONMENT="${1:-DEV}"
AWS_ARGS="${@:2}"
AWS_ACCOUNT="$(aws sts get-caller-identity --query Account --output text ${AWS_ARGS})"
AWS_REGION="$(aws configure get region ${AWS_ARGS})"

echo "ENVIRONMENT: ${ENVIRONMENT}"
echo "AWS_ARGS: ${AWS_ARGS}"
echo "AWS_ACCOUNT: ${AWS_ACCOUNT}"
echo "AWS_REGION: ${AWS_REGION}"

DISTIRBUTION_ID="$(aws cloudformation describe-stacks --stack-name "AstroAWSStack-${ENVIRONMENT}-${AWS_ACCOUNT}-${AWS_REGION}" --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" --output text ${AWS_ARGS})"
PATHS="$(jq -r ". | join(\" \")" ../www/dist/invalidationPaths.json)"

echo "Invalidating CloudFront distribution ${DISTIRBUTION_ID}: ${PATHS}"

aws cloudfront create-invalidation --distribution-id "${DISTIRBUTION_ID}" --paths ${PATHS} ${AWS_ARGS}
