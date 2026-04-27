# PRISM — Figma MCP Bridge Interface Definition

Interface contract for PRISM (`bysixteen/prism`, published as `prism-figma-mcp`), the bridge between local design-token tooling and Figma via the Model Context Protocol (MCP). Prism ships 71 tools across 12 categories; this document defines the connection protocol, payload schemas for push/pull operations, and the canonical tool surface used by the sync scripts.

Downstream dependents: Sub-Plan D (Token Transform Pipeline docs), Sub-Plan G (Push/Pull sync scripts in `scripts/figma-{push,pull}.sh`).

---

## Connection Protocol

Prism communicates with Figma through an MCP server exposed over two transports simultaneously:

| Transport | Detail |
|-----------|--------|
| **STDIO** | Default for MCP clients (Claude Code, Claude Desktop). The client spawns the Prism process and communicates over stdin/stdout. |
| **WebSocket bridge** | `ws://localhost:7890`. Prism's plugin-side bridge — also reachable from local scripts that want to invoke Prism tools without re-spawning the server. |

The shell scripts in `scripts/` use the WebSocket transport so they piggyback on whatever Prism instance is already attached to the operator's open Figma plugin.

### Configuration

All connection details are read from the `.mcp.json` file located in the project root. Scripts and tools MUST NOT hardcode server commands, URLs, or Figma file IDs — everything is resolved at runtime from this file.

```jsonc
// .mcp.json (example structure — values are project-specific)
{
  "mcpServers": {
    "prism": {
      "command": "node",
      "args": ["/path/to/prism/dist/mcp/index.js"],
      "env": {
        "FIGMA_PAT": "<your-personal-access-token>",
        "FIGMA_MCP_PORT": "7890"
      }
    }
  },
  "figma": {
    "fileId": "<file-id>"
  }
}
```

> **v0.3.0+:** Once published to npm, replace the command/args with `"command": "npx", "args": ["-y", "prism-figma-mcp"]`.

Key rules:
- `fileId` is always read from `.mcp.json` at runtime — never embedded in scripts or documentation examples.
- `FIGMA_MCP_PORT` controls the WebSocket bridge port; scripts default to `7890` and accept `PRISM_WS_URL` as an override.

---

## Canonical Tool Surface

Prism's tool names are stable. Scripts call them by name — no runtime regex discovery — and abort with the actual error message if a call fails.

| Capability | Tool |
|------------|------|
| Connection check | `check_connection` |
| Set the active file | `set_target_file` |
| List variable collections (lookup by name) | `get_variable_collections` |
| Read all variables in a collection | `get_collection_variables` |
| Audit local + library tokens with bindings | `list_tokens` |
| Bulk create new variables | `create_variables_batch` |
| Bulk update existing variables | `update_variables_batch` |
| Bulk delete variables | `delete_variables_batch` |

Single-variable variants (`create_variable`, `update_variable`, `delete_variable`) exist but the sync scripts always use the batch forms.

---

## Push Tokens Payload Schema

Pushes locally-generated token collections into Figma as variables. The push script splits each collection into "new" and "existing" variables (by checking `get_collection_variables`) and routes them to `create_variables_batch` / `update_variables_batch` respectively.

### Request Payload

```json
{
  "fileId": "<from .mcp.json>",
  "collection": {
    "name": "Primitives",
    "modes": ["Light", "Dark"],
    "variables": [
      {
        "name": "sky-50",
        "type": "COLOR",
        "valuesByMode": {
          "Light": "#f0f9ff",
          "Dark": "#082f49"
        }
      },
      {
        "name": "sky-100",
        "type": "COLOR",
        "valuesByMode": {
          "Light": "#e0f2fe",
          "Dark": "#0c4a6e"
        }
      }
    ]
  }
}
```

The script's input file (`generated/figma-variables.json`) wraps one or more collections under a `collections: []` array; the script unwraps and dispatches one batch call per collection.

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `fileId` | `string` | Figma file ID — resolved from `.mcp.json` at runtime. |
| `collection.name` | `string` | Collection name in Figma (e.g., `"Primitives"`, `"Anchors"`). |
| `collection.modes` | `string[]` | Mode names the collection supports (e.g., `["Light", "Dark"]`). |
| `collection.variables` | `array` | Variables to create or update within the collection. |
| `variables[].name` | `string` | Variable name. Use Radix-style 50–1000 numbering for scales. |
| `variables[].type` | `string` | Variable type: `"COLOR"`, `"FLOAT"`, `"STRING"`, or `"BOOLEAN"`. |
| `variables[].valuesByMode` | `object` | Map of mode name to value. Keys must match `modes` array. |

---

## Pull Anchors Payload Schema

Pulls variable values back from Figma — typically anchor tokens set by designers. The pull script first calls `get_variable_collections` to resolve the collection's id, then `get_collection_variables` to read its variables.

### Request Sequence

```jsonc
// step 1
{ "tool": "get_variable_collections", "arguments": { "name": "Anchors" } }

// step 2 (collectionId comes from step 1's response)
{ "tool": "get_collection_variables", "arguments": { "collectionId": "VariableCollectionId:..." } }
```

### Output Shape (written to `generated/figma-anchors.json`)

```json
{
  "collection": "Anchors",
  "modes": ["Light", "Dark"],
  "variables": [
    {
      "name": "accent",
      "type": "COLOR",
      "valuesByMode": {
        "Light": "#2563eb",
        "Dark": "#60a5fa"
      }
    }
  ]
}
```

The output shape mirrors the push request's `collection` block, making round-trip operations straightforward.

---

## Summary

| Aspect | Detail |
|--------|--------|
| Transport | MCP over STDIO + WebSocket bridge on `ws://localhost:7890` |
| Configuration | `.mcp.json` in project root |
| Push | `create_variables_batch` (new) + `update_variables_batch` (existing) per collection |
| Pull | `get_variable_collections` → `get_collection_variables` |
| Tool names | Called directly by name (canonical, stable across Prism versions) |
| File IDs | Always from `.mcp.json` — never hardcoded |
