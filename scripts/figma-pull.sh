#!/usr/bin/env bash
# figma-pull.sh — pull anchor variables from Figma via Prism.
#
# Prerequisites:
#   • Prism MCP running and connected to Figma (plugin open, WS bridge on :7890)
#   • .mcp.json at repo root with figma.fileId set
#   • jq, node ≥ 22
#
# Usage:
#   ./scripts/figma-pull.sh                  # writes generated/figma-anchors.json
#   ./scripts/figma-pull.sh --dry-run        # show planned tool calls, fetch nothing
#   ./scripts/figma-pull.sh --collection X   # override collection name (default: Anchors)
#
# Expected Prism state:
#   • check_connection returns ok
#   • set_target_file accepts the figma.fileId from .mcp.json
#   • A variable collection named "Anchors" (or --collection override) exists
#
# Output shape (matches PRISM.md pull schema):
#   { "collection": "Anchors", "modes": [...],
#     "variables": [ { "name", "type", "valuesByMode" } ] }
#
# Tools invoked (Prism, by name): check_connection, set_target_file,
# get_variable_collections, get_collection_variables.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_CONFIG="$PROJECT_ROOT/.mcp.json"
OUTPUT_FILE="$PROJECT_ROOT/generated/figma-anchors.json"
PRISM_CALL="$SCRIPT_DIR/_prism-call.mjs"

DRY_RUN=false
COLLECTION_NAME="Anchors"

usage() {
  sed -n '/^#!/d; /^[^#]/q; s/^# \{0,1\}//p' "${BASH_SOURCE[0]}"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)    DRY_RUN=true; shift ;;
    --collection) COLLECTION_NAME="${2:?}"; shift 2 ;;
    -h|--help)    usage ;;
    *) echo "[prism] unknown argument: $1" >&2; exit 2 ;;
  esac
done

# --- Preflight ---------------------------------------------------------------
command -v jq   >/dev/null || { echo "[prism] jq not found (brew install jq)"   >&2; exit 1; }
command -v node >/dev/null || { echo "[prism] node not found (need node ≥ 22)" >&2; exit 1; }
[[ -f "$MCP_CONFIG"  ]] || { echo "[prism] .mcp.json missing at $MCP_CONFIG" >&2; exit 1; }
[[ -f "$PRISM_CALL"  ]] || { echo "[prism] helper missing: $PRISM_CALL"      >&2; exit 1; }

FILE_ID=$(jq -r '.figma.fileId // empty' "$MCP_CONFIG")
[[ -n "$FILE_ID" ]] || { echo "[prism] figma.fileId not set in .mcp.json" >&2; exit 1; }

echo "[prism] file=$FILE_ID  collection=$COLLECTION_NAME  out=$OUTPUT_FILE"

# --- Helper to call a Prism tool --------------------------------------------
prism_call() {
  local tool="$1" args_json="$2"
  if [[ "$DRY_RUN" == true ]]; then
    {
      echo "[prism] DRY-RUN tools/call $tool"
      echo "$args_json" | jq .
    } >&2
    return 0
  fi
  jq -n --arg t "$tool" --argjson a "$args_json" '{tool:$t, arguments:$a}' \
    | node "$PRISM_CALL"
}

# --- Connection + target file -----------------------------------------------
prism_call check_connection '{}' >/dev/null
prism_call set_target_file "$(jq -n --arg id "$FILE_ID" '{fileId:$id}')" >/dev/null

if [[ "$DRY_RUN" == true ]]; then
  prism_call get_variable_collections "$(jq -n --arg n "$COLLECTION_NAME" '{name:$n}')" >/dev/null
  prism_call get_collection_variables '{"collectionId":"<resolved-at-runtime>"}' >/dev/null
  echo "[prism] dry run complete; nothing written"
  exit 0
fi

# --- Resolve collection id ---------------------------------------------------
COLLECTIONS=$(prism_call get_variable_collections \
  "$(jq -n --arg n "$COLLECTION_NAME" '{name:$n}')")

COLLECTION_ID=$(echo "$COLLECTIONS" | jq -r --arg n "$COLLECTION_NAME" '
  (.. | objects | select(.name? == $n) | .id?) // empty' | head -n 1)

if [[ -z "$COLLECTION_ID" ]]; then
  echo "[prism] collection \"$COLLECTION_NAME\" not found in file $FILE_ID" >&2
  echo "[prism] response was:" >&2
  echo "$COLLECTIONS" | jq . >&2
  exit 1
fi

# --- Read variables ----------------------------------------------------------
VARS=$(prism_call get_collection_variables \
  "$(jq -n --arg id "$COLLECTION_ID" '{collectionId:$id}')")

# Normalise to PRISM.md pull-response shape: {collection, modes, variables}.
OUTPUT=$(echo "$VARS" | jq --arg n "$COLLECTION_NAME" '
  {
    collection: $n,
    modes: ([.. | objects | .modes? // empty] | add // [] | unique),
    variables: [
      .. | objects
      | select(has("name") and has("valuesByMode"))
      | { name, type: (.type // "COLOR"), valuesByMode }
    ]
  }
')

mkdir -p "$(dirname "$OUTPUT_FILE")"
echo "$OUTPUT" | jq . > "$OUTPUT_FILE"

VAR_COUNT=$(echo "$OUTPUT" | jq '.variables | length')
echo "[prism] wrote $VAR_COUNT variables → $OUTPUT_FILE"
