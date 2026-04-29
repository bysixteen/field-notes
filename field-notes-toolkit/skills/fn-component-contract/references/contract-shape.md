# Contract shape — quick reference

One-page summary of the canonical `<Component>.contract.md` shape. Authority lives at [`content/design-system/tools/component-schema.mdx`](../../../../content/design-system/tools/component-schema.mdx); this file is for fast lookup during scaffolding.

## Required sections (every contract)

In this order:

1. **`## Props`** — Markdown table: `| Prop | Type | Default | Notes |`. Lift from `<Component>.types.ts` (or inline in `.tsx`). TypeScript types are authoritative. Use `—` for missing default. Expand string-union types in **Notes** with pipe separators.

2. **`## Dimension encoding`** — Markdown table: `| Dimension | data-* attribute | Values | Default |`. One row per `data-*` the component renders. Values come from the matching union type. Default comes from the destructured prop default. Omit dimensions the component does not use.

3. **`## Token bindings`** — Bullet list: `` - `--var-name` → semantic role ``. Records CSS custom properties the component **declares** (not just consumes). Roles use semantic vocabulary (background fill, label colour, border, corner radius, etc.) not hex or token paths.

4. **`## Usage rules`** — Three short paragraphs:
   - **When to use** — decision boundary against neighbouring components.
   - **Anti-patterns** — 3–5 concrete misuses as imperatives ("Do not pass a `loading` boolean — use `state='resolving'`").
   - **Primitive base** — underlying element or library (`native <button>`, `Radix Dialog`).

## Recommended sections (gated)

Add only when the trigger condition fires.

| Section | Trigger | Skip when |
|---------|---------|-----------|
| `## A11y` | Component has a Radix base, manages focus, or implements non-trivial keyboard interaction (arrow-key nav, Escape-to-dismiss, type-ahead). | Static-display primitive (Badge, Card, Avatar) covered by the underlying element. Coverage lives in Storybook a11y tests. |
| `## Behavior` | Component manages internal state (open/closed, hover-with-delay, optimistic UI), traps focus, or has async transitions worth pinning down. | Component is stateless and rendering is fully determined by props. |

The shared underlying trigger: **interactive complexity that prop documentation alone cannot capture**. If the component is a primitive that just renders, the four required sections are the whole contract.

## Deferred section

| Section | Trigger |
|---------|---------|
| `## Execution rules` | A real drift case has surfaced in review or production — a component is being reimplemented in a way that violates an unwritten constraint, and the contract needs to make that constraint enforceable. |

Vocabulary: `layoutEffect`, `allowedMechanisms`, `forbiddenMechanisms`, `paddingCompensation`, `interactivity`, `widthBehaviour`, `heightBehaviour`. Do **not** preemptively add this section. Foundation-level defaults stay parked until enough component-level contracts exist to extract meaningful patterns.

## Authority and order

- Markdown is canonical. No JSON sibling. The `.tsx` signature is the ultimate authority on prop names and types.
- Hand-author the contract when scaffolding the component (day-one artefact).
- Update the contract in the same PR as any change to prop surface, dimension encoding, or token bindings.
- Reviewers read the contract first; drift is caught at the PR diff.

## See also

- [`component-schema.mdx`](../../../../content/design-system/tools/component-schema.mdx) — full canonical schema with worked examples.
- [`fn-component-api`](../../fn-component-api/SKILL.md) — the four input categories the contract documents.
- [`fn-component-scaffold`](../../fn-component-scaffold/SKILL.md) — the file manifest the contract sits alongside.
