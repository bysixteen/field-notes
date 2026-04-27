# Attribution

This file is the canonical attribution log for the bysixteen design-engineering canon. Other bysixteen repos (Bolton Metro, Prism, future projects) link here rather than maintaining their own copies. Crediting sources makes the system more trustworthy, not less original.

For the full bibliography (50+ design systems, podcasts, articles), see [Industry Research](./content/design-system/approaches/industry-research.mdx). This file is the curated, top-level summary; the research page is the deep reference.

URLs marked `(pending)` are sources we have attribution for but have not yet confirmed the canonical URL. They will be filled in by maintainers.

---

## People

| Person | Affiliation | Concept attributed | URL |
|---|---|---|---|
| Diana Wolosin | Indeed | JSON vs Markdown component contract research; ~80% token reduction for MCP consumption | (pending) |
| Romina Kavcic | The Design System Guide | Token metadata schema (`$description`, `$extensions.usage`, `pairedTokens`, `a11y`, `doNot`, `components`); "skills wrap MCP" pattern for design systems | (pending) |
| Adam Argyle | Google / Open Props | CSS techniques and custom-property patterns; framing of the composition gap in design systems | https://open-props.style |
| Barbara Minto | McKinsey | Pyramid Principle — answer-first documentation structure | (pending) |
| Nathan Curtis | EightShapes | Token taxonomy and variant decomposition writing | (pending) |
| Brad Frost & Ian Frost | Independent | Design Tokens course / education material | (pending) |
| Garth Braithwaite | Adobe | Spectrum tokens and platform scale (Design Systems Podcast) | (pending) |
| Damien Senger | Independent | *Tokens* podcast | (pending) |
| Josh Cusick | Independent | Design System Primitives writing | (pending) |
| Samantha Gordashko | Independent | Multi-dimensional theming (Smashing Conf workshop) | (pending) |

## Internal projects (bysixteen)

| Project | Concept attributed | Reference |
|---|---|---|
| Neo | OKLCH ramp generation methodology; dual-mode primitives pattern; three-tier CSS Custom Properties schema; motion timing system (layout 400ms, content enter 300ms, exit 200ms) | Internal — see Neo repo |
| Bolton Metro | ADR-0009 / Issue #398 — formal alignment to five-dimension model; density removal | Internal — see Bolton Metro repo |
| Prism | `prism-figma-mcp` — 71-tool Figma bridge for design-system tooling | https://github.com/bysixteen/prism |

Other bysixteen repos: link to this file from your own `ATTRIBUTION.md` rather than duplicating entries. See [How to cite this file](#how-to-cite-this-file).

## Design systems & libraries

The canon draws on patterns from the following systems. Each is cited inline in `content/design-system/approaches/industry-research.mdx` with the specific lesson taken.

| System | Pattern attributed |
|---|---|
| Radix UI | Accessible unstyled primitives; Radix Colors 12-step ramp |
| Tailwind CSS | 50–1000 numeric ramp convention; utility composition |
| Adobe Spectrum | Platform scale (1.25×); dimensional model; multi-dimensional theming |
| Open Props | CSS-variable-first design token distribution |
| Ariakit | Accessibility patterns for unstyled components |
| Headless UI | Accessibility baseline for utility-CSS systems |
| GitHub Primer | Token primitives approach |
| IBM Carbon | Component-level naming and token taxonomy |
| Braid (SEEK) | Independent `tone` and `weight` props as orthogonal axes |
| HeroUI / NextUI | "Semantic intent over visual style" principle |
| Panda CSS | Slot recipes for variant composition |
| Tokens Studio | Multi-dimensional theme composition; theme grouping |
| Class Variance Authority (CVA) | Variant-first component API pattern |
| Tailwind Variants | Independent variant dimensions with compound variants |
| Adobe Leonardo | Constraint-based contrast-preserving color generation |
| Tinte | Color generation reference |

## Methodologies & standards

| Concept | Source | URL |
|---|---|---|
| OKLCH color space | CSS Color Module Level 4 (W3C) | https://www.w3.org/TR/css-color-4/ |
| WCAG 2.2 AA | W3C Web Content Accessibility Guidelines | https://www.w3.org/TR/WCAG22/ |
| Gestalt principles | Gestalt psychology — perceptual grouping for spacing tiers | (pending) |
| Pyramid Principle | Barbara Minto, McKinsey (1960s) | (pending) |
| Design Tokens Community Group (DTCG) | W3C Community Group — `tokens.json` format | https://www.designtokens.org/ |
| Google `DESIGN.md` spec | Google Labs — portable, agent-readable design-system context | (pending) |
| `llms.txt` standard | Machine-readable documentation index for LLM consumption | https://llmstxt.org/ |
| AGENTS.md / CLAUDE.md research | arXiv:2601.20404 — context files speed task completion ~28%, reduce tokens ~16% | https://arxiv.org/abs/2601.20404 |
| `axe-core` | Deque Systems — automated WCAG checks | https://github.com/dequelabs/axe-core |
| `react-aria` | Adobe — accessible React hooks | https://react-spectrum.adobe.com/react-aria/ |

## Originated here

Work that originated in field-notes and is referenced from other bysixteen repos:

- `bs-design-md` skill and four-layer **CLAUDE.md / DESIGN.md / tokens.json / Component.md** context stack — [PR #116](https://github.com/bysixteen/field-notes/pull/116). Authored by [@bysixteen](https://github.com/bysixteen).

---

## How to cite this file

Other bysixteen repos should add an `ATTRIBUTION.md` at their root that links back here:

```markdown
## Shared bysixteen concepts

For shared design-engineering concepts (tokens, dimensional model, OKLCH, motion system),
see the canonical attribution log: https://github.com/bysixteen/field-notes/blob/main/ATTRIBUTION.md

This repo only enumerates project-specific attributions below.
```

Do not duplicate entries in this file; reference back to it. Cross-repo verification (that Bolton Metro and Prism `ATTRIBUTION.md` files link here) happens during their respective attribution audit issues, not here.
