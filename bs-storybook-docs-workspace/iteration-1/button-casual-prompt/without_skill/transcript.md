# Transcript: Button Documentation Stories (without skill)

## What was done

1. Read all five input files to understand the Button component's props, types, CSS tokens, and available story helpers.
2. Generated a comprehensive `Button.docs.stories.tsx` file containing 10 stories:
   - **Playground** — interactive controls story with all props wired up.
   - **Grid: Sentiment x Emphasis** — 5x3 matrix showing every sentiment/emphasis combination.
   - **Grid: Size Scale** — all five sizes (xs through xl) side by side.
   - **Grid: States** — rest, hover, active, disabled, and resolving states.
   - **Grid: Structure** — standard, icon-only, and split variants.
   - **Slots: Prefix & Suffix** — prefix, suffix, and both-slots demos.
   - **Token Table** — all 12 CSS custom properties with category, default value, and description.
   - **Anatomy** — visual breakdown of internal slots (prefix, label, suffix, spinner).
   - **Usage: Do's & Don'ts** — 10 paired examples covering label casing, emphasis hierarchy, aria-label requirements, resolving state usage, and sentiment matching.
   - **Accessibility** — summary of a11y features (disabled handling, aria-busy, aria-label, aria-hidden spinner, contrast, touch targets).

## Approach

- Used the dimensional model (sentiment, emphasis, state, size, structure) from `Button.types.ts` to drive the grid stories.
- Extracted every CSS custom property from `Button.css` for the token table.
- Derived anatomy from the JSX structure in `Button.tsx`.
- Do's/Don'ts cover common real-world misuse patterns: capitalisation, emphasis stacking, missing aria-labels, unexplained disabled states, and sentiment/action mismatches.
