# Skills

Index of every skill under `.claude/skills/`. Skills are project-agnostic — they're consumed via the consumer project's `CLAUDE.md` (which references the canonical paths below) and produce artefacts the consumer commits to its own repo.

## fn-* — design system skills

One-line summaries pulled from each skill's `description` frontmatter. For full guidance, open the SKILL.md (directory bundles) or the `.md` (single-file skills).

| Skill | Purpose |
|---|---|
| [fn-accessibility](./fn-accessibility.md) | Run a scored WCAG 2.2 AA accessibility audit on a design system component. |
| [fn-component-api](./fn-component-api.md) | Define, name, type, and default component inputs for a design system. |
| [fn-component-contract](./fn-component-contract/SKILL.md) | Generate or refresh a `<Component>.contract.md` sidecar from `.tsx` + `tokens.json` + `DESIGN.md`. |
| [fn-component-scaffold](./fn-component-scaffold.md) | Scaffold a new design system component with full boilerplate. |
| [fn-css](./fn-css.md) | Write, review, and audit CSS/SCSS for design system components. |
| [fn-design-md](./fn-design-md/SKILL.md) | Generate, validate, or update a `DESIGN.md` from tokens + components or by projecting a 5-D dimensional system. |
| [fn-html](./fn-html.md) | Decide which HTML elements and ARIA attributes to use in a component. |
| [fn-react-patterns](./fn-react-patterns.md) | Review React component code for modern patterns in DS contexts. |
| [fn-review](./fn-review.md) | Orchestrate a six-stage design system component review. |
| [fn-storybook-docs](./fn-storybook-docs.md) | Generate Storybook documentation for a component. |
| [fn-storybook-ds](./fn-storybook-ds.md) | Orchestrate Storybook + Figma documentation generation. |
| [fn-storybook-foundations](./fn-storybook-foundations.md) | Generate Storybook foundation pages (colour, spacing, type, radii…). |
| [fn-storybook-helpers](./fn-storybook-helpers.md) | Catalogue of documentation helper components used to build Storybook pages. |
| [fn-testing](./fn-testing.md) | Review or write tests for design system components (unit, a11y, visual). |
| [fn-tokens](./fn-tokens.md) | Work with design tokens — consume in CSS, reason about the dimensional model, audit cascade integrity. |

### Aliases

- **`fn-design`** — alias of `fn-design-md`. The canonical path is `fn-design-md/SKILL.md`; a one-line redirect lives at `fn-design/SKILL.md`.

## Workflow skills

| Skill | Purpose |
|---|---|
| [start-issue](./start-issue/) | Begin work on a GitHub issue: create branch, plan, implement, open PR. |
| [start-work](./start-work/) | Start a working session without an issue. Writes a brief, sets up a branch. |

## Foundations

`_foundations/` carries the canonical contracts that the fn-* skills cite — token architecture, quality gates, naming conventions. Skills reference these instead of restating them, so a single edit propagates everywhere.

## Related

- `.claude/rules/` — repo-level rules referenced by every session (Prism MCP, content conventions).
- `_foundations/TOKEN-ARCHITECTURE.md` — canonical contract for the State → Emphasis → Sentiment → Semantic Color cascade (implemented by `fn-design-md/scripts/lib/cascade.mjs`).
