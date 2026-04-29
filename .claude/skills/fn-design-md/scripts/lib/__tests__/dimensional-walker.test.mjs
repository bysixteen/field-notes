import { test } from "node:test";
import assert from "node:assert/strict";
import { walkDimensionalSource, migrateAndValidateComponents } from "../dimensional-walker.mjs";

// In-memory fs stub. Resolves paths exactly as the walker passes them.
function makeFs(files) {
  return {
    readFileSync(path) {
      if (!(path in files)) {
        const err = new Error(`ENOENT: ${path}`);
        err.code = "ENOENT";
        throw err;
      }
      return files[path];
    },
  };
}

const FIXTURE_MODEL = {
  sentiment: { default: "neutral", values: ["neutral", "warning", "highlight", "new", "positive"] },
  emphasis: { default: "high", values: ["high", "medium", "low"] },
  size: { default: "md", values: ["xs", "sm", "md", "lg", "xl"] },
  state: { default: "rest", values: ["rest", "hover", "active", "selected", "disabled"] },
  structure: { default: "standard", values: ["standard", "text"], informational: true },
};

function modelMdx({ default: def, values, informational }) {
  const lines = ["---", "dimensional_values:", `  default: ${def}`, `  values: [${values.join(", ")}]`];
  if (informational) lines.push("  informational: true");
  lines.push("---", "", "body");
  return lines.join("\n");
}

function fixtureFiles(overrides = {}) {
  const root = "/proj";
  const modelDir = `${root}/content/design-system/model`;
  const tokens = JSON.stringify({ color: { primary: { $value: "#FF0000" } } });
  const components = JSON.stringify({
    button: { backgroundColor: "{colors.primary}", textColor: "#FFFFFF" },
  });
  const files = {
    [`${root}/tokens.json`]: tokens,
    [`${root}/components.json`]: components,
    [`${modelDir}/sentiment.mdx`]: modelMdx(FIXTURE_MODEL.sentiment),
    [`${modelDir}/emphasis.mdx`]: modelMdx(FIXTURE_MODEL.emphasis),
    [`${modelDir}/size.mdx`]: modelMdx(FIXTURE_MODEL.size),
    [`${modelDir}/state.mdx`]: modelMdx(FIXTURE_MODEL.state),
    [`${modelDir}/structure.mdx`]: modelMdx(FIXTURE_MODEL.structure),
    ...overrides,
  };
  return { root, files };
}

test("walks all five model files and exposes vocab + defaults", () => {
  const { root, files } = fixtureFiles();
  const result = walkDimensionalSource(root, { readFileSync: makeFs(files).readFileSync });
  assert.deepEqual(result.vocab.sentiment, FIXTURE_MODEL.sentiment.values);
  assert.equal(result.defaults.state, "rest");
  assert.equal(result.structuralInformational.structure, true);
});

test("legacy flat components.json shape is migrated to applies_to: all", () => {
  const { root, files } = fixtureFiles();
  const result = walkDimensionalSource(root, { readFileSync: makeFs(files).readFileSync });
  const button = result.components.button;
  assert.deepEqual(button.applies_to.sentiment, FIXTURE_MODEL.sentiment.values);
  assert.deepEqual(button.applies_to.emphasis, FIXTURE_MODEL.emphasis.values);
  assert.equal(button.properties.backgroundColor, "{colors.primary}");
});

test("explicit applies_to subset is preserved verbatim", () => {
  const components = JSON.stringify({
    tooltip: {
      applies_to: {
        sentiment: ["neutral"],
        emphasis: ["medium"],
        size: ["sm", "md"],
        state: ["rest", "hover"],
      },
      properties: { backgroundColor: "#000000", textColor: "#FFFFFF" },
    },
  });
  const { root, files } = fixtureFiles({ "/proj/components.json": components });
  const result = walkDimensionalSource(root, { readFileSync: makeFs(files).readFileSync });
  assert.deepEqual(result.components.tooltip.applies_to.sentiment, ["neutral"]);
  assert.deepEqual(result.components.tooltip.applies_to.size, ["sm", "md"]);
});

test("applies_to with an unknown value fails fast with both lists shown", () => {
  const components = JSON.stringify({
    tooltip: {
      applies_to: { sentiment: ["info"], emphasis: "all", size: "all", state: "all" },
      properties: {},
    },
  });
  const { root, files } = fixtureFiles({ "/proj/components.json": components });
  assert.throws(
    () => walkDimensionalSource(root, { readFileSync: makeFs(files).readFileSync }),
    /tooltip'\.applies_to\.sentiment includes \[info\][\s\S]*sentiment\.mdx values are \[neutral, warning, highlight, new, positive\]/
  );
});

test("missing dimensional_values key fails fast with actionable error", () => {
  const { root, files } = fixtureFiles({
    "/proj/content/design-system/model/sentiment.mdx": "---\ntitle: Sentiment\n---\nbody",
  });
  assert.throws(
    () => walkDimensionalSource(root, { readFileSync: makeFs(files).readFileSync }),
    /sentiment\.mdx has no 'dimensional_values' frontmatter key/
  );
});

test("missing model file (e.g. state.mdx) fails fast", () => {
  const { root, files } = fixtureFiles();
  delete files["/proj/content/design-system/model/state.mdx"];
  assert.throws(
    () => walkDimensionalSource(root, { readFileSync: makeFs(files).readFileSync }),
    /cannot read .*state\.mdx/
  );
});

test("migrateAndValidateComponents preserves author key order", () => {
  const vocab = {
    sentiment: ["neutral"],
    emphasis: ["high"],
    size: ["md"],
    state: ["rest"],
  };
  const raw = { z: { backgroundColor: "#000" }, a: { backgroundColor: "#FFF" } };
  const out = migrateAndValidateComponents(raw, vocab);
  assert.deepEqual(Object.keys(out), ["z", "a"]);
});
