#!/bin/bash

set -e

ENVIRONMENT="${1:-DEV}"
RUNTIME="${2:-*}"
MODE="${3:-*}"
AWS_ARGS="${@:4}"

TEMP_OUTPUT=$(mktemp)
trap "rm -f $TEMP_OUTPUT" EXIT

bunx cdk deploy --asset-parallelism --concurrency 4 --require-approval never "AstroAWS-${ENVIRONMENT}-*-${RUNTIME}-${MODE}" ${AWS_ARGS} 2>&1 | tee "$TEMP_OUTPUT"
DEPLOY_EXIT_CODE=${PIPESTATUS[0]}

echo "$TEMP_OUTPUT" > "output.log"

echo ""
echo "=== Stack Outputs ==="
# Extract stack outputs - match lines with StackName.OutputKey = Value pattern
# Match lines like: AstroAWS-DEV-Website-nodejs22-edge.CloudFrontDistributionId = E25PV81CELYFOG
grep -E "^AstroAWS-[^[:space:]]+\.[^[:space:]]+ = " "$TEMP_OUTPUT" | sed 's/^@astro-aws\/infra:deploy: //' || true

exit $DEPLOY_EXIT_CODE
