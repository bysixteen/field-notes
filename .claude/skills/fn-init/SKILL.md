---
name: fn-init
description: >-
  Use when bootstrapping a new project from scratch with the canonical bysixteen
  design-system context stack. Scaffolds a target directory with `tokens.json`
  (DTCG 2025.10 with placeholder anchor colours and per-component token groups),
  `components.json` (thin-index registry of canonical primitives — button,
  input, badge, alert, card — pointing at per-component `.contract.md`
  sidecars), starter `.contract.md` sidecars under
  `content/design-system/components/`, the five model MDX files at
  `content/design-system/model/{sentiment,emphasis,size,state,structure}.mdx`
  carrying `dimensional_values` frontmatter, a starter `CLAUDE.md` referencing
  the toolkit and `llms.txt`, and a starter `DESIGN.md` with empty preservation
  markers in place. The output is the exact shape `fn-design-md
  --from-dimensional` expects, so a freshly bootstrapped project can
  immediately regenerate a valid `DESIGN.md`.
---

# fn-init — bootstrap canonical context stack

## Foundations (read first)

- [DESIGN-INTENT](../_foundations/DESIGN-INTENT.md)
- [DIMENSIONAL-MODEL](../_foundations/DIMENSIONAL-MODEL.md)
- [TOKEN-ARCHITECTURE](../_foundations/TOKEN-ARCHITECTURE.md)

## What it does

`fn-init` scaffolds the canonical four-piece context stack a downstream project
needs to consume `fn-design-md --from-dimensional`:

| Artefact | Purpose |
|----------|---------|
| `tokens.json` | DTCG 2025.10 token source. Placeholder anchor colours (primary, neutral, warning, danger, positive, on-primary) plus per-component token groups (`button`, `input`, `badge`, `alert`, `card`) so each component's `tokenNamespace` lookup resolves. Replace with real values. |
| `components.json` | Thin-index registry — five canonical primitives (`button`, `input`, `badge`, `alert`, `card`), each pointing at a `.contract.md` sidecar via `contract`, plus `radixBase` and `tokenNamespace`. No `applies_to` or `properties` inline; the walker reads `applies_to` from each sidecar's `## Dimension encoding` table. |
| `content/design-system/components/<name>.contract.md` | Starter sidecars (one per primitive) populated per `fn-component-contract`'s schema — `## Props`, `## Dimension encoding`, `## Token bindings`, `## Usage rules`. Replace placeholder content with project-specific rules. |
| `content/design-system/model/{sentiment,emphasis,size,state,structure}.mdx` | The five-dimensional vocabulary, each with a `dimensional_values: { default, values }` frontmatter block. `structure.mdx` carries `informational: true` so its values don't appear in variant names. |
| `CLAUDE.md` | Starter system-prompt that points at the field-notes toolkit, the four-layer context stack rationale, and `llms.txt` for agent-readable docs. |
| `DESIGN.md` | Empty preservation markers in place (`<!-- fn-design-md:generated:start -->` ... `<!-- fn-design-md:generated:end -->`) so the first `fn-design-md` run fills the generated portion and any prose written after the `:end` marker is preserved across regenerations. |

The output is project-agnostic. Replace anchor colours, prose, and the model-MDX value lists with the real vocabulary before treating the scaffold as canonical.

## Usage

```sh
node .claude/skills/fn-init/scripts/init.mjs --name <project-name> --target <dir>
```

Flags:
- `--name <name>` — project name; substituted into `{{project_name}}` placeholders in `CLAUDE.md` and `DESIGN.md`.
- `--target <dir>` — directory to write into. Created if it doesn't exist.
- `--force` — required if `<dir>` is non-empty. Without it, `fn-init` refuses to overwrite.
- `--help` / `-h` — usage.

## Round-trip verification

After `fn-init`, the scaffold is ready to feed `fn-design-md --from-dimensional`:

```sh
node .claude/skills/fn-init/scripts/init.mjs --name test-project --target /tmp/test-project
node .claude/skills/fn-design-md/scripts/emit-design-md.mjs --from-dimensional /tmp/test-project --out /tmp/test-project --name test-project
```

The second command must succeed and produce `/tmp/test-project/DESIGN.md` with a `## Components` section listing variants for all five primitives. The repeatable round-trip is exercised by `scripts/__tests__/init.test.mjs`.

## Idempotency rules

- A non-empty `--target` is refused unless `--force` is passed. This protects an existing project from accidental overwrite.
- With `--force`, files are overwritten in place. Subdirectories are created as needed.
- `fn-init` does not run `fn-design-md`. The two skills compose; running them in order is the bootstrap recipe.

## Out of scope

- Multi-mode flags (`--type=web|design-system|mcp|docs`). Issue #119 sketched this; deferred until adoption demands it. The current skill emits a single project-agnostic shape.
- `.claude/rules/` and `.claude/commands/` scaffolding. Cross-repo rules live in field-notes; consumers reference them via the `field-notes-toolkit` plugin install path rather than receiving a copy.
- Prism MCP `.mcp.json` setup. Configure separately per `content/design-system/prism.mdx`.

## Self-review

Before declaring done, run the self-review protocol from `_foundations/SELF-REVIEW.md`.

fn-init-specific checks before reporting done:
1. Re-read `--name` and `--target` from the invocation. Confirm all scaffold files were written.
2. Run the round-trip recipe above; if `fn-design-md --from-dimensional` exits non-zero, the scaffold is broken — surface the error verbatim.
3. List what wasn't checked: replacing placeholder anchor colours, customising the five-dimensional vocabulary, wiring CI, configuring the toolkit npm-link.
