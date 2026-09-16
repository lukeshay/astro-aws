#!/usr/bin/env bash
# Idempotent Cloud Agent bootstrap for the astro-aws monorepo.
# Ensures the pinned Bun toolchain is present, then installs dependencies
# and builds all workspaces so the dev servers and type info are ready.
set -euo pipefail

cd "$(dirname "$0")/.."

BUN_VERSION="1.3.5"

# The default image ships Node + npm but not Bun (the pinned package manager).
# Install it to a user-owned prefix and expose it on the default PATH.
if ! command -v bun >/dev/null 2>&1 || [ "$(bun --version 2>/dev/null || true)" != "$BUN_VERSION" ]; then
	npm install -g --prefix "$HOME/.npm-global" "bun@${BUN_VERSION}"
	sudo ln -sf "$HOME/.npm-global/bin/bun" /usr/local/bin/bun
	sudo ln -sf "$HOME/.npm-global/bin/bunx" /usr/local/bin/bunx
fi

bun --version

# Deterministic dependency install against the committed lockfile.
bun install --frozen-lockfile

# Build every workspace (adapter, constructs, docs, example, infra) so that
# dev servers and downstream type-checks have their generated dist/ output.
bun run build
