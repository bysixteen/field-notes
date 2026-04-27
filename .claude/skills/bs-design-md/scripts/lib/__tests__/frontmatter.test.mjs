import { test } from "node:test";
import assert from "node:assert/strict";
import { extractDimensionalValues } from "../frontmatter.mjs";

test("extracts default + values from a typical model frontmatter", () => {
  const src = [
    "---",
    "title: Sentiment",
    "description: What a component communicates.",
    "dimensional_values:",
    "  default: neutral",
    "  values: [neutral, warning, highlight, new, positive]",
    "---",
    "",
    "## Definition",
  ].join("\n");
  const result = extractDimensionalValues(src, "sentiment.mdx");
  assert.equal(result.default, "neutral");
  assert.deepEqual(result.values, ["neutral", "warning", "highlight", "new", "positive"]);
});

test("returns null when dimensional_values key is absent", () => {
  const src = ["---", "title: Other", "description: x", "---", "", "body"].join("\n");
  const result = extractDimensionalValues(src, "other.mdx");
  assert.equal(result, null);
});

test("respects optional informational flag", () => {
  const src = [
    "---",
    "title: Structure",
    "dimensional_values:",
    "  default: standard",
    "  values: [standard, text]",
    "  informational: true",
    "---",
  ].join("\n");
  const result = extractDimensionalValues(src, "structure.mdx");
  assert.equal(result.informational, true);
});

test("throws when default is not in values list", () => {
  const src = [
    "---",
    "dimensional_values:",
    "  default: ghost",
    "  values: [a, b]",
    "---",
  ].join("\n");
  assert.throws(
    () => extractDimensionalValues(src, "bad.mdx"),
    /default 'ghost' is not in values \[a, b\]/
  );
});

test("throws when default is missing", () => {
  const src = ["---", "dimensional_values:", "  values: [a]", "---"].join("\n");
  assert.throws(() => extractDimensionalValues(src, "bad.mdx"), /missing required 'default'/);
});

test("throws when values is missing", () => {
  const src = ["---", "dimensional_values:", "  default: a", "---"].join("\n");
  assert.throws(() => extractDimensionalValues(src, "bad.mdx"), /missing required 'values'/);
});

test("throws when frontmatter is absent entirely", () => {
  const src = "no frontmatter here\n";
  assert.throws(() => extractDimensionalValues(src, "bad.mdx"), /no YAML frontmatter found/);
});

test("strips quotes from default and values", () => {
  const src = [
    "---",
    "dimensional_values:",
    '  default: "neutral"',
    "  values: ['neutral', 'warning']",
    "---",
  ].join("\n");
  const result = extractDimensionalValues(src, "quoted.mdx");
  assert.equal(result.default, "neutral");
  assert.deepEqual(result.values, ["neutral", "warning"]);
});
