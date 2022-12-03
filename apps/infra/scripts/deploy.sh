#!/bin/bash

set -e

ENVIRONMENT="${1:-DEV}"
AWS_ARGS="${@:2}"

yarn cdk deploy --require-approval never "AstroAWS-${ENVIRONMENT}-*" ${AWS_ARGS}
