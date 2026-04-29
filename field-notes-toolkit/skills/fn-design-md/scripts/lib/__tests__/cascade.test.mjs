import { test } from "node:test";
import assert from "node:assert/strict";
import { flattenComponentMatrix, variantName, resolveColorCascade } from "../cascade.mjs";

const FULL_VOCAB = {
  sentiment: ["neutral", "warning", "highlight", "new", "positive"],
  emphasis: ["high", "medium", "low"],
  size: ["xs", "sm", "md", "lg", "xl"],
  state: ["rest", "hover", "active", "selected", "disabled"],
};
const CANONICAL_DEFAULTS = { sentiment: "neutral", emphasis: "high", size: "md", state: "rest" };

function appliesAll() {
  return {
    sentiment: FULL_VOCAB.sentiment.slice(),
    emphasis: FULL_VOCAB.emphasis.slice(),
    size: FULL_VOCAB.size.slice(),
    state: FULL_VOCAB.state.slice(),
  };
}

test("variantName drops segments matching their default", () => {
  assert.equal(
    variantName({ component: "button", sentiment: "neutral", emphasis: "high", size: "md", state: "rest", defaults: CANONICAL_DEFAULTS }),
    "button"
  );
  assert.equal(
    variantName({ component: "button", sentiment: "warning", emphasis: "high", size: "md", state: "rest", defaults: CANONICAL_DEFAULTS }),
    "button-warning"
  );
  assert.equal(
    variantName({ component: "button", sentiment: "warning", emphasis: "low", size: "sm", state: "hover", defaults: CANONICAL_DEFAULTS }),
    "button-warning-low-sm-hover"
  );
});

test("cap policy produces 25-35 entries for an applies_to:all primitive", () => {
  const variants = flattenComponentMatrix({
    component: "button",
    applies_to: appliesAll(),
    defaults: CANONICAL_DEFAULTS,
  });
  // 15 sentiment×emphasis + 5 sizes + 4 non-default states + 5 disabled-per-sentiment
  // de-duplicated where overlaps occur (e.g. button-disabled appears in both #3 and #4).
  // Range from references/dimensional-mapping.md:59
  assert.ok(variants.length >= 25, `expected >=25 entries, got ${variants.length}`);
  assert.ok(variants.length <= 35, `expected <=35 entries, got ${variants.length}`);
});

test("cap policy emits the canonical examples from dimensional-mapping.md:32-39", () => {
  const variants = flattenComponentMatrix({
    component: "button",
    applies_to: appliesAll(),
    defaults: CANONICAL_DEFAULTS,
  });
  const set = new Set(variants);
  assert.ok(set.has("button"), "default coordinate -> bare component name");
  assert.ok(set.has("button-warning"), "warning + defaults");
  assert.ok(set.has("button-low"), "low emphasis + defaults");
  assert.ok(set.has("button-hover"), "hover state + defaults");
  assert.ok(set.has("button-warning-disabled"), "disabled-per-sentiment");
});

test("subset applies_to restricts the matrix", () => {
  // tooltip with a tight applies_to should produce far fewer entries
  const variants = flattenComponentMatrix({
    component: "tooltip",
    applies_to: {
      sentiment: ["neutral"],
      emphasis: ["medium"],
      size: ["sm", "md"],
      state: ["rest", "hover"],
    },
    defaults: { sentiment: "neutral", emphasis: "medium", size: "md", state: "rest" }, // tooltip-local defaults
  });
  // 1×1 sentiment×emphasis at default size+state = 1
  // 2 sizes at default = +1 (md is the default; sm is non-default)
  // 1 non-default state (hover) at defaults = +1
  // disabled isn't in state list, so #4 is skipped
  // Total: 3
  assert.equal(variants.length, 3);
  assert.deepEqual(new Set(variants), new Set(["tooltip", "tooltip-sm", "tooltip-hover"]));
});

test("cap-default-flip — changing defaults.state from rest to hover shifts the matrix", () => {
  const restDefaults = { ...CANONICAL_DEFAULTS, state: "rest" };
  const hoverDefaults = { ...CANONICAL_DEFAULTS, state: "hover" };

  const restVariants = new Set(
    flattenComponentMatrix({ component: "button", applies_to: appliesAll(), defaults: restDefaults })
  );
  const hoverVariants = new Set(
    flattenComponentMatrix({ component: "button", applies_to: appliesAll(), defaults: hoverDefaults })
  );

  // With rest as default, the bare 'button' name resolves to (neutral, high, md, rest)
  // and 'button-hover' is the non-default state row.
  assert.ok(restVariants.has("button"));
  assert.ok(restVariants.has("button-hover"));
  assert.ok(!restVariants.has("button-rest"));

  // Flip default to hover: now 'button' resolves to (neutral, high, md, hover) and
  // 'button-rest' is the non-default state row.
  assert.ok(hoverVariants.has("button"));
  assert.ok(hoverVariants.has("button-rest"));
  assert.ok(!hoverVariants.has("button-hover"));

  // The two sets are not equal — confirms the default IS load-bearing.
  assert.notDeepEqual(restVariants, hoverVariants);
});

test("round-trip pin: shuffled applies_to inputs produce byte-identical output", () => {
  const a = appliesAll();
  // shuffle each axis (deterministic — reverse)
  const b = {
    sentiment: a.sentiment.slice().reverse(),
    emphasis: a.emphasis.slice().reverse(),
    size: a.size.slice().reverse(),
    state: a.state.slice().reverse(),
  };
  const variantsA = flattenComponentMatrix({ component: "button", applies_to: a, defaults: CANONICAL_DEFAULTS });
  const variantsB = flattenComponentMatrix({ component: "button", applies_to: b, defaults: CANONICAL_DEFAULTS });
  assert.deepEqual(variantsA, variantsB);
  // explicit byte-identity via JSON encode
  assert.equal(JSON.stringify(variantsA), JSON.stringify(variantsB));
});

test("output is sorted lexicographically", () => {
  const variants = flattenComponentMatrix({
    component: "button",
    applies_to: appliesAll(),
    defaults: CANONICAL_DEFAULTS,
  });
  const sorted = variants.slice().sort();
  assert.deepEqual(variants, sorted);
});

test("resolveColorCascade walks State → Emphasis → Sentiment → Semantic", () => {
  const tokens = {
    "color.warning.high.hover": { $value: "#FF0000" },
    "color.warning": { $value: "#AA0000" },
    "color.neutral": { $value: "#888888" },
  };
  // Most specific match wins
  assert.equal(
    resolveColorCascade({ tokens, sentiment: "warning", emphasis: "high", state: "hover" }),
    "#FF0000"
  );
  // Fall back to sentiment-only
  assert.equal(
    resolveColorCascade({ tokens, sentiment: "warning", emphasis: "low", state: "hover" }),
    "#AA0000"
  );
  // Fall back to neutral
  assert.equal(
    resolveColorCascade({ tokens, sentiment: "highlight", emphasis: "low", state: "hover" }),
    "#888888"
  );
});
