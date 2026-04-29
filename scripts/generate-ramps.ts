/**
 * generate-ramps.ts
 *
 * Converts anchor colour definitions into complete 12-step primitive ramps.
 * Outputs CSS custom properties, JSON, Figma variable schemas, and a DTCG
 * tokens.json (W3C Design Tokens Format Module) at the repo root.
 *
 * Algorithm:
 *   1. Parse anchor hex values into OKLCH
 *   2. Apply lightness targets per scheme (LIGHTNESS_TARGETS_LIGHT / DARK)
 *   3. Interpolate hue between anchors (shortest-arc)
 *   4. Distribute chroma using a bell-curve (σ = 0.28)
 *   5. Gamut-map results back to sRGB via clampChroma()
 *   6. Emit outputs in four formats
 *
 * Dependencies: culori (npm install culori)
 * Run: npx tsx scripts/generate-ramps.ts
 */

import { parse, oklch, formatHex, clampChroma, type Oklch } from "culori";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Anchor {
  /** Hex colour value, e.g. "#FFD700" */
  hex: string;
  /** Which ramp step this anchor is pinned to, e.g. 500 */
  step: RampStep;
}

interface PaletteDefinition {
  name: string;
  anchors: Anchor[];
}

interface RampColor {
  step: RampStep;
  oklch: Oklch;
  hex: string;
}

interface Ramp {
  name: string;
  light: RampColor[];
  dark: RampColor[];
}

type RampStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | 1000;

// ---------------------------------------------------------------------------
// Lightness targets
// ---------------------------------------------------------------------------

const RAMP_STEPS: RampStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];

/**
 * Fixed lightness targets for the light scheme.
 * Lower steps are lighter (backgrounds); higher steps are darker (text).
 */
const LIGHTNESS_TARGETS_LIGHT: Record<RampStep, number> = {
  50: 0.98,
  100: 0.95,
  200: 0.92,
  300: 0.88,
  400: 0.82,
  500: 0.75,
  600: 0.65,
  700: 0.52,
  800: 0.45,
  900: 0.35,
  950: 0.25,
  1000: 0.15,
};

/**
 * Fixed lightness targets for the dark scheme.
 * Approximate mirror of the light scheme — step 50 is the darkest.
 */
const LIGHTNESS_TARGETS_DARK: Record<RampStep, number> = {
  50: 0.12,
  100: 0.16,
  200: 0.22,
  300: 0.28,
  400: 0.34,
  500: 0.42,
  600: 0.52,
  700: 0.65,
  800: 0.75,
  900: 0.85,
  950: 0.92,
  1000: 0.98,
};

// ---------------------------------------------------------------------------
// Palette definitions
// ---------------------------------------------------------------------------

/**
 * Canonical palette definitions.
 *
 * Gold ramp fix: the original gold anchor was placed at step 500 with a
 * high chroma value that caused the mid-range steps to be perceptually
 * non-uniform. The fix moves the peak chroma anchor to step 600 (the
 * "solid background" range) and adds a secondary anchor at step 200 to
 * anchor the hue in the background range, preventing the hue from drifting
 * into green at low lightness values.
 */
const PALETTES: PaletteDefinition[] = [
  {
    name: "neutral",
    anchors: [{ hex: "#6B7280", step: 500 }],
  },
  {
    name: "highlight",
    anchors: [{ hex: "#2563EB", step: 600 }],
  },
  {
    name: "positive",
    anchors: [{ hex: "#16A34A", step: 600 }],
  },
  {
    name: "warning",
    // Gold ramp: anchor at step 600 (solid range) prevents perceptual
    // uniformity defect. Secondary anchor at step 200 fixes hue drift.
    anchors: [
      { hex: "#FEF3C7", step: 200 },
      { hex: "#D97706", step: 600 },
    ],
  },
  {
    name: "danger",
    anchors: [{ hex: "#DC2626", step: 600 }],
  },
  {
    name: "new",
    anchors: [{ hex: "#7C3AED", step: 600 }],
  },
];

// ---------------------------------------------------------------------------
// Core generation
// ---------------------------------------------------------------------------

/**
 * Interpolate hue between two anchor hues using shortest-arc (circular)
 * interpolation to prevent crossing through unrelated hues.
 */
function interpolateHue(h1: number, h2: number, t: number): number {
  let diff = h2 - h1;
  // Normalise to [-180, 180] range for shortest-arc
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (h1 + diff * t + 360) % 360;
}

/**
 * Bell-curve chroma distribution centred on the peak-chroma anchor.
 * σ = 0.28 produces a natural-looking saturation arc across the ramp.
 * Floor at 8% of peak chroma prevents fully desaturated mid-ramp steps.
 */
function bellCurveChroma(
  stepIndex: number,
  peakIndex: number,
  peakChroma: number,
  sigma = 0.28
): number {
  const totalSteps = RAMP_STEPS.length;
  const normalisedDistance = (stepIndex - peakIndex) / totalSteps;
  const bellValue = Math.exp(-(normalisedDistance ** 2) / (2 * sigma ** 2));
  const floor = peakChroma * 0.08;
  return floor + (peakChroma - floor) * bellValue;
}

/**
 * Generate a single ramp (light or dark) from a palette definition.
 */
function generateRamp(
  palette: PaletteDefinition,
  lightnessTargets: Record<RampStep, number>
): RampColor[] {
  // Parse all anchors into OKLCH
  const parsedAnchors = palette.anchors.map((anchor) => {
    const parsed = parse(anchor.hex);
    if (!parsed) throw new Error(`Cannot parse colour: ${anchor.hex}`);
    const ok = oklch(parsed);
    if (!ok) throw new Error(`Cannot convert to OKLCH: ${anchor.hex}`);
    return { step: anchor.step, oklch: ok };
  });

  // Sort anchors by step
  parsedAnchors.sort((a, b) => a.step - b.step);

  // Find peak chroma anchor (highest chroma value)
  const peakAnchor = parsedAnchors.reduce((max, a) =>
    (a.oklch.c ?? 0) > (max.oklch.c ?? 0) ? a : max
  );
  const peakChroma = peakAnchor.oklch.c ?? 0;
  const peakStepIndex = RAMP_STEPS.indexOf(peakAnchor.step);

  return RAMP_STEPS.map((step, stepIndex) => {
    const L = lightnessTargets[step];

    // Interpolate hue between surrounding anchors
    let H: number;
    const anchorBefore = [...parsedAnchors].reverse().find((a) => RAMP_STEPS.indexOf(a.step) <= stepIndex);
    const anchorAfter = parsedAnchors.find((a) => RAMP_STEPS.indexOf(a.step) >= stepIndex);

    if (!anchorBefore) {
      H = anchorAfter!.oklch.h ?? 0;
    } else if (!anchorAfter || anchorBefore === anchorAfter) {
      H = anchorBefore.oklch.h ?? 0;
    } else {
      const beforeIndex = RAMP_STEPS.indexOf(anchorBefore.step);
      const afterIndex = RAMP_STEPS.indexOf(anchorAfter.step);
      const t = (stepIndex - beforeIndex) / (afterIndex - beforeIndex);
      H = interpolateHue(anchorBefore.oklch.h ?? 0, anchorAfter.oklch.h ?? 0, t);
    }

    // Apply bell-curve chroma distribution
    const C = bellCurveChroma(stepIndex, peakStepIndex, peakChroma);

    // Build OKLCH color and gamut-map to sRGB
    const color: Oklch = { mode: "oklch", l: L, c: C, h: H };
    const clamped = clampChroma(color, "oklch");
    const hex = formatHex(clamped) ?? "#000000";

    return { step, oklch: clamped as Oklch, hex };
  });
}

// ---------------------------------------------------------------------------
// WCAG contrast validation
// ---------------------------------------------------------------------------

/**
 * Calculate relative luminance from an sRGB hex value.
 * Uses the WCAG 2.1 formula.
 */
function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const linearise = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

/**
 * Calculate WCAG contrast ratio between two hex colours.
 */
function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

interface ContrastValidationResult {
  palette: string;
  scheme: "light" | "dark";
  failures: Array<{
    step1: RampStep;
    step2: RampStep;
    ratio: number;
    required: number;
    hex1: string;
    hex2: string;
  }>;
}

/**
 * Validate WCAG AA contrast between adjacent ramp steps.
 *
 * The key contrast pairs for accessibility are:
 * - Text steps (900, 950, 1000) against background steps (50, 100, 200)
 * - Solid fill steps (700, 800) against white (#FFFFFF) and black (#000000)
 *
 * This fills an industry gap: most tools validate component-level contrast
 * but not the raw ramp step pairs that feed into semantic tokens.
 */
function validateContrastPairs(ramp: Ramp): ContrastValidationResult[] {
  const results: ContrastValidationResult[] = [];

  for (const scheme of ["light", "dark"] as const) {
    const colors = scheme === "light" ? ramp.light : ramp.dark;
    const colorMap = Object.fromEntries(colors.map((c) => [c.step, c.hex])) as Record<RampStep, string>;

    const failures: ContrastValidationResult["failures"] = [];

    // Text-on-background pairs: text range (900–1000) vs background range (50–200)
    const textSteps: RampStep[] = [900, 950, 1000];
    const bgSteps: RampStep[] = [50, 100, 200];

    for (const textStep of textSteps) {
      for (const bgStep of bgSteps) {
        const ratio = contrastRatio(colorMap[textStep], colorMap[bgStep]);
        if (ratio < 4.5) {
          failures.push({
            step1: textStep,
            step2: bgStep,
            ratio: Math.round(ratio * 100) / 100,
            required: 4.5,
            hex1: colorMap[textStep],
            hex2: colorMap[bgStep],
          });
        }
      }
    }

    // Solid fill on white/black: solid range (700–800) must meet AA for icons/text
    const solidSteps: RampStep[] = [700, 800];
    for (const solidStep of solidSteps) {
      const onWhite = contrastRatio(colorMap[solidStep], "#FFFFFF");
      const onBlack = contrastRatio(colorMap[solidStep], "#000000");
      // Solid fill must pass AA on at least one of white or black
      if (onWhite < 3.0 && onBlack < 3.0) {
        failures.push({
          step1: solidStep,
          step2: 50, // placeholder — represents "on white"
          ratio: Math.round(Math.max(onWhite, onBlack) * 100) / 100,
          required: 3.0,
          hex1: colorMap[solidStep],
          hex2: onWhite > onBlack ? "#FFFFFF" : "#000000",
        });
      }
    }

    results.push({ palette: ramp.name, scheme, failures });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Output emitters
// ---------------------------------------------------------------------------

function emitCss(ramps: Ramp[]): string {
  const lines: string[] = [
    "/* Auto-generated by generate-ramps.ts — do not edit manually */",
    "",
    ":root {",
  ];

  for (const ramp of ramps) {
    lines.push(`  /* ${ramp.name} — light */`);
    for (const color of ramp.light) {
      const { l, c, h } = color.oklch;
      lines.push(
        `  --colors-${ramp.name}-${color.step}: oklch(${l.toFixed(4)} ${c.toFixed(4)} ${(h ?? 0).toFixed(2)});`
      );
    }
    lines.push("");
  }

  lines.push("}");
  lines.push("");
  lines.push("@media (prefers-color-scheme: dark) {");
  lines.push("  :root {");

  for (const ramp of ramps) {
    lines.push(`    /* ${ramp.name} — dark */`);
    for (const color of ramp.dark) {
      const { l, c, h } = color.oklch;
      lines.push(
        `    --colors-${ramp.name}-${color.step}: oklch(${l.toFixed(4)} ${c.toFixed(4)} ${(h ?? 0).toFixed(2)});`
      );
    }
    lines.push("");
  }

  lines.push("  }");
  lines.push("}");

  return lines.join("\n");
}

function emitJson(ramps: Ramp[]): object {
  const result: Record<string, object> = {};

  for (const ramp of ramps) {
    result[ramp.name] = {
      light: Object.fromEntries(
        ramp.light.map((c) => [
          c.step,
          {
            hex: c.hex,
            oklch: `oklch(${c.oklch.l.toFixed(4)} ${c.oklch.c.toFixed(4)} ${(c.oklch.h ?? 0).toFixed(2)})`,
          },
        ])
      ),
      dark: Object.fromEntries(
        ramp.dark.map((c) => [
          c.step,
          {
            hex: c.hex,
            oklch: `oklch(${c.oklch.l.toFixed(4)} ${c.oklch.c.toFixed(4)} ${(c.oklch.h ?? 0).toFixed(2)})`,
          },
        ])
      ),
    };
  }

  return result;
}

/**
 * Emit a DTCG (W3C Design Tokens Format Module) document.
 *
 * Layout:
 *   - color: semantic top-level keys (primary, fg, bg, border, ...)
 *            plus per-ramp groups (neutral, highlight, positive, ...).
 *            Each leaf has $type "color" and an OKLCH $value.
 *            Dark-mode value lives under $extensions.field-notes.modes.dark.
 *   - typography: minimal stack (heading-lg/md, body-md/sm, label-md).
 *   - spacing: 4..64 px scale.
 *   - borderRadius: sm/md/lg/xl/full + alias `rounded` group consumed by
 *     emit-design-md.mjs (which accepts either key).
 *
 * The Tier 1 DESIGN.md downsamples OKLCH to hex sRGB; this file is the
 * Tier 3 source of truth that preserves wide-gamut values.
 */
function oklchString(c: Oklch): string {
  return `oklch(${c.l.toFixed(4)} ${c.c.toFixed(4)} ${(c.h ?? 0).toFixed(2)})`;
}

function emitDtcg(ramps: Ramp[]): object {
  const findColor = (rampName: string, step: RampStep, scheme: "light" | "dark"): Oklch | undefined => {
    const ramp = ramps.find((r) => r.name === rampName);
    if (!ramp) return undefined;
    return (scheme === "light" ? ramp.light : ramp.dark).find((c) => c.step === step)?.oklch;
  };

  const colorToken = (light: Oklch, dark: Oklch, description?: string): object => ({
    $type: "color",
    $value: oklchString(light),
    ...(description ? { $description: description } : {}),
    $extensions: {
      "field-notes.modes": {
        light: oklchString(light),
        dark: oklchString(dark),
      },
    },
  });

  const colors: Record<string, unknown> = {};

  // Per-ramp groups (primitives) — never used directly in components.
  for (const ramp of ramps) {
    const group: Record<string, object> = {};
    for (const step of RAMP_STEPS) {
      const light = findColor(ramp.name, step, "light")!;
      const dark = findColor(ramp.name, step, "dark")!;
      group[String(step)] = colorToken(light, dark);
    }
    colors[ramp.name] = group;
  }

  // Semantic top-level tokens. These satisfy the DESIGN.md linter and
  // give components named handles to alias.
  const ALIAS = (rampName: string, lightStep: RampStep, darkStep: RampStep, description: string): object => {
    const light = findColor(rampName, lightStep, "light")!;
    const dark = findColor(rampName, darkStep, "dark")!;
    return colorToken(light, dark, description);
  };

  // Step-pairing convention. The dark ramp mirror-inverts the light ramp's
  // step→lightness curve: in light, step 50 = lightest and step 1000 = darkest;
  // in dark, the relationship is reversed. So:
  //   - Aliases that should ADAPT to mode (bg, fg, border, hover/active/disabled
  //     interaction states) use the SAME step for both — the ramp itself flips
  //     the value, and the step number encodes the semantic role.
  //   - Aliases that should stay VISUALLY FIXED across modes (e.g. on-primary
  //     stays light text against a mid-saturation primary in both modes) use
  //     mirrored steps so the same lightness is fetched from each ramp.
  Object.assign(colors, {
    primary: ALIAS("highlight", 600, 600, "Primary action — highlight ramp solid step."),
    "primary-hover": ALIAS("highlight", 700, 700, "Primary action hover state."),
    "primary-active": ALIAS("highlight", 800, 800, "Primary action active/pressed state."),
    "primary-disabled": ALIAS("highlight", 300, 300, "Primary action disabled state."),
    "on-primary": ALIAS("neutral", 50, 1000, "Foreground on primary surfaces."),
    fg: ALIAS("neutral", 1000, 1000, "Default foreground / body text."),
    "fg-muted": ALIAS("neutral", 700, 700, "Secondary foreground / supporting text."),
    bg: ALIAS("neutral", 50, 50, "Default surface."),
    "bg-elevated": ALIAS("neutral", 100, 100, "Raised surface — cards, panels."),
    border: ALIAS("neutral", 200, 200, "Default UI border."),
    danger: ALIAS("danger", 600, 600, "Destructive sentiment."),
    warning: ALIAS("warning", 600, 600, "Cautionary sentiment."),
    positive: ALIAS("positive", 600, 600, "Affirmative sentiment."),
  });

  const typography = {
    "heading-lg": {
      $type: "typography",
      $value: { fontFamily: ["Inter", "sans-serif"], fontSize: "32px", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em" },
    },
    "heading-md": {
      $type: "typography",
      $value: { fontFamily: ["Inter", "sans-serif"], fontSize: "24px", fontWeight: 600, lineHeight: 1.3 },
    },
    "body-md": {
      $type: "typography",
      $value: { fontFamily: ["Inter", "sans-serif"], fontSize: "16px", fontWeight: 400, lineHeight: 1.5 },
    },
    "body-sm": {
      $type: "typography",
      $value: { fontFamily: ["Inter", "sans-serif"], fontSize: "14px", fontWeight: 400, lineHeight: 1.5 },
    },
    "label-md": {
      $type: "typography",
      $value: { fontFamily: ["Inter", "sans-serif"], fontSize: "14px", fontWeight: 500, lineHeight: 1.4 },
    },
  };

  const spacing = Object.fromEntries(
    [4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((n) => [
      String(n),
      { $type: "dimension", $value: `${n}px` },
    ])
  );

  const borderRadius = {
    sm: { $type: "dimension", $value: "4px" },
    md: { $type: "dimension", $value: "8px" },
    lg: { $type: "dimension", $value: "12px" },
    xl: { $type: "dimension", $value: "16px" },
    full: { $type: "dimension", $value: "9999px" },
  };

  // Per-component token groups. Each top-level key matches an entry's
  // `tokenNamespace` in components.json so emit-design-md.mjs can derive
  // the DESIGN.md `components` block by namespace lookup. References use the
  // DESIGN.md frontmatter naming convention (`colors`, `rounded`) — that is
  // the resolution target after projection, even though this sidecar's own
  // keys are `color` and `borderRadius`.
  const button = {
    backgroundColor: { $type: "color", $value: "{colors.primary}" },
    textColor: { $type: "color", $value: "{colors.on-primary}" },
    typography: { $type: "typography", $value: "{typography.label-md}" },
    rounded: { $type: "dimension", $value: "{rounded.md}" },
    padding: { $type: "dimension", $value: "{spacing.8} {spacing.16}" },
    height: { $type: "dimension", $value: "40px" },
  };
  const input = {
    backgroundColor: { $type: "color", $value: "{colors.bg}" },
    textColor: { $type: "color", $value: "{colors.fg}" },
    typography: { $type: "typography", $value: "{typography.body-sm}" },
    rounded: { $type: "dimension", $value: "{rounded.md}" },
    padding: { $type: "dimension", $value: "{spacing.8} {spacing.12}" },
    height: { $type: "dimension", $value: "40px" },
  };
  const badge = {
    backgroundColor: { $type: "color", $value: "{colors.bg-elevated}" },
    textColor: { $type: "color", $value: "{colors.fg-muted}" },
    typography: { $type: "typography", $value: "{typography.label-md}" },
    rounded: { $type: "dimension", $value: "{rounded.full}" },
    padding: { $type: "dimension", $value: "{spacing.4} {spacing.8}" },
    height: { $type: "dimension", $value: "24px" },
  };
  const alert = {
    backgroundColor: { $type: "color", $value: "{colors.bg-elevated}" },
    textColor: { $type: "color", $value: "{colors.fg}" },
    typography: { $type: "typography", $value: "{typography.body-md}" },
    rounded: { $type: "dimension", $value: "{rounded.md}" },
    padding: { $type: "dimension", $value: "{spacing.16}" },
  };
  const card = {
    backgroundColor: { $type: "color", $value: "{colors.bg-elevated}" },
    textColor: { $type: "color", $value: "{colors.fg}" },
    rounded: { $type: "dimension", $value: "{rounded.lg}" },
    padding: { $type: "dimension", $value: "{spacing.24}" },
  };

  return {
    $schema: "https://design-tokens.org/community-group/format/",
    $description: "Field Notes design system — generated by scripts/generate-ramps.ts. Tier 3 source of truth. Edit the script, not this file.",
    color: colors,
    typography,
    spacing,
    borderRadius,
    button,
    input,
    badge,
    alert,
    card,
  };
}

function emitFigmaVariables(ramps: Ramp[]): object {
  const collections: object[] = [];

  for (const ramp of ramps) {
    const variables: object[] = [];

    for (const step of RAMP_STEPS) {
      const lightColor = ramp.light.find((c) => c.step === step)!;
      const darkColor = ramp.dark.find((c) => c.step === step)!;

      variables.push({
        name: `${ramp.name}/${step}`,
        type: "COLOR",
        modes: {
          light: lightColor.hex,
          dark: darkColor.hex,
        },
      });
    }

    collections.push({
      name: `colors/${ramp.name}`,
      variables,
    });
  }

  return { collections };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  console.log("Generating colour ramps...\n");

  const ramps: Ramp[] = PALETTES.map((palette) => ({
    name: palette.name,
    light: generateRamp(palette, LIGHTNESS_TARGETS_LIGHT),
    dark: generateRamp(palette, LIGHTNESS_TARGETS_DARK),
  }));

  // Validate contrast
  console.log("Running WCAG contrast validation...\n");
  let hasFailures = false;

  for (const ramp of ramps) {
    const validationResults = validateContrastPairs(ramp);
    for (const result of validationResults) {
      if (result.failures.length > 0) {
        hasFailures = true;
        console.warn(`⚠  ${result.palette} (${result.scheme}):`);
        for (const failure of result.failures) {
          console.warn(
            `   step ${failure.step1} (${failure.hex1}) vs step ${failure.step2} (${failure.hex2}): ` +
              `${failure.ratio}:1 (required ${failure.required}:1)`
          );
        }
      }
    }
  }

  if (!hasFailures) {
    console.log("✓ All contrast pairs pass WCAG AA\n");
  }

  // Determine output directories
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(__dirname, "..");
  const outDir = path.join(repoRoot, "generated");
  fs.mkdirSync(outDir, { recursive: true });

  // Emit CSS
  const cssOutput = emitCss(ramps);
  fs.writeFileSync(path.join(outDir, "colors.css"), cssOutput, "utf8");
  console.log(`✓ Written: generated/colors.css`);

  // Emit JSON
  const jsonOutput = emitJson(ramps);
  fs.writeFileSync(path.join(outDir, "colors.json"), JSON.stringify(jsonOutput, null, 2), "utf8");
  console.log(`✓ Written: generated/colors.json`);

  // Emit Figma variables
  const figmaOutput = emitFigmaVariables(ramps);
  fs.writeFileSync(
    path.join(outDir, "figma-variables.json"),
    JSON.stringify(figmaOutput, null, 2),
    "utf8"
  );
  console.log(`✓ Written: generated/figma-variables.json`);

  // Emit DTCG tokens.json at repo root (Tier 3 source of truth)
  const dtcgOutput = emitDtcg(ramps);
  fs.writeFileSync(
    path.join(repoRoot, "tokens.json"),
    JSON.stringify(dtcgOutput, null, 2) + "\n",
    "utf8"
  );
  console.log(`✓ Written: tokens.json`);

  console.log("\nDone.");
}

main();
