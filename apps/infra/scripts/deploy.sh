#!/bin/bash

set -e

ENVIRONMENT="${1:-DEV}"
RUNTIME="${2:-*}"
MODE="${3:-*}"
AWS_ARGS="${@:4}"

bunx cdk deploy --asset-parallelism --concurrency 4 --require-approval never "AstroAWS-${ENVIRONMENT}-*-${RUNTIME}-${MODE}" ${AWS_ARGS}
