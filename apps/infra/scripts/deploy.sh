#!/bin/bash

set -e

ENVIRONMENT="${1:-DEV}"
AWS_ARGS="${@:2}"

bun run cdk deploy --asset-parallelism --concurrency 4 --require-approval never "AstroAWS-${ENVIRONMENT}-*" ${AWS_ARGS}
