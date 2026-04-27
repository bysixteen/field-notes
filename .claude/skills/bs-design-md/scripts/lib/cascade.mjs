// cascade.mjs — implements the cap policy and tie-break rules documented in
// references/dimensional-mapping.md.
//
// _foundations/TOKEN-ARCHITECTURE.md is the canonical contract for cascade order
// (State → Emphasis → Sentiment → Semantic Color, line 48). This file is a NEW
// implementation of that contract — there is no pre-existing walker to reuse.
//
// Cap policy literals (e.g. "rest", "md") are NEVER hard-coded here. Defaults are
// resolved from the per-dimension `default` field of the dimensional_values
// frontmatter at runtime, which is why the cap-default-flip test can change
// state.mdx's `default` from `rest` to `hover` and observe a different matrix
// without touching code.

// Build the flat variant list for one component, restricted to its applies_to
// matrix and capped per the policy at references/dimensional-mapping.md:43-57.
//
// Inputs:
//   component   - component name (string)
//   applies_to  - { sentiment: [...], emphasis: [...], size: [...], state: [...] }
//                 (already resolved by walker — "all" expanded; arrays validated)
//   defaults    - { sentiment, emphasis, size, state } from frontmatter
//
// Returns: array of variant names in deterministic order.
//
// Rules (from dimensional-mapping.md):
//   - every (sentiment × emphasis) at default size + default state
//   - each size at default (sentiment, emphasis, state)
//   - each non-default state at default (sentiment, emphasis, size)
//   - disabled for every sentiment at default (emphasis, size)
//
// "Default" is whatever the dimension's frontmatter says it is — flipping
// state.mdx default from rest → hover changes the matrix without code edits.
export function flattenComponentMatrix({ component, applies_to, defaults }) {
  const variants = new Set();

  const sentiments = applies_to.sentiment;
  const emphases = applies_to.emphasis;
  const sizes = applies_to.size;
  const states = applies_to.state;

  const defSent = defaults.sentiment;
  const defEmph = defaults.emphasis;
  const defSize = defaults.size;
  const defState = defaults.state;

  // 1. every (sentiment × emphasis) at default size + default state
  if (sizes.includes(defSize) && states.includes(defState)) {
    for (const s of sentiments) {
      for (const e of emphases) {
        variants.add(variantName({ component, sentiment: s, emphasis: e, size: defSize, state: defState, defaults }));
      }
    }
  }

  // 2. each size at default sentiment + default emphasis + default state
  if (sentiments.includes(defSent) && emphases.includes(defEmph) && states.includes(defState)) {
    for (const sz of sizes) {
      variants.add(variantName({ component, sentiment: defSent, emphasis: defEmph, size: sz, state: defState, defaults }));
    }
  }

  // 3. each non-default state at default (sentiment, emphasis, size) — handled
  //    here to ensure default-state rows aren't double-emitted.
  if (sentiments.includes(defSent) && emphases.includes(defEmph) && sizes.includes(defSize)) {
    for (const st of states) {
      if (st === defState) continue;
      variants.add(variantName({ component, sentiment: defSent, emphasis: defEmph, size: defSize, state: st, defaults }));
    }
  }

  // 4. disabled for every sentiment at default (emphasis, size) — only if both
  //    'disabled' is in the applies_to.state list AND emphases/sizes include
  //    their defaults (otherwise the row can't be produced).
  if (states.includes("disabled") && emphases.includes(defEmph) && sizes.includes(defSize)) {
    for (const s of sentiments) {
      variants.add(variantName({ component, sentiment: s, emphasis: defEmph, size: defSize, state: "disabled", defaults }));
    }
  }

  // Determinism: sort lexicographically. This is the round-trip pin — the
  // emit-twice test asserts identical output across shuffled inputs.
  return Array.from(variants).sort();
}

// Compose a variant name per references/dimensional-mapping.md:18 — drop any
// segment that equals its dimension's default. Always lowercase.
export function variantName({ component, sentiment, emphasis, size, state, defaults }) {
  const parts = [component];
  if (sentiment !== defaults.sentiment) parts.push(sentiment);
  if (emphasis !== defaults.emphasis) parts.push(emphasis);
  if (size !== defaults.size) parts.push(size);
  if (state !== defaults.state) parts.push(state);
  return parts.join("-").toLowerCase();
}

// Resolve a colour token path through the cascade contract documented in
// _foundations/TOKEN-ARCHITECTURE.md (State → Emphasis → Sentiment → Semantic
// Color). Returns the resolved hex value at the supplied coordinate.
//
// This is intentionally thin in PR1 — Branch 2 wires it into the YAML emitter.
// It accepts a tokens map keyed by canonical path strings; the projection
// pipeline will produce that map.
export function resolveColorCascade({ tokens, sentiment, emphasis, state, fallback }) {
  // Try the most specific path first, fall back through the cascade order.
  const candidates = [
    ["color", sentiment, emphasis, state],
    ["color", sentiment, emphasis],
    ["color", sentiment, state],
    ["color", sentiment],
    ["color", "neutral", emphasis, state],
    ["color", "neutral"],
  ];
  for (const path of candidates) {
    const key = path.join(".");
    if (tokens[key]?.$value !== undefined) return tokens[key].$value;
  }
  return fallback ?? null;
}
