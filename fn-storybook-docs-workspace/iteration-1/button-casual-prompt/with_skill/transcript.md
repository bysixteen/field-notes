# Transcript — Button Documentation Stories Generation

## Task

Generate a comprehensive `Button.docs.stories.tsx` file following the `fn-storybook-docs` skill.

## Steps

1. **Read the skill** at `.claude/skills/fn-storybook-docs.md` to understand the required output structure, patterns, and validation checklist.
2. **Read all input files:**
   - `Button.tsx` — extracted props interface with defaults (sentiment=neutral, emphasis=high, state=rest, size=md, structure=standard), JSX structure (root button, prefix slot, label, suffix slot, spinner overlay), and data-* attribute pattern.
   - `Button.types.ts` — extracted five dimension unions: ButtonSentiment (5 modes), ButtonEmphasis (3 modes), ButtonState (5 modes), ButtonSize (5 modes), ButtonStructure (3 modes).
   - `Button.css` — extracted 12 CSS custom properties across four categories (color, spacing, typography, structure), plus section-based overrides for each dimension.
   - `index.ts` — confirmed public exports.
   - `stories/helpers/index.ts` — confirmed available helpers (DocPage, TokenTable, Swatch, DemoBox, DosDonts, FigmaRef, Callout) and the DimensionalToken type.
3. **Generated `Button.docs.stories.tsx`** with all required stories:
   - `Default` — component at all defaults
   - `Sentiments` — grid of all 5 sentiment modes
   - `Emphases` — grid of all 3 emphasis levels
   - `Sizes` — grid of all 5 size modes
   - `States` — grid of all 5 interactive states
   - `Structures` — grid of all 3 structure variants
   - `AllCombinations` — sentiment x emphasis matrix (15 combinations)
   - `TokenReference` — programmatic table of all 12 CSS custom properties
   - `Anatomy` — numbered 5-element breakdown matching JSX structure
   - `UsageGuidance` — do/don't examples covering emphasis hierarchy, a11y, and token discipline
   - `DarkMode` — light and dark theme side by side

## Validation

- Every dimension from the types file has a dedicated story.
- Token table entries match exactly the 12 `--btn/*` custom properties from `Button.css`.
- Anatomy matches all 5 JSX elements (root, prefix, label, suffix, spinner).
- All imports reference existing modules (`button-component`, `stories/helpers`).
- No hardcoded color or spacing values in story renders.
- `autodocs` tag is present on meta.
