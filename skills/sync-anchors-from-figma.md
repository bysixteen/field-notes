# Sync Anchors from Figma

> Pull anchor color values from a Figma file's "Anchors" collection into `packages/ui/anchors.json`.

## Required Inputs

| Input | Type | Description |
|-------|------|-------------|
| `.mcp.json` | Config file | Must contain `figma.fileId` and MCP server configuration |

## Expected Outputs

- `packages/ui/anchors.json` updated with the current anchor color values from Figma.
- Console output confirming the number of variables pulled.

## Prerequisites

- `jq` installed locally.
- `manus-mcp-cli` installed and on `PATH`.
- `.mcp.json` exists at project root with `figma.fileId` set.
- MCP Figma server running and reachable.
- An "Anchors" variable collection exists in the target Figma file.

## Execution Steps

1. Run `scripts/figma-pull.sh` from the project root.
2. The script performs preflight checks (jq, .mcp.json, fileId, MCP CLI).
3. It discovers the pull-capable tool from the MCP server automatically.
4. A request is sent for the "Anchors" collection from the configured Figma file.
5. The response is validated as JSON and written to `packages/ui/anchors.json`.

Use `--dry-run` to see the request payload without pulling.

## Verification

- Script exits with code 0 and prints `[PRISM] Pull complete.`
- `packages/ui/anchors.json` contains valid JSON with the expected anchor variables.
