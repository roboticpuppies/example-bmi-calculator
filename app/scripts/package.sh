#!/bin/sh
# Build the Lambda Web Functions deployment package: dist/function.zip
# Contains index.js at the root plus production dependencies only.
set -eu
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist/build
cp index.js instrument.js package.json package-lock.json dist/build/
(cd dist/build && npm ci --omit=dev --ignore-scripts --no-audit --no-fund)
(cd dist/build && zip -qr ../function.zip .)
rm -rf dist/build

echo "Built $(pwd)/dist/function.zip ($(du -h dist/function.zip | cut -f1))"
