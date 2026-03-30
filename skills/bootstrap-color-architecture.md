# Bootstrap Color Architecture

> Create the color ramp generator seeded with user-provided anchor values.

## Required Inputs

| Input | Type | Description |
|-------|------|-------------|
| Anchor colors | Record | Map of color name → OKLCH anchor value (e.g., `{ "blue": "oklch(0.55 0.24 260)" }`) |

## Expected Outputs

- `packages/ui/generate-ramps.ts` containing the anchor map and ramp generation logic.
- Generated 12-step color ramps for each anchor when the script is executed.

## Prerequisites

- Node.js ≥ 18 installed.
- Project shell already bootstrapped (root `package.json` and `packages/ui/` directory exist).

## Execution Steps

1. Ask the user for their anchor colors — a set of name/OKLCH pairs.
2. Create `packages/ui/generate-ramps.ts`:
   - Define an `ANCHORS` constant with the user-provided color map.
   - Implement a `generateRamp(anchor: string, steps: number)` function that produces a 12-step lightness ramp in OKLCH space.
   - Export a `main()` function that iterates over anchors and writes the generated ramps.
3. Verify the file exists and has no syntax errors: `npx tsc --noEmit packages/ui/generate-ramps.ts`.
4. Run the generator: `npx tsx packages/ui/generate-ramps.ts`.
5. Confirm the output contains 12 steps per anchor color.

## Verification

- `packages/ui/generate-ramps.ts` exists and passes type-checking.
- Running the generator produces ramp output with the correct number of steps for each anchor.
- Each ramp step is a valid OKLCH color string.
