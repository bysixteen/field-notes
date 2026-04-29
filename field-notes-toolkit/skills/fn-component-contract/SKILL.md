---
name: fn-component-contract
description: >-
  Use when generating or refreshing a `<Component>.contract.md` sidecar for a
  design system component. Reads the component's `.tsx`, the project's
  `tokens.json`, and `DESIGN.md`, then populates the four required sections —
  `## Props`, `## Dimension encoding`, `## Token bindings`, `## Usage rules` —
  per the canonical schema in `content/design-system/tools/component-schema.mdx`.
  Guided template: Claude fills each section conversationally, the human
  reviewer hand-finishes. Do not promote to a generator script until 5+
  contracts ship by hand and the repetitive-vs-judgment surface is real.
---

# fn-component-contract — generate a component contract sidecar

## Foundations (read first)

- [Component contract schema](../../../content/design-system/tools/component-schema.mdx) — the canonical four-section shape (authority).
- [Contract shape — quick reference](./references/contract-shape.md) — one-page summary if the canonical doc is overkill.
- [DIMENSIONAL-MODEL](../_foundations/DIMENSIONAL-MODEL.md) — sentiment / emphasis / state / size / structure vocabulary referenced by `## Dimension encoding`.
- [TOKEN-ARCHITECTURE](../_foundations/TOKEN-ARCHITECTURE.md) — the cascade `## Token bindings` consumes.

## What it does

Given a component directory (e.g. `packages/design-system/src/components/Button/`), produce a single Markdown sidecar `<Component>.contract.md` colocated with `<Component>.tsx`. The sidecar follows the four-section canonical shape; recommended sections (`## A11y`, `## Behavior`) are added only when their trigger conditions fire.

## Inputs

- **`<Component>.tsx`** — the source for prop names, defaults (from the destructured signature), `data-*` attribute usage, and the rendered primitive base.
- **`<Component>.types.ts`** (when present) — the source for prop *types* (string unions, default values, slot shapes). If types are inline in `.tsx` instead, lift them from there.
- **`<Component>.css`** — the source for `## Token bindings`. Read both CSS custom-property *declarations* (e.g. `--btn/color/bg/rest:`) and `var(--…)` references.
- **`tokens.json`** — to confirm referenced semantic tokens exist; never dump into context (Token Trap discipline). Use targeted reads only.
- **`DESIGN.md`** — for surface vocabulary used in `## Token bindings` role names and `## Usage rules`.

**Not an input.** `components.json` — that file becomes a thin index in #170 and is not consumed by this skill.

## Output

A single file: `<Component>.contract.md`, colocated with `<Component>.tsx`. Conforms to `component-schema.mdx`. No JSON sibling. No preservation markers — the contract *is* the artefact.

## Extraction recipes

Work through each required section in order. Lift facts mechanically; flag judgment for the reviewer.

### `## Props`

Markdown table: `| Prop | Type | Default | Notes |`.

1. Read `<Component>.types.ts`. For each member of the `Props` interface, emit one row.
2. Lift the type name verbatim. If the type is a local string union (e.g. `ButtonState = 'rest' | 'hover' | …`), put the type name in the **Type** column and expand the union members in **Notes** (pipe-separated, escaping `|` as `\|`).
3. Read the destructured function signature in `<Component>.tsx` for defaults. If a prop has a default in destructure (`size = 'md'`), put it in **Default**. Otherwise use `—`.
4. Use **Notes** for one-line clarifications (`optional`, `required`, slot shape).
5. **If prop types are missing or unparseable**, emit a placeholder row: `| ? | ? | ? | prop types not found — review and fill in |`. Do not error. Do not skip the section.

### `## Dimension encoding`

Markdown table: `| Dimension | data-* attribute | Values | Default |`.

1. Grep `<Component>.tsx` for `data-…={…}` attributes on the rendered element.
2. For each unique attribute, emit one row. The dimension name is the bit after `data-`.
3. **Values** come from the matching union type in `.types.ts` (comma-separated, no pipes — pipes belong in `## Props`).
4. **Default** comes from the destructure default in the function signature.
5. Omit dimensions the component does not use. Not every component participates in all five.
6. If the component renders only static `data-*` (no prop binding), still record it — the value column lists the literal value(s) the source emits.

### `## Token bindings`

Bullet list: `- \`--var-name\` → semantic role`.

1. Open `<Component>.css`. Collect every CSS custom property the component **declares** at the host (e.g. `--btn/color/bg/rest:`). These are the surface contract — what consumers can override.
2. For each declared property, name the role it plays (`background fill`, `label and icon colour`, `border colour at every emphasis level`, `corner radius`, `horizontal inset`, `vertical inset`, `gap between slots`, `font size`, `font weight`, `line height`, `border width`, `min height`, etc.).
3. Use **semantic role names**, not hex values or token paths. Roles map to DESIGN.md surface vocabulary (background / foreground / border, etc.).
4. Group related properties (e.g. `--btn/spacing/padding-x` and `--btn/spacing/padding-y` next to each other).
5. If the component reads from a generic semantic token (`var(--color-fg)`) without re-declaring it, do **not** include that — `## Token bindings` records the **component's** custom-property surface, not the global cascade.

### `## Usage rules`

Three short paragraphs. This is the judgment-laden section.

1. **When to use.** The decision boundary against neighbouring components — what makes this primitive the right pick over its siblings (Button vs Link, Alert vs Banner, etc.). Pull vocabulary from DESIGN.md.
2. **Anti-patterns.** Three to five concrete misuses, phrased as imperatives. Examples: "Do not pass a `loading` boolean — use `state='resolving'` instead." "Do not introduce `isPrimary` / `isGhost` booleans — emphasis is an enum." Each anti-pattern should map to a real misuse seen in the wild or to a misalignment with the dimensional model. **If you cannot find concrete anti-patterns from the source or DESIGN.md, leave a `TODO(reviewer):` line rather than fabricate.**
3. **Primitive base.** The underlying element or library — `native <button>`, `Radix Dialog`, `Radix Popover`. Read it from the rendered element in `.tsx` (or the imported library). Note inherited semantics (implicit role, keyboard activation, form association).

## Recommended sections (gated)

Add **only** when the trigger fires. Do not add by default.

### `## A11y` and `## Behavior`

Both share the same trigger: **interactive complexity that prop documentation alone cannot capture**. Add when the component:

- Has a Radix base, or
- Manages focus (focus trap, restoration, roving tabindex), or
- Implements non-trivial keyboard interaction (arrow-key navigation, Escape-to-dismiss, type-ahead), or
- Manages internal state (open/closed, hover-with-delay, optimistic UI).

Skip for static-display primitives (Badge, Card, Avatar) whose accessibility is fully covered by the underlying element. Coverage in those cases lives in Storybook a11y tests and the project's accessibility audit pipeline — not in the contract.

### `## Execution rules` (deferred)

Vocabulary: `layoutEffect`, `allowedMechanisms`, `forbiddenMechanisms`, `paddingCompensation`, `interactivity`, `widthBehaviour`, `heightBehaviour`. **Do not preemptively add this section.** It exists to enforce a constraint that emerged from real drift in review or production. If you find yourself wanting to add it speculatively, stop — the foundation defaults are parked until enough component-level contracts surface a pattern.

## Idempotency

When `<Component>.contract.md` already exists, re-read it before writing.

- **Refresh** `## Props`, `## Dimension encoding`, `## Token bindings` in place from the current source. Mechanically derived — same input produces same output.
- **Preserve verbatim** `## Usage rules` and any optional sections (`## A11y`, `## Behavior`, `## Execution rules`). These are hand-authored. Do not regenerate. Do not "improve" them.
- Heading-based protection — no preservation markers in the file. The Markdown heading boundaries are the protection contract.
- If the source materially changes (new prop, removed `data-*`, new token surface), surface the change in the regenerated section *and* flag in your turn message that `## Usage rules` may now be stale and warrant a hand-update.

## Generator gate

This skill ships as a **guided template**, not an automated generator. The conservative move is documented in `.context/architecture-review-2026-04-28.md` (and in issue #169):

> Ship 5+ hand-authored contracts. Then assess what is repetitive enough to warrant a generator and what is judgment-laden enough that a generator would hallucinate. Promote to generator only if the repetitive surface is real. The JSON-first decision in `component-schema.mdx` did not survive contact with practice (#166 exists because of it); the conservative move is correct here.

Do not add `scripts/generate-contract.mjs` to this skill until that gate is met. If you are tempted, re-read the architecture review first — the trigger is empirical, not aesthetic.

## Self-review

Before declaring done, run the self-review protocol from `_foundations/SELF-REVIEW.md`.

fn-component-contract-specific checks before reporting done:

1. All four required sections present (`## Props`, `## Dimension encoding`, `## Token bindings`, `## Usage rules`).
2. Each row in `## Props` has a type (placeholder `?` is acceptable; missing column is not).
3. Each row in `## Dimension encoding` corresponds to a real `data-*` attribute in the `.tsx`.
4. Every bullet in `## Token bindings` corresponds to a CSS custom property the component declares (not just consumes from the global cascade).
5. Any optional section (`## A11y`, `## Behavior`, `## Execution rules`) is justified by a stated trigger from `component-schema.mdx`. If you cannot name the trigger, remove the section.
6. On a re-run, the hand-authored sections (`## Usage rules` and any optional sections) are preserved verbatim.
