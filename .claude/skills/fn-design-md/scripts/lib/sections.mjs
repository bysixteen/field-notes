// sections.mjs — registry of built-in section renderers keyed by `source` id.
//
// A template entry with `disposition: generated` references a renderer here
// via its `source` field. Renderers receive (name, frontmatter) and return
// the prose body that goes between the section's start/end markers (the
// heading line is added by the emitter, not the renderer).
//
// Adding a new built-in renderer means: add it here, document it in
// references/profiles.md, write a test in __tests__/sections.test.mjs.

export const RENDERERS = {
  overview: renderOverview,
  colors: renderColors,
  typography: renderTypography,
  components: renderComponents,
  "dos-and-donts": renderDosAndDonts,
  "anti-patterns": renderAntiPatterns,
  "wide-gamut": renderWideGamut,
};

export function getRenderer(source) {
  const fn = RENDERERS[source];
  if (!fn) {
    throw new Error(
      `sections: no renderer registered for source "${source}". ` +
        `Known sources: ${Object.keys(RENDERERS).join(", ")}.`
    );
  }
  return fn;
}

function renderOverview(name) {
  return `${name} is a design system. The values in this file are the source of truth for an AI agent generating new UI; the prose below explains how to apply them.`;
}

function renderColors(_name, frontmatter) {
  const colorCount = Object.keys(frontmatter.colors ?? {}).length;
  return `This system defines ${colorCount} colour tokens. The hex values in the YAML frontmatter are sRGB approximations — for wide-gamut OKLCH originals, see the sidecar \`tokens.json\`.`;
}

function renderTypography() {
  return `Typography tokens map intent (heading, body, label) to specific font, size, weight, and leading. Use the named tokens; do not author one-off values.`;
}

function renderComponents(_name, frontmatter) {
  const compCount = Object.keys(frontmatter.components ?? {}).length;
  return `${compCount} component primitives are defined. Variants are sibling keys with related names (e.g. \`button\`, \`button-hover\`). Composition follows: Sentiment → Emphasis → Size → Structure → State.`;
}

function renderDosAndDonts() {
  return `### Composition Model

Every component is the product of up to five independent dimensions: **Sentiment, Emphasis, Size, Structure, State**. Each is orthogonal — it does not conflict with any other dimension.

- Sentiment: what the component communicates (\`neutral\`, \`warning\`, \`highlight\`, \`new\`, \`positive\`)
- Emphasis: how loudly it communicates (\`high\`, \`medium\`, \`low\`)
- Size: physical footprint (\`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`)
- Structure: fixed anatomical dimensions (radius, gap, internal padding)
- State: interactive condition (\`rest\`, \`hover\`, \`active\`, \`selected\`, \`disabled\`)

**Decision order:** Sentiment → Emphasis → Size → Structure → State. State is never a composition decision — it's a runtime response.

### Cascade and Interpolation

Not every (sentiment × emphasis × size × state) combination is named in this file. When a combination isn't named, find the closest named variant by swapping one dimension at a time toward the default. The colour cascade resolves bottom-up: **State → Emphasis → Sentiment → Semantic Color**.

### Anti-patterns

- Don't apply sentiment colour to non-component surfaces.
- Don't override state colours per component — state shifts come from the cascade.
- Don't use a primitive token directly in a component; always reference the semantic layer.
- Don't combine multiple high-emphasis components on the same surface.

### Wide-gamut colour

The \`colors\` block is hex sRGB only because the DESIGN.md spec mandates it. Original OKLCH/Display P3 values live in the sidecar \`tokens.json\`. When a tool round-trips through DTCG, prefer the sidecar.`;
}

function renderAntiPatterns() {
  return `- Don't apply sentiment colour to non-component surfaces.
- Don't override state colours per component — state shifts come from the cascade.
- Don't use a primitive token directly in a component; always reference the semantic layer.
- Don't combine multiple high-emphasis components on the same surface.`;
}

function renderWideGamut() {
  return `The \`colors\` block is hex sRGB only because the DESIGN.md spec mandates it. Original OKLCH/Display P3 values live in the sidecar \`tokens.json\`. When a tool round-trips through DTCG, prefer the sidecar.`;
}
