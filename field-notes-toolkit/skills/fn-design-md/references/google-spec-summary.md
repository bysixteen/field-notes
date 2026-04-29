# Google DESIGN.md spec — schema summary

Source: `github.com/google-labs-code/design.md`, spec at `docs/spec.md`. Status: **alpha**.

A DESIGN.md file is YAML frontmatter (machine-readable tokens, fenced by `---`) followed by Markdown body (rationale prose). Tokens are normative; prose is context for the agent.

## Top-level frontmatter fields

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `version` | optional | string | Currently `"alpha"` |
| `name` | **required** | string | Brand or product name |
| `description` | optional | string | One-line summary |
| `colors` | optional | map<string, Color> | sRGB hex only (`#RRGGBB`) |
| `typography` | optional | map<string, Typography> | See Typography schema below |
| `rounded` | optional | map<string, Dimension> | Any string keys (`xs`, `sm`, `pill`, etc.) |
| `spacing` | optional | map<string, Dimension\|number> | Numeric values are interpreted as `px` |
| `components` | optional | map<string, map<property, value>> | See Component schema below |

If `colors` is present, a `primary` key is required. The linter emits `missing-primary` otherwise.

## Color type

- Must start with `#` followed by 6 hex digits in sRGB color space.
- **Not allowed:** `oklch()`, `rgb()`, `rgba()`, `hsl()`, named colours, alpha-channel hex (`#RRGGBBAA`).
- The `atmospheric-glass` example leaks `rgba()` into `components.backgroundColor` — this is technically a spec violation that the linter currently tolerates. Don't rely on it.

## Dimension type

- Number + unit suffix: `px`, `em`, `rem`. e.g. `16px`, `1.5rem`.
- Bare numbers in `spacing` are interpreted as `px`.

## Typography schema

```yaml
typography:
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400              # 100..900
    lineHeight: 1.5              # unitless = multiplier; or "24px"
    letterSpacing: 0em
    fontFeature: "ss01"          # font-feature-settings
    fontVariation: "wght 400"    # font-variation-settings
```

`fontFamily`, `fontSize`, `fontWeight` are the load-bearing fields. The others are optional.

## Component schema

Valid property keys (and only these):

- `backgroundColor`
- `textColor`
- `typography`
- `rounded`
- `padding`
- `size`
- `height`
- `width`

**Not in the spec:**
- `borderColor`, `borderWidth`, `borderStyle`
- `boxShadow`, `elevation`
- `state` (no per-state field — encode states as variant components)
- Any nested or compositional structure

## Token references

Inside any value, use `{path.to.token}` to reference another token:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
```

For most groups a reference must point to a primitive. Inside `components`, composite references like `{typography.label-md}` are allowed.

## Variants

There is **no variant construct.** Variants are sibling keys with related names:

```yaml
components:
  button-primary: {...}
  button-primary-hover: {...}
  button-primary-active: {...}
  button-primary-disabled: {...}
  button-secondary: {...}
  button-secondary-hover: {...}
```

A 4-sentiment × 3-emphasis × 4-state × 3-size matrix expands to **144 entries**. This is by design in the spec; readability is your responsibility.

## Patterns / compound components

**Not modelled.** Anything compositional (cards-with-header-and-action, dialogs, navigation) must be either:
- Expressed as an ad-hoc named component (`card-elevated-with-action`)
- Documented in prose only

If patterns are critical to the system, document them in `## Do's and Don'ts` — see `do-and-dont-template.md`.

## Section order

Body sections, all `##`, all optional but ordered:

1. Overview (alias: "Brand & Style")
2. Colors
3. Typography
4. Layout (alias: "Layout & Spacing")
5. Elevation & Depth (alias: "Elevation")
6. Shapes
7. Components
8. Do's and Don'ts

Duplicate section headings produce a linter error. The linter auto-detects aliases.

## CLI commands

Install: `npm i @google/design.md`.

| Command | Purpose | Exit |
|---------|---------|------|
| `lint <file>` | 8 rules: `broken-ref` (error), `contrast-ratio`/`missing-primary`/`orphaned-tokens`/`missing-typography`/`section-order` (warning), `token-summary`/`missing-sections` (info) | `1` on errors, `0` otherwise |
| `diff <before> <after>` | Token-level adds/removes/modifies; `regression: bool` | always `0` |
| `export --format tailwind <file>` | Emit Tailwind theme JSON | `0` |
| `export --format dtcg <file>` | Emit W3C DTCG `tokens.json` | `0` |
| `spec [--format markdown\|json]` | Emit the spec itself (for prompt injection) | `0` |

Programmatic API: `import { lint } from '@google/design.md/linter'`.

## Spec-acknowledged limitations

The spec calls these out explicitly:

- sRGB hex only — no OKLCH, no Display P3, no alpha channel
- No dark-mode/theming primitives
- Components section "actively evolving"
- Status: alpha; format expected to change

## What real files do in the wild

- **Material-3 vocabulary** dominates the official examples (`atmospheric-glass`, `paws-and-paths`, `totality-festival`) — `surface-container-highest`, `inverse-on-surface`, `*-fixed-dim`. Heavy and verbose; only adopt if your DS already follows M3.
- **Semantic naming** (`bg`, `bg-elevated`, `accent`) — see `tw93/Kaku/website/DESIGN.md`. Pragmatic, minimal, recommended for most cases.
- **Light/dark namespace flattening** — see `questpie/autopilot/DESIGN.md`. Prefix every token with `light-` and `dark-`. Workaround for missing theming.
- **OKLCH violation with sidecar** — see `pbakaus/impeccable/DESIGN.md`. Stores `oklch()` strings; relies on a custom parser. The most direct precedent for our dimensional + OKLCH case, but be aware the official linter will warn.
