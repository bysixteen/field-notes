# Generate Storybook Documentation

> Generate a complete Storybook documentation story for a design system component, covering all dimensions, tokens, and usage patterns.

## Required Inputs

| Input | Type | Description |
|-------|------|-------------|
| Component name | String | PascalCase name (e.g., `AlertBanner`) |
| Component source | File path | Path to the `.tsx` component source |
| Component CSS | File path | Path to the `.css` file |
| Types file | File path | Path to the `.types.ts` file |

## Expected Outputs

A single `{component}.docs.stories.tsx` file containing:

1. **Overview story** — renders the component at its defaults with a description
2. **Dimension matrix stories** — one story per dimension showing all modes
3. **Token map section** — programmatic token table bound to the component's CSS custom properties
4. **Anatomy section** — numbered breakdown of the component's internal elements
5. **Usage guidance** — Do/Don't examples using the `DosDonts` helper
6. **Figma cross-references** — `FigmaRef` entries linking tokens to Figma variable paths

## Prerequisites

- The component exists with its `.tsx`, `.css`, `.types.ts`, and `index.ts` files
- The Storybook helpers directory exists (`stories/helpers/`)
- The component uses the dimensional model (`data-*` attribute selectors)

## Execution Steps

### Phase 1: Read and Analyse

1. Read the component's `.tsx` file. Extract:
   - Props interface (all dimension props, content props, slot props, event outputs)
   - Default values for each prop
   - Internal element structure (prefix, label, suffix slots etc.)

2. Read the component's `.types.ts` file. Extract:
   - All dimension union types and their modes
   - Map each dimension to its canonical vocabulary

3. Read the component's `.css` file. Extract:
   - All CSS custom properties consumed (these become the token map)
   - Section structure (host, rest, interactive, programmatic, slots, children, motion)
   - Figma variable paths from property names (convention: `--{component}/{dimension}/{property}`)

### Phase 2: Generate the Documentation Story

4. Create the story file at `stories/components/{ComponentName}.docs.stories.tsx`.

5. **Meta export** — CSF3 format with:
   - `title: 'Components/{ComponentName}'`
   - `component` reference
   - `parameters: { layout: 'fullscreen' }`
   - `tags: ['autodocs']`
   - `argTypes` grouped into three categories:
     - **Dimensions** — each dimension prop with `control: 'select'` and `options` from the types file
     - **Content** — string and ReactNode props
     - **Events** — callback props with `action` annotations

6. **Overview story** (`Default`) — renders the component with all default props. Include a brief description as a JSDoc comment above.

7. **Dimension stories** — one story per dimension:

   **Sentiments story** — renders the component once per sentiment mode in a grid, all other dimensions at default:
   ```
   neutral | warning | highlight | new | success | error
   ```

   **Emphasis story** — renders the component at each emphasis level:
   ```
   high | medium | low
   ```

   **Size story** — renders the component at each size:
   ```
   xs | sm | md | lg | xl
   ```

   **State story** — renders the component in each interactive state:
   ```
   rest | hover | active | disabled | resolving
   ```

   Only generate stories for dimensions the component actually uses.

8. **Dimension matrix story** (`AllCombinations`) — renders a grid of sentiment × emphasis for the component's most common size. This shows the full colour palette at a glance.

9. **Token map story** (`TokenReference`) — uses `DocPage` and `TokenTable` helpers to render a programmatic table of all CSS custom properties the component consumes. Structure:

   ```tsx
   const COMPONENT_TOKENS: DimensionalToken[] = [
     { figmaPath: 'Sentiment.{Component}/neutral/bg/rest', cssProperty: '--color-bg-rest', category: 'colour' },
     // ... extracted from CSS
   ];
   ```

   Group tokens by category: colour, spacing, typography, structure.

10. **Anatomy story** (`Anatomy`) — uses `DocPage` to render a numbered list of the component's internal elements:

    | # | Element | Role | Slot type |
    |---|---------|------|-----------|
    | 1 | Root | Container, receives all `data-*` attributes | Fixed |
    | 2 | Prefix | Leading icon area | Optional slot |
    | 3 | Label | Primary text content | Required |
    | 4 | Suffix | Trailing icon area | Optional slot |

    Derive this from the component's JSX structure.

11. **Usage guidance story** (`UsageGuidance`) — uses `DosDonts` helper with examples:
    - Do: use the correct sentiment for the message type
    - Don't: override emphasis with custom styles
    - Do: provide aria-label when content is icon-only
    - Don't: nest interactive components inside this component

    Derive specific guidance from the component's dimensional model and accessibility requirements.

12. **Theme story** (`DarkMode`) — renders the component in both light and dark themes side by side using the `data-theme` attribute wrapper.

### Phase 3: Validate

13. Check the generated file:
    - All imports resolve to existing helpers and component paths
    - Every dimension from the types file has a corresponding story
    - Token table entries match actual CSS custom properties in the stylesheet
    - Anatomy elements match actual JSX structure
    - No hardcoded colour values, spacing values, or token names — everything derives from source files
    - CSF3 format with proper TypeScript types

14. Verify the story renders:
    - Run Storybook if available and check for console errors
    - Confirm dimension controls work in the Storybook UI
    - Confirm theme switching works via the global decorator

## File Naming Convention

| Component | Story file |
|-----------|-----------|
| `Button` | `stories/components/Button.docs.stories.tsx` |
| `AlertBanner` | `stories/components/AlertBanner.docs.stories.tsx` |
| `StatusIndicator` | `stories/components/StatusIndicator.docs.stories.tsx` |

## Relationship to Other Skills

- **`generate-figma-documentation`** — generates the Figma-side docs; this skill generates the Storybook-side. Both should document the same component API and tokens.
- **`bs-component-scaffold`** — scaffolds the component files this skill reads from. The scaffold generates a basic `.stories.tsx`; this skill generates the comprehensive documentation story.
- **`bs-tokens`** — the token cascade rules inform which tokens appear in the token map and how they're categorised.
- **`bs-accessibility`** — the bracket classification (B1–B6) determines which accessibility guidance appears in the usage section.

## Verification

- Documentation story file exists with all sections
- Autodocs tag is present for automatic props table generation
- Dimension stories cover every mode from the types file
- Token table matches actual CSS custom properties
- Anatomy matches actual JSX structure
- Figma cross-references use correct variable paths
- No hardcoded values — everything derived from source
