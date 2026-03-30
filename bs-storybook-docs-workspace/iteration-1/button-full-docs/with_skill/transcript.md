# Storybook Documentation Generation — Button

## What was done

1. Read the `bs-storybook-docs` skill file to understand the required output structure and conventions.
2. Read all four Button source files (`Button.tsx`, `Button.types.ts`, `Button.css`, `index.ts`) and the `stories/helpers/index.ts` barrel export.
3. Generated `Button.docs.stories.tsx` following the skill's prescribed structure.

## Source analysis

- **Dimensions found** (5): sentiment, emphasis, state, size, structure — all have dedicated stories.
- **CSS custom properties extracted** (12): 3 colour, 3 spacing, 3 typography, 3 structure tokens.
- **Anatomy elements identified** (5): Root (.btn), Prefix (.btn__prefix), Label (.btn__label), Suffix (.btn__suffix), Spinner (.btn__spinner).

## Stories generated

| Story | Purpose |
|-------|---------|
| Default | Component at all defaults |
| Sentiments | Grid of neutral, warning, highlight, success, error |
| Emphases | Grid of high, medium, low |
| Sizes | Grid of xs, sm, md, lg, xl |
| States | Grid of rest, hover, active, disabled, resolving |
| Structures | Grid of standard, icon-only, split |
| AllCombinations | Sentiment x emphasis matrix |
| TokenReference | Programmatic token table from CSS custom properties |
| Anatomy | Numbered element breakdown from JSX |
| UsageGuidance | Do/Don't examples |
| DarkMode | Light and dark theme side by side |

## Validation

- Every dimension from the types file has a corresponding story.
- Token table entries match CSS custom properties from Button.css.
- Anatomy matches the JSX element structure in Button.tsx.
- All imports resolve to the component barrel and helpers barrel.
- No hardcoded colour or spacing values — all derived from tokens.
- `autodocs` tag is present in meta.
