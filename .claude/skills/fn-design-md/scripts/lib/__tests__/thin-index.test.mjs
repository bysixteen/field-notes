import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isThinIndexEntry,
  lookupNamespaceTokens,
  parseDimensionEncoding,
} from "../thin-index.mjs";

const VOCAB = {
  sentiment: ["neutral", "warning", "highlight", "new", "positive"],
  emphasis: ["high", "medium", "low"],
  size: ["xs", "sm", "md", "lg", "xl"],
  state: ["rest", "hover", "active", "selected", "disabled"],
};

test("isThinIndexEntry — true when contract / radixBase / tokenNamespace present", () => {
  assert.equal(isThinIndexEntry({ contract: "x", radixBase: null, tokenNamespace: "y" }), true);
  assert.equal(isThinIndexEntry({ tokenNamespace: "y" }), true);
  assert.equal(isThinIndexEntry({ radixBase: "@radix-ui/react-slot" }), true);
});

test("isThinIndexEntry — false for legacy flat shape and migrated shape", () => {
  assert.equal(isThinIndexEntry({ backgroundColor: "#000" }), false);
  assert.equal(isThinIndexEntry({ applies_to: { sentiment: "all" }, properties: {} }), false);
});

test("isThinIndexEntry — false for non-objects", () => {
  assert.equal(isThinIndexEntry(null), false);
  assert.equal(isThinIndexEntry(undefined), false);
  assert.equal(isThinIndexEntry("string"), false);
});

test("lookupNamespaceTokens — returns flat map of leaf $values", () => {
  const tokens = {
    button: {
      backgroundColor: { $type: "color", $value: "{colors.primary}" },
      textColor: { $value: "#FFFFFF" },
    },
  };
  assert.deepEqual(lookupNamespaceTokens(tokens, "button"), {
    backgroundColor: "{colors.primary}",
    textColor: "#FFFFFF",
  });
});

test("lookupNamespaceTokens — returns empty when namespace is missing", () => {
  assert.deepEqual(lookupNamespaceTokens({ color: {} }, "button"), {});
  assert.deepEqual(lookupNamespaceTokens(null, "button"), {});
  assert.deepEqual(lookupNamespaceTokens({ button: {} }, "button"), {});
});

test("lookupNamespaceTokens — flattens nested groups with dash-joined keys", () => {
  const tokens = {
    button: {
      hover: { backgroundColor: { $value: "#222" } },
      backgroundColor: { $value: "#000" },
    },
  };
  assert.deepEqual(lookupNamespaceTokens(tokens, "button"), {
    "hover-backgroundColor": "#222",
    backgroundColor: "#000",
  });
});

test("parseDimensionEncoding — collapses full-vocab values to 'all'", () => {
  const md = `
## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral, warning, highlight, new, positive | neutral |
| emphasis | data-emphasis | high, medium, low | high |
| state | data-state | rest, hover, active, selected, disabled | rest |
| size | data-size | xs, sm, md, lg, xl | md |
`;
  const result = parseDimensionEncoding(md, VOCAB);
  assert.deepEqual(result, {
    sentiment: "all",
    emphasis: "all",
    state: "all",
    size: "all",
  });
});

test("parseDimensionEncoding — keeps subsets verbatim", () => {
  const md = `
## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral, warning | neutral |
| size | data-size | sm, md | md |
`;
  const result = parseDimensionEncoding(md, VOCAB);
  assert.deepEqual(result, {
    sentiment: ["neutral", "warning"],
    size: ["sm", "md"],
  });
});

test("parseDimensionEncoding — ignores rows whose dimension is unknown", () => {
  const md = `
## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| theme | data-theme | light, dark | light |
| sentiment | data-sentiment | neutral | neutral |
`;
  const result = parseDimensionEncoding(md, VOCAB);
  assert.deepEqual(result, { sentiment: ["neutral"] });
});

test("parseDimensionEncoding — returns null when section is absent", () => {
  assert.equal(parseDimensionEncoding("# Component\n\n## Props\n\nfoo", VOCAB), null);
});

test("parseDimensionEncoding — returns null when table is malformed (no data rows)", () => {
  const md = `
## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
`;
  assert.equal(parseDimensionEncoding(md, VOCAB), null);
});
