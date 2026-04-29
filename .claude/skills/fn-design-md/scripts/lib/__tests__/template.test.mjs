import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseTemplateYaml,
  validateTemplate,
  loadTemplate,
  sectionStartMarker,
  sectionEndMarker,
  VALID_DISPOSITIONS,
} from "../template.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, "..", "..", "..");

function withTmpFile(contents, fn) {
  const dir = mkdtempSync(join(tmpdir(), "fn-template-"));
  try {
    const p = join(dir, "tpl.yaml");
    writeFileSync(p, contents);
    return fn(p);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("parseTemplateYaml — google-spec shape", () => {
  const t = parseTemplateYaml(`profile_name: google-spec
sections:
  - id: overview
    heading: Overview
    disposition: generated
    source: overview
  - id: colors
    heading: Colors
    disposition: generated
    source: colors
`);
  assert.equal(t.profile_name, "google-spec");
  assert.equal(t.sections.length, 2);
  assert.deepEqual(t.sections[0], {
    id: "overview",
    heading: "Overview",
    disposition: "generated",
    source: "overview",
  });
});

test("parseTemplateYaml — preserved section with multi-line block scalar placeholder", () => {
  const t = parseTemplateYaml(`profile_name: dimensional-prose
sections:
  - id: identity
    heading: Identity
    disposition: preserved
    placeholder: |
      One paragraph describing what makes this product feel like itself.
      A second line for emphasis.
`);
  assert.equal(t.sections.length, 1);
  assert.equal(t.sections[0].disposition, "preserved");
  assert.match(t.sections[0].placeholder, /^One paragraph[\s\S]*emphasis\.$/);
});

test("parseTemplateYaml — quoted heading with apostrophe", () => {
  const t = parseTemplateYaml(`profile_name: x
sections:
  - id: dos-and-donts
    heading: "Do's and Don'ts"
    disposition: generated
    source: dos-and-donts
`);
  assert.equal(t.sections[0].heading, "Do's and Don'ts");
});

test("parseTemplateYaml — redactions block", () => {
  const t = parseTemplateYaml(`profile_name: x
sections:
  - id: a
    heading: A
    disposition: generated
    source: overview
redactions:
  forbidden_terms_path: forbidden.txt
`);
  assert.equal(t.redactions.forbidden_terms_path, "forbidden.txt");
});

test("validateTemplate — rejects missing profile_name", () => {
  assert.throws(
    () => validateTemplate({ sections: [{ id: "a", heading: "A", disposition: "generated", source: "overview" }] }),
    /missing required `profile_name`/
  );
});

test("validateTemplate — rejects empty sections", () => {
  assert.throws(
    () => validateTemplate({ profile_name: "x", sections: [] }),
    /sections.*non-empty/
  );
});

test("validateTemplate — rejects unknown disposition", () => {
  assert.throws(
    () =>
      validateTemplate({
        profile_name: "x",
        sections: [{ id: "a", heading: "A", disposition: "wat" }],
      }),
    /invalid disposition/
  );
});

test("validateTemplate — generated section without source throws", () => {
  assert.throws(
    () =>
      validateTemplate({
        profile_name: "x",
        sections: [{ id: "a", heading: "A", disposition: "generated" }],
      }),
    /generated but has no `source`/
  );
});

test("validateTemplate — duplicate id throws", () => {
  assert.throws(
    () =>
      validateTemplate({
        profile_name: "x",
        sections: [
          { id: "a", heading: "A", disposition: "generated", source: "overview" },
          { id: "a", heading: "B", disposition: "generated", source: "overview" },
        ],
      }),
    /duplicate section id/
  );
});

test("validateTemplate — non-kebab-case id throws", () => {
  assert.throws(
    () =>
      validateTemplate({
        profile_name: "x",
        sections: [{ id: "Overview", heading: "Overview", disposition: "generated", source: "overview" }],
      }),
    /must be kebab-case/
  );
});

test("loadTemplate resolves redaction path relative to the template file", () => {
  const yaml = `profile_name: x
sections:
  - id: a
    heading: A
    disposition: generated
    source: overview
redactions:
  forbidden_terms_path: ../forbidden.txt
`;
  withTmpFile(yaml, (p) => {
    const t = loadTemplate(p);
    assert.ok(t.redactions.forbidden_terms_path.endsWith("/forbidden.txt"));
    // Must be the parent dir relative to the template, not cwd.
    assert.notEqual(t.redactions.forbidden_terms_path, "../forbidden.txt");
  });
});

test("sectionStartMarker / sectionEndMarker produce stable strings", () => {
  assert.equal(sectionStartMarker("identity"), "<!-- fn-design-md:section:identity:start -->");
  assert.equal(sectionEndMarker("dos-and-donts"), "<!-- fn-design-md:section:dos-and-donts:end -->");
});

test("VALID_DISPOSITIONS lists the supported values", () => {
  assert.ok(VALID_DISPOSITIONS.has("generated"));
  assert.ok(VALID_DISPOSITIONS.has("preserved"));
});

test("loadTemplate — google-spec.yaml in the repo loads cleanly", () => {
  const t = loadTemplate(join(SKILL_ROOT, "references", "templates", "google-spec.yaml"));
  assert.equal(t.profile_name, "google-spec");
  assert.equal(t.sections.length, 5);
  assert.deepEqual(
    t.sections.map((s) => s.id),
    ["overview", "colors", "typography", "components", "dos-and-donts"]
  );
});

test("loadTemplate — dimensional-prose.yaml loads with the right section vocabulary", () => {
  const t = loadTemplate(join(SKILL_ROOT, "references", "templates", "dimensional-prose.yaml"));
  assert.equal(t.profile_name, "dimensional-prose");
  assert.deepEqual(
    t.sections.map((s) => s.id),
    ["identity", "type", "colour", "surfaces", "layout", "content-fundamentals", "anti-patterns"]
  );
  assert.equal(t.sections[0].disposition, "preserved");
  assert.equal(t.sections[1].disposition, "generated");
  assert.equal(t.sections[1].source, "typography");
  assert.equal(t.sections[2].source, "colors");
});
