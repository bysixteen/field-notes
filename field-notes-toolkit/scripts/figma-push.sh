#!/usr/bin/env bash
# figma-push.sh — push generated design tokens into Figma via Prism.
#
# Prerequisites:
#   • Prism MCP running and connected to Figma (plugin open, WS bridge on :7890)
#   • .mcp.json at repo root with figma.fileId set
#   • jq, node ≥ 22
#
# Usage:
#   ./scripts/figma-push.sh                              # default input: generated/figma-variables.json
#   ./scripts/figma-push.sh path/to/variables.json
#   cat variables.json | ./scripts/figma-push.sh
#   ./scripts/figma-push.sh --dry-run                    # show planned tool calls, send nothing
#
# Expected Prism state:
#   • check_connection returns ok
#   • set_target_file accepts the figma.fileId from .mcp.json
#   • Every collection referenced in the input JSON exists in the file
#
# Input shape (matches PRISM.md push schema, fileId injected by this script):
#   { "collections": [ { "name": "Primitives", "modes": ["Light","Dark"],
#                        "variables": [ { "name", "type", "valuesByMode" } ] } ] }
#
# Tools invoked (Prism, by name): check_connection, set_target_file,
# get_variable_collections, get_collection_variables,
# create_variables_batch, update_variables_batch.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_CONFIG="$PROJECT_ROOT/.mcp.json"
DEFAULT_INPUT="$PROJECT_ROOT/generated/figma-variables.json"
PRISM_CALL="$SCRIPT_DIR/_prism-call.mjs"

DRY_RUN=false
INPUT_FILE=""

usage() {
  sed -n '/^#!/d; /^[^#]/q; s/^# \{0,1\}//p' "${BASH_SOURCE[0]}"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    -h|--help) usage ;;
    --) shift; break ;;
    -*) echo "[prism] unknown flag: $1" >&2; exit 2 ;;
    *)  INPUT_FILE="$1"; shift ;;
  esac
done

# --- Preflight ---------------------------------------------------------------
command -v jq   >/dev/null || { echo "[prism] jq not found (brew install jq)"   >&2; exit 1; }
command -v node >/dev/null || { echo "[prism] node not found (need node ≥ 22)" >&2; exit 1; }
[[ -f "$MCP_CONFIG"  ]] || { echo "[prism] .mcp.json missing at $MCP_CONFIG" >&2; exit 1; }
[[ -f "$PRISM_CALL"  ]] || { echo "[prism] helper missing: $PRISM_CALL"      >&2; exit 1; }

FILE_ID=$(jq -r '.figma.fileId // empty' "$MCP_CONFIG")
[[ -n "$FILE_ID" ]] || { echo "[prism] figma.fileId not set in .mcp.json" >&2; exit 1; }

# --- Input -------------------------------------------------------------------
if [[ -z "$INPUT_FILE" && ! -t 0 ]]; then
  PAYLOAD=$(cat)
elif [[ -z "$INPUT_FILE" ]]; then
  INPUT_FILE="$DEFAULT_INPUT"
  [[ -f "$INPUT_FILE" ]] || { echo "[prism] input not found: $INPUT_FILE" >&2; exit 1; }
  PAYLOAD=$(cat "$INPUT_FILE")
else
  [[ -f "$INPUT_FILE" ]] || { echo "[prism] input not found: $INPUT_FILE" >&2; exit 1; }
  PAYLOAD=$(cat "$INPUT_FILE")
fi

echo "$PAYLOAD" | jq empty >/dev/null 2>&1 || { echo "[prism] input is not valid JSON" >&2; exit 1; }

COLLECTION_COUNT=$(echo "$PAYLOAD" | jq '.collections | length')
echo "[prism] file=$FILE_ID  collections=$COLLECTION_COUNT  src=${INPUT_FILE:-<stdin>}"

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

# --- Per-collection partition + batch calls ---------------------------------
COLLECTION_NAMES=$(echo "$PAYLOAD" | jq -r '.collections[].name')

while IFS= read -r COLLECTION_NAME; do
  [[ -n "$COLLECTION_NAME" ]] || continue
  echo "[prism] collection: $COLLECTION_NAME"

  COLLECTION=$(echo "$PAYLOAD" | jq --arg n "$COLLECTION_NAME" '.collections[] | select(.name==$n)')

  if [[ "$DRY_RUN" == true ]]; then
    EXISTING_NAMES='[]'
  else
    LOOKUP=$(prism_call get_variable_collections "$(jq -n --arg n "$COLLECTION_NAME" '{name:$n}')")
    COLLECTION_ID=$(echo "$LOOKUP" | jq -r '
      (.. | objects | select(.name? == "'"$COLLECTION_NAME"'") | .id?) // empty' | head -n 1)
    if [[ -n "$COLLECTION_ID" ]]; then
      VARS=$(prism_call get_collection_variables \
        "$(jq -n --arg id "$COLLECTION_ID" '{collectionId:$id}')")
      EXISTING_NAMES=$(echo "$VARS" | jq '[.. | objects | .name? | select(type=="string")] | unique')
    else
      EXISTING_NAMES='[]'
    fi
  fi

  TO_CREATE=$(echo "$COLLECTION" | jq --argjson existing "$EXISTING_NAMES" \
    '{name, modes, variables: (.variables | map(select(.name as $n | ($existing | index($n)) | not)))}')
  TO_UPDATE=$(echo "$COLLECTION" | jq --argjson existing "$EXISTING_NAMES" \
    '{name, modes, variables: (.variables | map(select(.name as $n | ($existing | index($n)))))}')

  CREATE_COUNT=$(echo "$TO_CREATE" | jq '.variables | length')
  UPDATE_COUNT=$(echo "$TO_UPDATE" | jq '.variables | length')
  echo "[prism]   create=$CREATE_COUNT  update=$UPDATE_COUNT"

  if [[ "$CREATE_COUNT" -gt 0 ]]; then
    prism_call create_variables_batch \
      "$(jq -n --arg fid "$FILE_ID" --argjson c "$TO_CREATE" '{fileId:$fid, collection:$c}')" \
      >/dev/null
  fi
  if [[ "$UPDATE_COUNT" -gt 0 ]]; then
    prism_call update_variables_batch \
      "$(jq -n --arg fid "$FILE_ID" --argjson c "$TO_UPDATE" '{fileId:$fid, collection:$c}')" \
      >/dev/null
  fi
done <<< "$COLLECTION_NAMES"

echo "[prism] push complete"
