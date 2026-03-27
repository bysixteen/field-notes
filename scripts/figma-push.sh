#!/usr/bin/env bash
set -euo pipefail

# figma-push.sh — Push generated JSON tokens to Figma via local MCP.
# Reads connection config from .mcp.json per PRISM interface definition.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_CONFIG="$PROJECT_ROOT/.mcp.json"

DRY_RUN=false
INPUT_FILE=""

# --- Argument parsing ---
usage() {
  echo "Usage: figma-push.sh [--dry-run] [TOKEN_JSON_FILE]"
  echo ""
  echo "Push generated token JSON to Figma via MCP."
  echo ""
  echo "Options:"
  echo "  --dry-run   Show preflight checks and payload without sending"
  echo "  -h, --help  Show this help message"
  echo ""
  echo "If TOKEN_JSON_FILE is omitted, reads from stdin."
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)  DRY_RUN=true; shift ;;
    -h|--help)  usage ;;
    *)          INPUT_FILE="$1"; shift ;;
  esac
done

# --- Preflight checks ---
echo "[PRISM] Starting preflight checks..."

# Check jq is available
if ! command -v jq &>/dev/null; then
  echo "[PRISM] ERROR: jq is required but not found. Install with: brew install jq" >&2
  exit 1
fi
echo "[PRISM] ✓ jq found"

# Check .mcp.json exists
if [[ ! -f "$MCP_CONFIG" ]]; then
  echo "[PRISM] ERROR: .mcp.json not found at $MCP_CONFIG" >&2
  echo "[PRISM] Create .mcp.json with figma.fileId and mcpServers.figma config." >&2
  exit 1
fi
echo "[PRISM] ✓ .mcp.json found"

# Read fileId from .mcp.json
FILE_ID=$(jq -r '.figma.fileId // empty' "$MCP_CONFIG")
if [[ -z "$FILE_ID" ]]; then
  echo "[PRISM] ERROR: figma.fileId not set in .mcp.json" >&2
  exit 1
fi
echo "[PRISM] ✓ fileId resolved"

# Check manus-mcp-cli is available
if ! command -v manus-mcp-cli &>/dev/null; then
  echo "[PRISM] ERROR: manus-mcp-cli is required but not found." >&2
  exit 1
fi
echo "[PRISM] ✓ manus-mcp-cli found"

# --- Tool discovery ---
echo "[PRISM] Discovering available tools..."

TOOLS_OUTPUT=$(manus-mcp-cli tool list --server figma-mcp 2>&1) || {
  echo "[PRISM] ERROR: Failed to list tools from figma-mcp server." >&2
  echo "[PRISM] Is the MCP server running? Check .mcp.json configuration." >&2
  exit 1
}

echo "[PRISM] Discovered tools: $TOOLS_OUTPUT"

# Match push tool — look for push, create, or set.*variable patterns
PUSH_TOOL=$(echo "$TOOLS_OUTPUT" | grep -oE '\b\w*(push_tokens|create_variables|set_variable_value|push_variable)\w*\b' | head -1) || true

if [[ -z "$PUSH_TOOL" ]]; then
  echo "[PRISM] ERROR: No push-capable tool found." >&2
  echo "[PRISM] Available tools: $TOOLS_OUTPUT" >&2
  echo "[PRISM] Expected a tool matching: push_tokens, create_variables, or set_variable_value" >&2
  exit 1
fi

echo "[PRISM] Resolved tool mapping:"
echo "  push_tokens → $PUSH_TOOL"

# --- Read input payload ---
if [[ -n "$INPUT_FILE" ]]; then
  if [[ ! -f "$INPUT_FILE" ]]; then
    echo "[PRISM] ERROR: Token file not found: $INPUT_FILE" >&2
    exit 1
  fi
  PAYLOAD=$(cat "$INPUT_FILE")
else
  if [[ -t 0 ]]; then
    echo "[PRISM] ERROR: No input file specified and stdin is a terminal." >&2
    echo "[PRISM] Provide a token JSON file or pipe input via stdin." >&2
    exit 1
  fi
  PAYLOAD=$(cat)
fi

# Validate JSON
if ! echo "$PAYLOAD" | jq empty 2>/dev/null; then
  echo "[PRISM] ERROR: Input is not valid JSON." >&2
  exit 1
fi

# Inject fileId into payload
PAYLOAD=$(echo "$PAYLOAD" | jq --arg fid "$FILE_ID" '. + {fileId: $fid}')

echo "[PRISM] Payload prepared ($(echo "$PAYLOAD" | jq '.collections | length') collections)"

# --- Dry run or execute ---
if [[ "$DRY_RUN" == true ]]; then
  echo ""
  echo "[PRISM] DRY RUN — would send the following payload via $PUSH_TOOL:"
  echo "$PAYLOAD" | jq .
  echo ""
  echo "[PRISM] Dry run complete. No data was sent."
  exit 0
fi

# Execute push via MCP
echo "[PRISM] Pushing tokens via $PUSH_TOOL..."
RESULT=$(manus-mcp-cli tool call --server figma-mcp --tool "$PUSH_TOOL" --input "$PAYLOAD" 2>&1) || {
  echo "[PRISM] ERROR: Push failed." >&2
  echo "$RESULT" >&2
  exit 1
}

echo "[PRISM] Push complete."
echo "$RESULT"
