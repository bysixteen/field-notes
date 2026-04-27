## Prism MCP — Figma access across all bysixteen projects

Whenever Claude needs Figma context — token values, component geometry, library variables, frame layouts, or write-side operations like creating variables, components, or styles — use **Prism MCP** (`bysixteen/prism`), not screenshots, hand-transcription, or the official Figma MCP.

### Why Prism, not the official Figma MCP

The official Figma MCP server is read-only (13 tools: `get_variable_defs`, `get_design_context`, Code Connect). Prism is read-write and design-system-aware (71 tools across 12 categories). Critically, Prism's `scan_tokens` resolves library variables you don't have direct file access to — capability the official MCP lacks entirely.

Use the official Figma MCP only as a fallback if Prism is unavailable in the session.

### Prism tool surface (use the right tool for the job)

- **Token / variable read:** `scan_tokens` (audits local + library collections, includes variable bindings across all nodes). Prefer this over hand-walking variables.
- **Variable lifecycle:** `create_variable_collection`, `create_variable`, `update_variable`, `set_variable_alias`, `bind_variable_to_node`, plus `add_mode`, `rename_mode`, `delete_mode` for mode management. Bulk operations available.
- **Component model:** `convert_frame_to_component`, `create_variant`, `add_component_property`, `insert_instance`, `set_instance_variant`.
- **Layer manipulation:** rename, resize, move, auto-layout, effects, gradients, image fills, clone, batch regex rename.
- **Text and styles:** `create_text_style`, `update_text_style`, `delete_text_style`, `create_grid_style`, `apply_text_style`, batch style operations.
- **Pages:** create, rename, delete, reorder, set current.
- **Comments (REST API, requires `FIGMA_PAT` env var):** get, post, delete.
- **Library search:** `search_components`, `get_library_components`.
- **Plugin code execution:** `execute` — run arbitrary Figma Plugin API code when no dedicated tool fits.
- **Debugging:** `get_console_logs`, `watch_console`, `clear_console_logs` (1000-entry buffer).
- **Screenshots:** `take_screenshot` exports nodes as base64 PNG.

### Ground rules

- Do not paste Figma URLs into the conversation expecting Claude to browse them.
- Do not transcribe colours, sizes, or component specs from screenshots — use `scan_tokens` or `get_design_context` (Prism wraps both).
- For one-way CSS → Figma sync (codebase is source of truth), use the WebSocket bridge pattern from Neo's `scripts/push-tokens.mjs` as the reference implementation.
- If Prism is unavailable in a session (server not running, no `FIGMA_PAT`, bridge disconnected), surface that to the user immediately. Do **not** silently fall back to guessing.

### Token Trap discipline

Loading the whole design system into context on every prompt is the **Token Trap** — the largest avoidable cost in an AI design workflow. Apply this discipline whenever you reach for tokens:

1. **Tier 1 first.** `/DESIGN.md` answers most static lookups (semantic colors, typography, spacing, component variants). Read it before anything else.
2. **Tier 2 to route.** `/.context/INDEX.md` tells you which file or query answers a given category.
3. **Tier 3 with a filter.** Only call `scan_tokens` when you need the *live* Figma value. Always pass a filter (`nameFilter`, `collectionFilter`, or a specific node) — never call `scan_tokens` unbounded. For static lookups, prefer reading `/tokens.json` directly.
4. **Never dump.** Do not pull the whole library into context "just in case". If you find yourself doing this, the answer is at Tier 1 or behind a narrower Tier 3 query.

Regenerate the manifest cache only when the design system changes: `npm run generate:manifest`. Full architectural rationale in `content/design-system/manifest-architecture.mdx`.

### Configuration reference (`.mcp.json`)

```json
{
  "prism": {
    "command": "node",
    "args": ["/path/to/prism/dist/mcp/index.js"],
    "env": {
      "FIGMA_PAT": "your-personal-access-token",
      "FIGMA_MCP_PORT": "7890"
    }
  }
}
```

Prism is published as `prism-figma-mcp` on npm. For v0.3.0+, replace `command`/`args` with `"command": "npx", "args": ["-y", "prism-figma-mcp"]`.

Full documentation: `PRISM.md` and `content/design-system/prism.mdx`.
