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

yarn build -r
yarn synth
yarn deploy "AstroAWSStack-${ENVIRONMENT}-${AWS_ACCOUNT}-${AWS_REGION}" ${AWS_ARGS}
./scripts/invalidate-cloudfront-cache.sh "${@}"
