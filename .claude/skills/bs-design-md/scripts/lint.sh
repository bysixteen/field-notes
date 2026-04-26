#!/usr/bin/env bash
# Lint a DESIGN.md file using @google/design.md.
# Surfaces errors (must be zero) and warnings (review but don't block on contrast/orphaned).
#
# Usage: lint.sh <path-to-DESIGN.md>
#
# Exit 0 if no errors; exit 1 on errors.

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: lint.sh <path-to-DESIGN.md>" >&2
  exit 64
fi

FILE="$1"

if [[ ! -f "$FILE" ]]; then
  echo "error: $FILE does not exist" >&2
  exit 66
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "error: npx not found. Install Node 18+ from https://nodejs.org" >&2
  exit 69
fi

echo "→ linting $FILE"
npx --yes @google/design.md@latest lint "$FILE"

# Exit code from npx propagates: 0 = no errors, 1 = errors.
