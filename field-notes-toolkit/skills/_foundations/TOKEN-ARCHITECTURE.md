# Token Architecture — foundations

Tokens encode the dimensional model in CSS custom properties. Skills that touch tokens (consume them, audit them, generate them) reason against the structure on this page.

Canonical sources: [`bs-tokens.md`](../bs-tokens.md), [`/content/design-system/token-chain/`](../../../content/design-system/token-chain/). This file summarises; those are authoritative.

## The mixing desk

Each dimension is an independent fader. The component's visual output is the intersection of all fader positions. Faders never touch each other.

```
 Sentiment    Emphasis    State       Size        Structure
 ─────────   ─────────   ─────────   ─────────   ─────────
 │neutral│   │ high  │   │ rest  │   │  xs   │   │(fixed)│
 │warning│   │medium │   │ hover │   │  sm   │   │       │
 │highlit│   │ low   │   │active │   │  md   │   │       │
 │  new  │   │       │   │select │   │  lg   │   │       │
 │success│   │       │   │disabl │   │  xl   │   │       │
 │ error │   │       │   │resolv │   │       │   │       │
 ─────────   ─────────   ─────────   ─────────   ─────────
```

## Four-layer token chain

Tokens resolve through four named layers. Each layer aliases exactly the layer below — never skipping layers, never pointing at primitives.

| Layer | Purpose | Example |
|---|---|---|
| 1 — Primitives | Raw scale values | `--colors-blue-700`, `--size-16` |
| 2 — Semantic globals | Project-wide intent | `--fg-primary`, `--bg-surface` |
| 3 — Component slots | Per-component bindings | `--button-bg`, `--button-fg` |
| 4 — Resolver | Runtime engine that walks the chain | computed CSS custom property |

Detail: [`/content/design-system/token-chain/`](../../../content/design-system/token-chain/) (one mdx per layer).

## Color cascade (bottom-up)

```
Semantic Color (global)
    ↑ aliases
Sentiment (component) ── aliases ──→ Semantic Color
    ↑ aliases
Emphasis (component)  ── aliases ──→ Sentiment
    ↑ aliases
State (component)     ── aliases ──→ Emphasis
```

**Alias chain in one line:** State → Emphasis → Sentiment → Semantic Color.

When answering "which token?" for a colour, name the layer the token lives on (State, Emphasis, Sentiment, or Semantic) and what it aliases. Example: "`disabled` is a State-layer value; the State layer aliases Emphasis, so theme/sentiment changes propagate automatically through the chain."

### Why bottom-up beats top-down

Changing a Sentiment token (e.g., switching the error palette) instantly updates every Emphasis and State variant — without touching those collections. Top-down would require updating every terminal token individually. The cascade does the work. Any cascade audit finding that breaks the chain is **BLOCKING**: a broken link means theme changes, sentiment swaps, or emphasis overrides silently stop propagating.

## Naming conventions

| Pattern | Example | When |
|---|---|---|
| `--{property}-{level}` | `--fg-primary` | Semantic globals |
| `--{property}-{level}-{state}` | `--fg-primary-hover` | State variants |
| `--{component}-{property}` | `--button-bg` | Component-scoped |
| `--{component}-{property}-{state}` | `--button-bg-hover` | Component state |
| `--colors-{palette}-{step}` | `--colors-blue-700` | Primitives — never use directly in components |

## Common cascade violations (use as audit triggers)

- A State-layer token aliasing a Semantic Global directly (skipping Emphasis and Sentiment) — **BLOCKING**.
- A component using `--colors-*` primitives directly instead of going through component-scoped tokens — **BLOCKING**.
- Hardcoded hex/rgb/oklch values in CSS — **BLOCKING**.
- Structure tokens missing aliases for Size or font-family — **SERIOUS**.
- Non-standard naming (e.g., `--btn-bg` instead of `--button-bg`) — **MODERATE**.

Severity definitions: [QUALITY-GATES.md](QUALITY-GATES.md).
