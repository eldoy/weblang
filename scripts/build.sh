#!/usr/bin/env bash
set -e

ENTRY="index.js"
OUT="build.js"

npx -y esbuild "$ENTRY" \
  --bundle \
  --platform=node \
  --format=cjs \
  --outfile="$OUT"
