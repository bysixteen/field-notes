# Design system context — INDEX

Tier 2 routing map for the Field Notes design system. **Lightweight by design**: pointers, no inline values. Read this when the answer isn't in `/DESIGN.md` and you'd otherwise be tempted to load the whole token system.

> **Manifest tiers:** `/DESIGN.md` (Tier 1 — always-loaded compact prompt). This file (Tier 2 — routing map). `/tokens.json` (Tier 3 — full DTCG, query specifically).

## Where canonical design lives

- `/DESIGN.md` — Tier 1 system prompt. Hex sRGB colors, typography, rounded, spacing, components. **Start here.**
- `/tokens.json` — Tier 3 source of truth. DTCG Format Module 2025.10. Wide-gamut OKLCH preserved. Includes light + dark in `$extensions.field-notes.modes`.
- `/components.json` — minimal component → token reference map consumed by the emitter.

## Token category map

| Category | Read first | Primitive source | Architectural narrative |
|---|---|---|---|
| Color (semantic) | `/DESIGN.md` `colors:` block | `/tokens.json` `color.{name}` | `content/design-system/token-chain/component-slots.mdx` |
| Color (primitive ramps) | `/tokens.json` `color.neutral / highlight / positive / warning / danger / new` | n/a | `content/design-system/token-chain/primitives.mdx` |
| Typography | `/DESIGN.md` `typography:` block | `/tokens.json` `typography` | `content/design-system/token-chain/semantics.mdx` |
| Spacing | `/DESIGN.md` `spacing:` block | `/tokens.json` `spacing` | `content/design-system/token-chain/primitives.mdx` |
| Rounded / radius | `/DESIGN.md` `rounded:` block | `/tokens.json` `borderRadius` | `content/design-system/token-chain/primitives.mdx` |
| Sentiment / emphasis / state / size | `content/design-system/concepts-manifest.mdx` | model definitions in `content/design-system/model/` | `content/design-system/token-chain/component-slots.mdx` |
| Cascade rules | `.claude/skills/_foundations/TOKEN-ARCHITECTURE.md` | n/a | `.claude/skills/fn-tokens.md` |

## Querying live tokens

Live Figma values come from Prism MCP. **Always pass a filter** — never `scan_tokens` unbounded.

- One token by name: `scan_tokens` with `nameFilter: "button-bg"`.
- One palette: `scan_tokens` with `nameFilter: "neutral-*"`.
- One collection: `scan_tokens` with `collectionFilter: "Sentiment"`.

Static lookups (color values, scales, semantic names) come from `/tokens.json` or `/DESIGN.md`. Reserve Prism for what you can't get from the committed artefacts.

## When to regenerate

Run `npm run generate:manifest` after any of:
- New / removed palette anchor or change to lightness targets in `scripts/generate-ramps.ts`.
- Change to typography / spacing / borderRadius constants in the same script.
- Change to `components.json` (component → token wiring).

Do **not** run on every prompt or every build — the cache is the whole point.

## See also

- `content/design-system/manifest-architecture.mdx` — full architectural rationale.
- `.claude/rules/prism-mcp.md` — Token Trap discipline for `scan_tokens`.
- `.claude/skills/fn-tokens.md` — Tier discipline applied to skill workflows.
