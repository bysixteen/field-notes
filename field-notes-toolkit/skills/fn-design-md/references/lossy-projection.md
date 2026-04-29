# Lossy projection: dimensional system → DESIGN.md + DTCG sidecar

The Google DESIGN.md spec cannot natively carry a dimensional, OKLCH-based design system. This file documents what survives the projection, what is sidecarred to the DTCG `tokens.json`, and what is encoded in prose.

Use this when explaining trade-offs to the user, debugging a round-trip, or deciding whether DESIGN.md is the right output format at all.

## What survives in DESIGN.md unchanged

- Token names (downcased, kebab-cased)
- Hex sRGB approximations of every colour
- Typography stack: family, size, weight, line-height, letter-spacing
- Rounded scale
- Spacing scale
- Component primitives (button, input, card) with the eight allowed properties
- Variant naming as flat sibling keys

## What is preserved only in the DTCG sidecar

These cannot be expressed in DESIGN.md and live exclusively in `tokens.json` (DTCG Format Module 2025.10):

| Concern | Why DESIGN.md can't carry it |
|---------|------------------------------|
| OKLCH values | Spec mandates `#RRGGBB` sRGB hex only |
| Display P3 / wide-gamut colours | Same |
| Alpha-channel colours | Hex format excludes alpha |
| Multiple themes (light/dark) | No native theming primitive |
| Token aliases / chains | Spec allows references but not aliasing chains |
| Border tokens | No `borderColor`, `borderWidth` properties |
| Elevation / shadow tokens | No `boxShadow`, `elevation` properties |
| Motion tokens (duration, easing) | No motion section |
| Z-index scale | Not modelled |
| Density tokens | Not modelled |

When emitting, treat the sidecar as the authoritative source of truth and the DESIGN.md as a downsampled view. If the two ever disagree, the sidecar wins.

## What is preserved only in prose (`## Do's and Don'ts`)

These are **rules**, not values, so they have no place in YAML:

| Rule | Why it lives in prose |
|------|------------------------|
| Dimensional independence (no two dimensions control the same CSS property) | Not a token value |
| Decision order (Sentiment → Emphasis → Size → Structure → State) | Procedural |
| Colour cascade (State → Emphasis → Sentiment → Semantic Color) | Resolution behaviour, not a value |
| Interpolation behaviour for unnamed variants | Procedural |
| Sentiment selection criteria | Semantic guidance |
| Anti-patterns (e.g. don't apply sentiment to non-component surfaces) | Constraint, not a value |
| Pattern definitions (cards-with-action, dialog layouts) | Compositional, not atomic |

Without these, an agent can produce *correct* tokens but *incoherent* applications.

## Round-trip behaviour

| Conversion | Lossless? | Notes |
|------------|-----------|-------|
| Dimensional source → DTCG `tokens.json` | Yes | DTCG 2025.10 covers everything we use |
| Dimensional source → DESIGN.md | No | Lossy on colour space, theming, borders, shadows, motion |
| DESIGN.md → DTCG (via `@google/design.md export --format dtcg`) | Yes for what's in DESIGN.md | Won't recover anything that wasn't there |
| DESIGN.md → Tailwind config | Lossy | Variants flatten to utility names; no cascade |
| DTCG `tokens.json` → DESIGN.md | Not yet supported | Google CLI only goes the other way |

The practical implication: the DTCG sidecar is the canonical export; DESIGN.md is the agent-facing summary.

## When DESIGN.md is the wrong output format

Don't generate a DESIGN.md when:

- The source system relies primarily on motion tokens or animations.
- The output consumer is another design tool (Figma, Tokens Studio, Style Dictionary) — emit DTCG `tokens.json` directly.
- The system has more than two themes; DESIGN.md's namespace flattening becomes unreadable.
- The product needs strict accessibility validation; the linter only catches contrast warnings, not full WCAG.

In any of these cases, emit the DTCG sidecar only and skip the DESIGN.md.

## Verification checklist

After emitting, verify:

1. `lint` exit code is 0 (errors are zero).
2. Every colour token in `tokens.json` has a corresponding hex approximation in DESIGN.md, OR is documented in `## Do's and Don'ts` as sidecar-only.
3. The dimensional vocabulary listed in `## Do's and Don'ts` matches the source's actual dimensions (no invented sentiments).
4. Round-trip: `npx @google/design.md export --format dtcg <DESIGN.md>` produces a `tokens.json` whose shared keys match the sidecar exactly.
5. Spot-check 3–5 component variants visually — do they communicate the dimensional intent the source system encodes?
