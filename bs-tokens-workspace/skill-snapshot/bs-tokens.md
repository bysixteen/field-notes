---
name: bs-tokens
description: >-
  Use when working with design tokens — consuming tokens in CSS, reasoning
  about the dimensional model, auditing token cascade integrity, or building a
  component token API. Covers the mixing desk model, six resolution dimensions
  (state, emphasis, sentiment, size, density, structure), color cascade
  integrity, hardcoded value audits, and choosing the right CSS custom property
  for any context. Also use when styling an element to match the design system
  or tracing a token chain.
---

# Design Tokens

## Two Concerns

**Part 1 -- Using Tokens:** How to write styles with CSS custom properties from the token system.
**Part 2 -- Token Architecture:** How to reason about, build, and audit the multi-dimensional token model.

## The Mixing Desk Model

Each dimension is a fader on a mixing desk -- faders move independently. The component's visual output is the intersection of all fader positions.

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

## Color Cascade (bottom-up)

```
Semantic Color (global)
    |
    v
Sentiment (component) -- aliases Semantic Color
    |
    v
Emphasis (component) -- aliases Sentiment
    |
    v
State (component) -- aliases Emphasis
```

Each layer aliases the one below. A single Sentiment change propagates through Emphasis and State automatically.

### Why bottom-up beats top-down

With bottom-up aliasing, changing a Sentiment token (e.g., switching the error palette) instantly updates every Emphasis and State variant — without touching those collections at all. Top-down would require updating every terminal token individually. The cascade does the work.

## Token Naming Conventions

### Color Tokens

| Pattern | Example | When |
|---------|---------|------|
| `--{property}-{level}` | `--fg-primary`, `--bg-surface` | Semantic globals |
| `--{property}-{level}-{state}` | `--fg-primary-hover` | State variants |
| `--{component}-{property}` | `--button-bg`, `--button-fg` | Component-scoped |
| `--{component}-{property}-{state}` | `--button-bg-hover` | Component state |
| `--colors-{palette}-{step}` | `--colors-blue-700` | Primitives (never use directly in components) |

### Scale Tokens

| Pattern | Example | When |
|---------|---------|------|
| `--size-{n}` | `--size-16`, `--size-24` | Spacing values |
| `--radii-{name}` | `--radii-sm`, `--radii-full` | Border radius |
| `--stroke-weight-{n}` | `--stroke-weight-1` | Border width |

### Typography Tokens

| Pattern | Example | When |
|---------|---------|------|
| `--font-size-{n}` | `--font-size-14` | Font size |
| `--font-weight-{n}` | `--font-weight-500` | Font weight |
| `--font-family-{name}` | `--font-family-sans` | Font family |
| `--leading-{name}` | `--leading-tight` | Line height |
| `--tracking-{name}` | `--tracking-wide` | Letter spacing |

### Motion Tokens

| Pattern | Example |
|---------|---------|
| `--duration-{name}` | `--duration-fast`, `--duration-normal` |
| `--ease-{name}` | `--ease-out`, `--ease-in-out` |

## Audit Rules

### BLOCKING (color track)

| # | Rule | Check |
|---|------|-------|
| 1 | State layer: every COLOR must alias Emphasis | `--button-bg-hover` aliases `--button-bg` from Emphasis, not a primitive |
| 2 | Emphasis layer: every COLOR must alias Sentiment | `--button-bg` (high) aliases Sentiment collection |
| 3 | Sentiment layer: every COLOR must alias Semantic Color | Sentiment collection aliases `--fg-*`, `--bg-*` globals |

### WARNING (structural track)

| # | Rule | Check |
|---|------|-------|
| 4 | Structure spacing must alias Size | `--button-padding-x` aliases `--size-*` |
| 5 | Structure typography must alias Semantic Typography | `--button-font-size` aliases `--font-size-*` |
| 6 | Structure radius must alias Semantic Scale | `--button-radius` aliases `--radii-*` |

### Hardcoded Value Detection

| Pattern | Severity | Fix |
|---------|----------|-----|
| `#hex` or `rgb()` in component CSS | BLOCKING | Replace with `var(--token)` |
| `oklch()` in component CSS | BLOCKING | Replace with `var(--token)` |
| Pixel value for spacing | SERIOUS | Replace with `var(--size-*)` |
| Pixel value for font-size | SERIOUS | Replace with `var(--font-size-*)` |
| Pixel value for border-radius | WARNING | Replace with `var(--radii-*)` |

## Cascade Debugging Workflow

When a token resolves to an unexpected value, follow this sequence:

1. **Start at State layer** — what does the broken token resolve to? Check if it aliases an Emphasis token or has a hardcoded value.
2. **Follow the chain** — State → Emphasis → Sentiment → Semantic Color. Inspect each alias link.
3. **Identify the break point** — which link in the chain is wrong?

| Break pattern | Symptom | Fix |
|---------------|---------|-----|
| State aliases a primitive directly | Color doesn't respond to theme | Re-alias to Emphasis token |
| Emphasis aliases wrong collection | Emphasis change has no effect | Point alias to Sentiment collection |
| Sentiment aliases a primitive | Sentiment swap doesn't cascade | Point alias to Semantic Color global |
| Missing alias (token is unset) | Token resolves to transparent or initial | Add alias at correct layer |
| Circular reference | Token loop / infinite resolve | Audit the chain in Figma Variables panel |

## "Which token should I use?" Decision Tree

```
What are you styling?
  |
  +-- Color (background, foreground, border)
  |     |
  |     +-- Is this a component-level state/emphasis/sentiment?  --> var(--{component}-bg/fg/border)
  |     +-- Is this a global UI surface?                         --> var(--bg-surface), var(--fg-primary)
  |     +-- Should it adapt to theme?                            --> Never use --colors-* primitives
  |
  +-- Spacing (padding, gap)
  |     --> var(--size-*) or var(--{component}-padding-x/y)
  |
  +-- Typography (font-size, weight, line-height)
  |     --> var(--font-size-*), var(--font-weight-*), var(--leading-*)
  |
  +-- Radius
        --> var(--radii-*) or var(--{component}-radius)
```

**New component token or reuse existing semantic token?**
- Reuse if: the token maps cleanly to a global semantic (e.g., `--bg-surface`).
- Create component token if: the value is component-specific and may diverge in future.
- If new: follow Build Order — which collection should own it and what should it alias?

## Dark Mode Verification Checklist

| Check | Pass condition |
|-------|---------------|
| All color tokens have light + dark mode values | No mode value is empty or inherited |
| Contrast ratios maintained in both modes | 4.5:1 text, 3:1 UI components |
| No token accidentally hardcoded in one mode only | Check Figma Variables panel per mode |
| Semantic Color globals have both modes | `--fg-primary` resolves in light AND dark |
| No primitive tokens used directly in components | All component tokens alias through the cascade |

## Build Order (new component)

| Step | Collection | Aliases From | Contains |
|------|-----------|-------------|----------|
| 1 | Sentiment | Semantic Color globals | `--component-bg`, `--component-fg` per sentiment mode |
| 2 | Emphasis | Sentiment collection | `--component-bg`, `--component-fg` per emphasis mode |
| 3 | State | Emphasis collection | `--component-bg-hover`, `--component-bg-active` etc. |
| 4 | Structure | Semantic Scale / Typography | `--component-padding-x`, `--component-radius`, `--component-font-size` |
| 5 | Size | Raw FLOAT values | `--component-height`, `--component-gap` per size mode |
| 6 | Audit | All collections | Run audit rules on every collection |

## Output Format Template

```
===========================================================
TOKEN AUDIT: {ComponentName}
Files: {CSS and token files reviewed}
===========================================================

COLOR TRACK:
  Sentiment -> Semantic Color:  {PASS | FAIL: details}
  Emphasis -> Sentiment:         {PASS | FAIL: details}
  State -> Emphasis:             {PASS | FAIL: details}

STRUCTURAL TRACK:
  Spacing -> Size:               {PASS | FAIL: details}
  Typography -> Semantic Type:   {PASS | FAIL: details}
  Radius -> Semantic Scale:      {PASS | FAIL: details}

HARDCODED VALUES:
  {count} found
  Line {n}: {value} -- should be {token}

TOKENS CONSUMED:
  Color:     {list}
  Spacing:    {list}
  Typography: {list}
  Structure:  {list}

FINDINGS:
  [{BLOCKING|WARNING}] {description}
    Current: {what exists}
    Should be: {correct alias chain}

===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `bs-css` | CSS consumes tokens -- audit CSS alongside token integrity |
| `bs-component-api` | Dimension inputs (sentiment, emphasis, size) map 1:1 to token collections |
| `bs-component-scaffold` | Scaffold sets up initial token consumption in CSS |
| `bs-review` | Full review runs token audit as Stage 4 |
| `bs-storybook-foundations` | Foundation stories document the token system visually |
| `bs-storybook-docs` | Component docs include a TokenReference story |

See your project's design system documentation for the full token audit, token chain, and token transform pipeline references.
