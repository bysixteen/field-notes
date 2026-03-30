# Transcript: Button docs stories generation (with skill)

## What was done

1. Read the `bs-storybook-docs` skill file to understand the required output structure, patterns, and rules.
2. Read all input files: `Button.tsx`, `Button.types.ts`, `Button.css`, `index.ts`, and `stories/helpers/index.ts`.
3. Generated `Button.docs.stories.tsx` following the skill instructions.

## Key decisions

- **Dimensions extracted from types**: sentiment (5 modes), emphasis (3), state (5), size (5), structure (3) — all sourced from `Button.types.ts`.
- **Token map built from CSS**: 12 custom properties extracted from the `.btn` host block in `Button.css`, categorised into colour (3), spacing (3), typography (3), and structure (3).
- **Anatomy derived from JSX**: 5 elements identified — Root (fixed), Prefix (optional), Label (conditional on structure), Suffix (optional), Spinner (conditional on resolving state).
- **Structure story added**: The component has a `structure` dimension not listed in the skill's default story table, so a `Structures` story was added per the rule "only include dimension stories for dimensions the component uses".
- **All stories use helpers only**: `DocPage`, `DemoBox`, `TokenTable`, `FigmaRef`, `DosDonts`, `Callout` — no hardcoded colour or spacing values.

## Output

- `outputs/Button.docs.stories.tsx` — CSF3 story file with 11 named exports: Default, Sentiments, Emphases, Sizes, States, Structures, AllCombinations, TokenReference, Anatomy, UsageGuidance, DarkMode.
