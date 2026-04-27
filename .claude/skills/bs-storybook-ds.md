---
name: bs-storybook-ds
description: >-
  Orchestrate design system documentation generation across Storybook and Figma.
  Determines target type (component, foundation, or full system), loads the helper
  API, delegates to the right sub-skill, and verifies output against the uSpec
  quality checklist. Triggers on: "document this in storybook", "generate
  documentation", "storybook docs", "create doc pages", "document the design
  system", "generate uSpec docs", "full documentation for X".
---

# Design System Documentation Orchestrator

## Foundations (read first)

- [DIMENSIONAL-MODEL](_foundations/DIMENSIONAL-MODEL.md)

Generate uSpec-quality documentation for design system components and foundations. This skill orchestrates sub-skills and enforces consistent page structure across all documentation output.

## Stages

| Stage | Concern | Skill | When |
|-------|---------|-------|------|
| 0 | Load helper API | `bs-storybook-helpers` | Always (first) |
| 1 | Component documentation | `bs-storybook-docs` | Target is a component |
| 2 | Foundation documentation | `bs-storybook-foundations` | Target is tokens/scale |

## Workflow

1. **Determine target type.** Read what the user is asking to document:
   - A component (`.tsx` + `.types.ts` + `.css`) -> stage 1
   - A foundation (CSS token files: colours, spacing, typography, elevation, motion) -> stage 2
   - "Full system" or "all docs" -> stages 1 and 2 in sequence
2. **Load helper API (stage 0).** Always run `bs-storybook-helpers` first. This loads the complete catalogue of documentation helper components. All subsequent stages must use exclusively these helpers.
3. **Run the appropriate sub-skill(s).**
4. **Verify output** against the uSpec quality checklist below.
5. **Report** which checklist items pass and which need attention.

## uSpec Quality Checklist

Every documentation page must satisfy these criteria. Check each after generation:

### Structure
- [ ] Page wrapped in `DocPage` with `title` and `subtitle`
- [ ] Every section uses `SectionHeading`, not ad hoc headings or inline styles
- [ ] Major sections separated by visual breaks (spacing or dividers)
- [ ] `autodocs` tag and `fullscreen` layout present in meta

### Content completeness
- [ ] Token tables show both Figma variable path and CSS custom property
- [ ] Anatomy uses numbered breakdown: # / Element / Role / Type columns
- [ ] Do/Don't examples present for every behavioural rule
- [ ] Dark mode comparison included (light and dark side by side via `data-theme`)
- [ ] Design rationale callouts explain "why", not just "what" (use `Callout variant="note"`)

### Real UI context
- [ ] At least one specimen shows tokens applied to an actual UI composition (card, nav bar, form) rather than isolated swatches alone
- [ ] Specimens use real component instances where available, not mocked HTML

### Cross-referencing
- [ ] Every token entry includes its Figma variable path via `FigmaRef`
- [ ] Component docs link back to relevant foundation pages
- [ ] Foundation docs reference which components consume each token

### Zero hardcoded values
- [ ] No inline `style={{ }}` attributes in story JSX
- [ ] No hardcoded hex colours, pixel values, or font sizes
- [ ] All visual presentation through helper components and `docStyles.ts`

## Design Rationale Pattern

Every documentation page should include at least one rationale callout that explains a design decision:

```tsx
<Callout variant="note">
  The spacing scale uses a 4px base grid because touch targets on Madeline
  require 48px minimum hit areas, and 48 divides cleanly by 4. This keeps
  all interactive elements aligned without sub-pixel rounding.
</Callout>
```

Place rationale callouts after the specimens they explain, not before. They answer "why is it this way?" for designers who encounter the system for the first time.

## Page Anatomy

A complete documentation page follows this order:

```
1. DocPage (title, subtitle)
2. Section: Overview
   - Brief description of purpose
   - Design rationale callout
3. Section: Visual specimens
   - Dimension grids, swatches, scale visualisations
   - Real UI context example
4. Section: Token reference
   - TokenTable with Figma path + CSS property + value
5. Section: Anatomy (components only)
   - Numbered element breakdown
6. Section: Usage guidance
   - DosDonts with behavioural rules
7. Section: Theme comparison
   - Light and dark side by side
```

Not every page needs every section. Foundation pages skip anatomy. Simple components may skip theme comparison if they have no colour tokens. But the order must be preserved for consistency.

## After Generation

Offer to:
1. Run the generated stories in Storybook to verify rendering
2. Create any missing helper components referenced in the output
3. Generate the equivalent Figma documentation page (when `bs-figma-docs` is available and Prism MCP is connected)
