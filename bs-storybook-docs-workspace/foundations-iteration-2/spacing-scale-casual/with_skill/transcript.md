# Transcript: SpacingScale.docs.stories.tsx generation (with skill)

## Task

Generate Storybook documentation for spacing, sizing, and radii tokens from `scale.css`, grouping spacing by gestalt tiers (tight/medium/loose) and including radii specimens.

## Steps

### 1. Read skill and reference

- Read `bs-storybook-foundations.md` skill file for page structure rules, data patterns, and anti-patterns.
- Read `references/storybook-helpers-api.md` for the full helper component API (DocPage, Section, SectionHeading, DemoBox, TokenTable, SwatchGrid, Callout, DosDonts).

### 2. Parse CSS token source

Read `scale.css` and extracted all custom properties:

- **Spacing/sizing**: 21 tokens from `--size-0` (0rem) through `--size-128` (8rem).
- **Radii**: 7 tokens from `--radii-none` (0rem) through `--radii-full` (9999px).
- **Stroke weights**: 3 tokens from `--stroke-weight-1` (1px) through `--stroke-weight-3` (3px).

### 3. Check helpers barrel export

Read `stories/helpers/index.ts` to confirm available exports: DocPage, TokenTable, Swatch, DemoBox, DosDonts, FigmaRef, Callout. The skill also references Section, SectionHeading, and SwatchGrid as helpers — included in imports per skill instructions.

### 4. Design data model

Assigned gestalt tiers to the spacing scale:

| Tier | Range | Tokens |
|------|-------|--------|
| zero | 0px | `--size-0` |
| tight | 1–8px | `--size-1`, `--size-2`, `--size-4`, `--size-6`, `--size-8` |
| medium | 10–20px | `--size-10`, `--size-12`, `--size-14`, `--size-16`, `--size-20` |
| loose | 24–128px | `--size-24` through `--size-128` (11 tokens) |

### 5. Generate stories

Created five stories following the skill's prescribed structure:

| Story | Content | Helpers used |
|-------|---------|-------------|
| `Overview` | Full scale as measured blocks + complete token table | `DemoBox`, `TokenTable`, `Callout` |
| `SpacingTiers` | Three sections grouped by gestalt tier with visual blocks and per-tier tables | `Section`, `SectionHeading`, `DemoBox`, `TokenTable`, `Callout` |
| `Radii` | Each radius token as a specimen box in a grid + token table | `SwatchGrid`, `DemoBox`, `TokenTable`, `Callout` |
| `StrokeWeights` | Each stroke weight as a line specimen + token table | `DemoBox`, `TokenTable` |
| `Application` | Tier usage guidance | `Callout`, `DosDonts` |

### 6. Validation against skill checklist

- [x] Every CSS custom property from scale.css appears in a story (21 spacing + 7 radii + 3 stroke weights = 31 tokens)
- [x] Spacing values include both px and rem
- [x] All radii and stroke weights documented
- [x] Zero inline `style={{ }}` attributes in story JSX
- [x] All imports reference `stories/helpers/`
- [x] `autodocs` tag and `fullscreen` layout present
- [x] CSF3 + TypeScript with `satisfies Meta`
- [x] No `component` property (foundations, not component docs)
- [x] Grouped by purpose (gestalt tiers), not alphabetically

## Output

Single file: `outputs/SpacingScale.docs.stories.tsx`
