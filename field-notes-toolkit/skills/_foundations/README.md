# Foundations — shared mental model for `fn-*` skills

Every `fn-*` skill applies a specialist lens (tokens, accessibility, React patterns, CSS, etc.) over the same baseline mental model. This directory holds that baseline. Skills read foundations first, then apply their lens.

These files are **terse, stable, and project-agnostic**. They summarise canonical content that lives in `/content/design-system/` and the individual skill files — they do not duplicate it. If a foundation file and a canonical doc disagree, the canonical doc wins.

## The four foundations

| File | What it anchors | Canonical source |
|---|---|---|
| [DIMENSIONAL-MODEL.md](DIMENSIONAL-MODEL.md) | The 5 dimensions, vocabulary, decision order | [`/content/design-system/model/`](../../../content/design-system/model/) |
| [TOKEN-ARCHITECTURE.md](TOKEN-ARCHITECTURE.md) | Mixing desk, 4-layer chain, color cascade | [`fn-tokens/SKILL.md`](../fn-tokens/SKILL.md), [`/content/design-system/token-chain/`](../../../content/design-system/token-chain/) |
| [QUALITY-GATES.md](QUALITY-GATES.md) | Severity model, verdict logic, findings schema | [`fn-review/SKILL.md`](../fn-review/SKILL.md) |
| [DESIGN-INTENT.md](DESIGN-INTENT.md) | Project DESIGN.md and how skills align with it | [`fn-design-md/SKILL.md`](../fn-design-md/SKILL.md) |

## Read order

For an audit-style skill (`fn-tokens`, `fn-css`, `fn-accessibility`, `fn-html`, `fn-react-patterns`, `fn-component-api`, `fn-review`):

1. **DESIGN-INTENT** — does this project have a `DESIGN.md`? Read it. The project's stated intent overrides general defaults.
2. **DIMENSIONAL-MODEL** — establishes the vocabulary every skill uses (Sentiment, Emphasis, State, Size, Structure).
3. **TOKEN-ARCHITECTURE** — establishes the cascade rules and naming conventions.
4. **QUALITY-GATES** — establishes severity language and the findings schema all audit output uses.

For scaffolding or generation skills (`fn-component-scaffold`, `fn-storybook-*`), the order is the same; QUALITY-GATES is less load-bearing because no findings are emitted.

## Inter-skill communication

Audit skills emit findings using the schema defined in [QUALITY-GATES.md](QUALITY-GATES.md#findings-schema). `fn-review` consumes that schema directly — there is one contract, not one per skill.

## When to update these files

Update a foundation file when the canonical source updates and the summary drifts. Do not add new prose, examples, or rules here that don't already exist canonically — write those in the canonical doc first, then summarise.
