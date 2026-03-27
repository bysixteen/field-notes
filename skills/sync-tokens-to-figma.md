# Sync Tokens to Figma

> Push generated token JSON from code into a Figma file via MCP.

## Required Inputs

| Input | Type | Description |
|-------|------|-------------|
| Token JSON file | File path or stdin | JSON payload containing variable collections to push |
| `.mcp.json` | Config file | Must contain `figma.fileId` and MCP server configuration |

## Expected Outputs

- Figma variable collections updated with the values from the token JSON.
- Console output confirming the number of collections pushed.

## Prerequisites

- `jq` installed locally.
- `manus-mcp-cli` installed and on `PATH`.
- `.mcp.json` exists at project root with `figma.fileId` set.
- MCP Figma server running and reachable.

## Execution Steps

1. Run `scripts/figma-push.sh [TOKEN_JSON_FILE]` from the project root.
2. The script performs preflight checks (jq, .mcp.json, fileId, MCP CLI).
3. It discovers the push-capable tool from the MCP server automatically.
4. The token JSON payload is validated and `fileId` is injected.
5. The payload is sent to Figma via the resolved MCP tool.

Use `--dry-run` to see the payload without sending it.

## Verification

- Script exits with code 0 and prints `[PRISM] Push complete.`
- Open the Figma file and confirm variable collections reflect the pushed values.
