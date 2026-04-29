# Transcript: Typography Scale Storybook Documentation

## Task

Document the typography tokens from `typography.css` as a Storybook foundations documentation file, following the `fn-storybook-foundations` skill.

## Steps

### 1. Read the skill definition

Read `/Users/danielcork/conductor/workspaces/field-notes/managua/.claude/skills/fn-storybook-foundations.md` to understand the required output structure, patterns, and rules.

Key requirements identified:
- CSF3 format with `satisfies Meta` (no component type parameter)
- `layout: 'fullscreen'` and `tags: ['autodocs']`
- Title under `Foundations/Typography Scale`
- Five stories: FontSizes, FontWeights, LeadingScale, TrackingScale, TypePairings
- Values derived from CSS custom properties, rendered via `var()` references
- Use helpers from `stories/helpers/` (DocPage, DemoBox, TokenTable, etc.)

### 2. Read the CSS token file

Read `/Users/danielcork/conductor/workspaces/field-notes/managua/fn-storybook-docs-workspace/evals/files/tokens/typography.css`.

Tokens found:
- **Font Family**: 2 tokens (`--font-family-sans`, `--font-family-mono`)
- **Font Size**: 11 tokens (`--font-size-11` through `--font-size-48`)
- **Font Weight**: 4 tokens (`--font-weight-400` through `--font-weight-700`)
- **Leading**: 6 tokens (`--leading-none` through `--leading-loose`)
- **Tracking**: 5 tokens (`--tracking-tighter` through `--tracking-wider`)

Total: 28 custom properties.

### 3. Read the helpers barrel export

Read `/Users/danielcork/conductor/workspaces/field-notes/managua/fn-storybook-docs-workspace/evals/files/stories/helpers/index.ts`.

Available helpers: `DocPage`, `TokenTable`, `Swatch`, `DemoBox`, `DosDonts`, `FigmaRef`, `Callout`.

For typography documentation, the relevant helpers are `DocPage` and `DemoBox`.

### 4. Generate the story file

Created `TypographyScale.docs.stories.tsx` with five stories:

| Story | Content |
|-------|---------|
| `FontSizes` | Table of all 11 font-size tokens with token name, rem/px values, role label, and live text sample rendered via `var()` |
| `FontWeights` | Table of all 4 weight tokens rendered at body-lg reference size |
| `LeadingScale` | All 6 line-height tokens shown with multi-line paragraph blocks to demonstrate vertical rhythm |
| `TrackingScale` | All 5 letter-spacing tokens shown with sample text |
| `TypePairings` | Four common heading + body combinations (Display+Body, Heading+Body, HeadingSm+Compact, Subtitle+Small) showing tokens working together |

### 5. Validation against skill checklist

- [x] Every CSS custom property from `typography.css` appears in a story (28/28)
- [x] Text samples render via `var()` references, not hardcoded values
- [x] Both px and rem shown for font sizes
- [x] All imports from `stories/helpers/` resolve (DocPage, DemoBox)
- [x] Autodocs tag present
- [x] `satisfies Meta` with no component type parameter
- [x] `layout: 'fullscreen'` set

## Output

- Story file: `outputs/TypographyScale.docs.stories.tsx`
