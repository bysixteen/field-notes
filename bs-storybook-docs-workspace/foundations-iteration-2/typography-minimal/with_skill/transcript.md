# Transcript: Typography Token Documentation (with skill)

## Task

Document the typography tokens from `typography.css` as a Storybook foundations documentation story.

## Steps

### 1. Read the skill and reference

Read `bs-storybook-foundations.md` and `references/storybook-helpers-api.md`. Key takeaways:

- Foundation stories use `satisfies Meta` with no component type parameter.
- `parameters: { layout: 'fullscreen' }` and `tags: ['autodocs']` are required.
- All content must use helper components (`DocPage`, `Section`, `SectionHeading`, `TokenTable`, `DemoBox`, `Callout`, etc.) — no inline styles.
- Typography page should include six stories: `FontFamilies`, `FontSizes`, `FontWeights`, `LeadingScale`, `TrackingScale`, `TypePairings`.
- All CSS custom properties from the source file must appear in at least one story.

### 2. Parse the CSS token file

Read `typography.css` and extracted all custom properties:

| Category | Tokens | Count |
|----------|--------|-------|
| Font Family | `--font-family-sans`, `--font-family-mono` | 2 |
| Font Size | `--font-size-11` through `--font-size-48` | 11 |
| Font Weight | `--font-weight-400` through `--font-weight-700` | 4 |
| Leading | `--leading-none` through `--leading-loose` | 6 |
| Tracking | `--tracking-tighter` through `--tracking-wider` | 5 |

**Total: 28 custom properties.**

### 3. Check available helpers

Read the helpers barrel file at `stories/helpers/index.ts`. Exported components: `DocPage`, `TokenTable`, `Swatch`, `DemoBox`, `DosDonts`, `FigmaRef`, `Callout`. The reference API also documents `Section`, `SectionHeading`, `SwatchGrid`, `TonalRamp`, `CodeBlock`, `BreakpointScaleTable` as available.

### 4. Generate the story file

Created `TypographyScale.docs.stories.tsx` with:

- **Meta** — `title: 'Foundations/Typography'`, fullscreen layout, autodocs tag.
- **Data arrays** — Five typed `const` arrays derived from the CSS file, one per token category. Each entry includes `name`, `value`, and `description`.
- **FontFamilies** — Renders each family as a DemoBox specimen with sample text, plus a TokenTable reference.
- **FontSizes** — Renders each size as a DemoBox specimen at that size, plus a TokenTable.
- **FontWeights** — Renders each weight as a DemoBox specimen, plus a TokenTable.
- **LeadingScale** — Multi-line DemoBox specimens demonstrating line-height differences, plus a TokenTable. Includes a Callout explaining unitless multipliers.
- **TrackingScale** — DemoBox specimens showing letter-spacing with uppercase and lowercase samples, plus a TokenTable.
- **TypePairings** — Four common pairings (Display+Body, Heading+Body, Heading-sm+Compact, Sans+Mono) each in a DemoBox.

### 5. Validation against checklist

- [x] Every CSS custom property from `typography.css` appears in a story (28/28)
- [x] Zero inline `style={{ }}` attributes in story JSX
- [x] All imports from `stories/helpers/` resolve to documented components
- [x] `autodocs` tag and `fullscreen` layout present
- [x] All font families documented
- [x] CSF3 + TypeScript with `satisfies Meta`
- [x] No local presentation components created

## Output

Single file: `outputs/TypographyScale.docs.stories.tsx`
