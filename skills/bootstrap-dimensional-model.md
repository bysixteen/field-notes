# Bootstrap Dimensional Model

> Create the dimensional token file defining device font sizes for REM scaling and spacing arrays on a 4 px grid.

## Required Inputs

| Input | Type | Description |
|-------|------|-------------|
| Device breakpoints | Record | Map of device label → root font size in px (e.g., `{ "mobile": 16, "tablet": 17, "desktop": 18 }`) |

## Expected Outputs

- `packages/ui/dimensional-tokens.ts` containing `DEVICE_FONT_SIZES`, spacing array, and gap array.

## Prerequisites

- Node.js ≥ 18 installed.
- Project shell already bootstrapped (root `package.json` and `packages/ui/` directory exist).

## Execution Steps

1. Create `packages/ui/dimensional-tokens.ts`.
2. Define `DEVICE_FONT_SIZES` — a record mapping device labels to their root font size in px. These values drive REM scaling across breakpoints.
3. Define a `SPACING` array on a 4 px grid (e.g., `[0, 4, 8, 12, 16, 24, 32, 48, 64, 96]`).
4. Define a `GAP` array as a subset of the spacing scale suitable for layout gaps (e.g., `[4, 8, 16, 24, 32]`).
5. Export all constants as named exports.
6. Verify the file has no syntax errors: `npx tsc --noEmit packages/ui/dimensional-tokens.ts`.

## Verification

- `packages/ui/dimensional-tokens.ts` exists and passes type-checking.
- `DEVICE_FONT_SIZES` contains entries for each target device.
- Every value in `SPACING` and `GAP` is divisible by 4.
- All constants are exported and importable.
