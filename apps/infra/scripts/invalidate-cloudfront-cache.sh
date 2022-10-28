#!/bin/bash

set -e

AWS_ACCOUNT="$(aws sts get-caller-identity --query Account --output text ${@})"
AWS_REGION="$(aws configure get region ${@})"

DISTIRBUTION_ID="$(aws cloudformation describe-stacks --stack-name "AstroAWSStack-${AWS_ACCOUNT}-${AWS_REGION}" --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" --output text ${@})"
PATHS="$(jq -r ". | join(\" \")" ../www/dist/invalidationPaths.json)"

echo "Invalidating CloudFront distribution ${DISTIRBUTION_ID}: ${PATHS}"

aws cloudfront create-invalidation --distribution-id "${DISTIRBUTION_ID}" --paths ${PATHS} ${@}
