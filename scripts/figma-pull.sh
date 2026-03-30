#!/usr/bin/env bash
set -euo pipefail

# figma-pull.sh — Pull anchor colors from Figma via local MCP.
# Writes exclusively to packages/ui/anchors.json (never .ts files).
# Reads connection config from .mcp.json per PRISM interface definition.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_CONFIG="$PROJECT_ROOT/.mcp.json"
OUTPUT_FILE="$PROJECT_ROOT/packages/ui/anchors.json"
COLLECTION_NAME="Anchors"

DRY_RUN=false

# --- Argument parsing ---
usage() {
  echo "Usage: figma-pull.sh [--dry-run]"
  echo ""
  echo "Pull anchor colors from Figma via MCP."
  echo "Output is written to packages/ui/anchors.json."
  echo ""
  echo "Options:"
  echo "  --dry-run   Show preflight checks without pulling"
  echo "  -h, --help  Show this help message"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)  DRY_RUN=true; shift ;;
    -h|--help)  usage ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      ;;
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

# Match pull tool — look for pull, get.*variable patterns
PULL_TOOL=$(echo "$TOOLS_OUTPUT" | grep -oE '\b\w*(pull_variables|get_variables|get_variable|pull_variable)\w*\b' | head -1) || true

if [[ -z "$PULL_TOOL" ]]; then
  echo "[PRISM] ERROR: No pull-capable tool found." >&2
  echo "[PRISM] Available tools: $TOOLS_OUTPUT" >&2
  echo "[PRISM] Expected a tool matching: pull_variables or get_variables" >&2
  exit 1
fi

echo "[PRISM] Resolved tool mapping:"
echo "  pull_variables → $PULL_TOOL"

# --- Validate Anchors collection ---
echo "[PRISM] Validating \"$COLLECTION_NAME\" collection exists..."

REQUEST_PAYLOAD=$(jq -n --arg fid "$FILE_ID" --arg col "$COLLECTION_NAME" \
  '{fileId: $fid, collection: $col}')

# --- Dry run or execute ---
if [[ "$DRY_RUN" == true ]]; then
  echo ""
  echo "[PRISM] DRY RUN — would pull collection with the following request via $PULL_TOOL:"
  echo "$REQUEST_PAYLOAD" | jq .
  echo ""
  echo "[PRISM] Output would be written to: $OUTPUT_FILE"
  echo "[PRISM] Dry run complete. No data was fetched."
  exit 0
fi

# Execute pull via MCP
echo "[PRISM] Pulling $COLLECTION_NAME collection via $PULL_TOOL..."
RESULT=$(manus-mcp-cli tool call --server figma-mcp --tool "$PULL_TOOL" --input "$REQUEST_PAYLOAD" 2>&1) || {
  echo "[PRISM] ERROR: Pull failed." >&2
  echo "$RESULT" >&2
  exit 1
}

# Validate response is JSON
if ! echo "$RESULT" | jq empty 2>/dev/null; then
  echo "[PRISM] ERROR: Response from MCP is not valid JSON." >&2
  echo "$RESULT" >&2
  exit 1
fi

# Verify the response contains the Anchors collection
RESPONSE_COLLECTION=$(echo "$RESULT" | jq -r '.collection // empty')
if [[ "$RESPONSE_COLLECTION" != "$COLLECTION_NAME" ]]; then
  echo "[PRISM] WARNING: Response collection name \"$RESPONSE_COLLECTION\" does not match expected \"$COLLECTION_NAME\"." >&2
fi

# Ensure output directory exists
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Write anchors.json
echo "$RESULT" | jq '.' > "$OUTPUT_FILE"

echo "[PRISM] Pull complete. Anchors written to: $OUTPUT_FILE"
echo "[PRISM] Variables pulled: $(echo "$RESULT" | jq '.variables | length')"
