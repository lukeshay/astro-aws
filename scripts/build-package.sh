#!/bin/bash

set -e

tscArgs=()

# Add script name
tscArgs+=("-p" "./tsconfig.build.json")

# Passthrough arguments and flags
tscArgs+=($@)

# Execute
yarn clean || true

yarn tsc --module es6 --declaration --outDir ./dist "${tscArgs[@]}"
