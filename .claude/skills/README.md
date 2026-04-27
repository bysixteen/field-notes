# Skills

Index of every skill under `.claude/skills/`. Skills are project-agnostic — they're consumed via the consumer project's `CLAUDE.md` (which references the canonical paths below) and produce artefacts the consumer commits to its own repo.

## bs-* — design system skills

One-line summaries pulled from each skill's `description` frontmatter. For full guidance, open the SKILL.md (directory bundles) or the `.md` (single-file skills).

| Skill | Purpose |
|---|---|
| [bs-accessibility](./bs-accessibility.md) | Run a scored WCAG 2.2 AA accessibility audit on a design system component. |
| [bs-component-api](./bs-component-api.md) | Define, name, type, and default component inputs for a design system. |
| [bs-component-scaffold](./bs-component-scaffold.md) | Scaffold a new design system component with full boilerplate. |
| [bs-css](./bs-css.md) | Write, review, and audit CSS/SCSS for design system components. |
| [bs-design-md](./bs-design-md/SKILL.md) | Generate, validate, or update a `DESIGN.md` from tokens + components or by projecting a 5-D dimensional system. |
| [bs-html](./bs-html.md) | Decide which HTML elements and ARIA attributes to use in a component. |
| [bs-react-patterns](./bs-react-patterns.md) | Review React component code for modern patterns in DS contexts. |
| [bs-review](./bs-review.md) | Orchestrate a six-stage design system component review. |
| [bs-storybook-docs](./bs-storybook-docs.md) | Generate Storybook documentation for a component. |
| [bs-storybook-ds](./bs-storybook-ds.md) | Orchestrate Storybook + Figma documentation generation. |
| [bs-storybook-foundations](./bs-storybook-foundations.md) | Generate Storybook foundation pages (colour, spacing, type, radii…). |
| [bs-storybook-helpers](./bs-storybook-helpers.md) | Catalogue of documentation helper components used to build Storybook pages. |
| [bs-testing](./bs-testing.md) | Review or write tests for design system components (unit, a11y, visual). |
| [bs-tokens](./bs-tokens.md) | Work with design tokens — consume in CSS, reason about the dimensional model, audit cascade integrity. |

### Aliases

- **`bs-design`** — alias of `bs-design-md`. The canonical path is `bs-design-md/SKILL.md`; a one-line redirect lives at `bs-design/SKILL.md`.

## Workflow skills

| Skill | Purpose |
|---|---|
| [start-issue](./start-issue/) | Begin work on a GitHub issue: create branch, plan, implement, open PR. |
| [start-work](./start-work/) | Start a working session without an issue. Writes a brief, sets up a branch. |

## Foundations

`_foundations/` carries the canonical contracts that the bs-* skills cite — token architecture, quality gates, naming conventions. Skills reference these instead of restating them, so a single edit propagates everywhere.

## Related

- `.claude/rules/` — repo-level rules referenced by every session (Prism MCP, content conventions).
- `_foundations/TOKEN-ARCHITECTURE.md` — canonical contract for the State → Emphasis → Sentiment → Semantic Color cascade (implemented by `bs-design-md/scripts/lib/cascade.mjs`).
