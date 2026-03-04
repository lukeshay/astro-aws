#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
LAYER_DIR="${INFRA_DIR}/layers/sharp"
BUILD_DIR="${LAYER_DIR}/.build"

SHARP_VERSION="${1:-0.34.0}"
ZIP_PATH="${LAYER_DIR}/sharp-v${SHARP_VERSION}.zip"

mkdir -p "${BUILD_DIR}/nodejs"

cat > "${BUILD_DIR}/nodejs/package.json" <<EOF
{
  "name": "sharp-layer",
  "private": true,
  "version": "${SHARP_VERSION}",
  "dependencies": {
    "sharp": "${SHARP_VERSION}"
  }
}
EOF

rm -rf "${BUILD_DIR}/nodejs/node_modules" "${BUILD_DIR}/nodejs/package-lock.json"

docker run --rm \
  --platform linux/arm64 \
  -v "${BUILD_DIR}:/work" \
  -w /work/nodejs \
  public.ecr.aws/docker/library/node:24-bookworm \
  sh -c "npm install --omit=dev"

rm -f "${ZIP_PATH}"

(
  cd "${BUILD_DIR}"
  zip -r "${ZIP_PATH}" nodejs >/dev/null
)

rm -rf "${BUILD_DIR}"

echo "Created ${ZIP_PATH}"
