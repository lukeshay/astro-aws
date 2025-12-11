#!/bin/bash

upgrade() {
  pushd $1
  bunx npm-check-updates -x @types/node -u
  popd
}

upgrade .
upgrade scripts
upgrade packages/adapter
upgrade packages/constructs
upgrade apps/docs
upgrade apps/infra
upgrade examples/base

bun install
bun run build
bun run test
