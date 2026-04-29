import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseForbiddenTermsText,
  scanForbidden,
  formatHalt,
} from "../redact.mjs";

test("parseForbiddenTermsText — substring + regex + comments + blanks", () => {
  const text = `# blocklist
InspirationCorp
ReferenceSite

# regex form
regex:/Mid-?CenturyMod/i
`;
  const terms = parseForbiddenTermsText(text);
  assert.equal(terms.length, 3);
  assert.deepEqual(terms[0], { kind: "substring", term: "InspirationCorp" });
  assert.deepEqual(terms[1], { kind: "substring", term: "ReferenceSite" });
  assert.equal(terms[2].kind, "regex");
  assert.equal(terms[2].source, "Mid-?CenturyMod");
  assert.equal(terms[2].flags, "i");
});

test("scanForbidden — substring match is case-insensitive and reports line + column", () => {
  const haystack = "## Identity\n\nWe were inspired by inspirationcorp's worldbuilding.\n";
  const hits = scanForbidden(haystack, [{ kind: "substring", term: "InspirationCorp" }]);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].line, 3);
  assert.equal(hits[0].kind, "substring");
});

test("scanForbidden — regex match returns the matched substring as the term", () => {
  const haystack = "Inspired by Mid-CenturyMod motifs.";
  const hits = scanForbidden(haystack, [
    { kind: "regex", source: "Mid-?CenturyMod", flags: "" },
  ]);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].term, "Mid-CenturyMod");
});

test("scanForbidden — multiple occurrences all reported", () => {
  const haystack = "InspirationCorp once. InspirationCorp twice.";
  const hits = scanForbidden(haystack, [{ kind: "substring", term: "InspirationCorp" }]);
  assert.equal(hits.length, 2);
});

test("scanForbidden — no match returns empty array", () => {
  const hits = scanForbidden("Clean prose.", [{ kind: "substring", term: "InspirationCorp" }]);
  assert.equal(hits.length, 0);
});

test("formatHalt — single hit produces a useful, copy-pasteable error", () => {
  const msg = formatHalt({
    sectionId: "identity",
    hits: [{ term: "InspirationCorp", line: 3, column: 18, kind: "substring" }],
  });
  assert.match(msg, /forbidden term found in section "identity"/);
  assert.match(msg, /InspirationCorp.*line 3.*column 18/);
  assert.match(msg, /Edit the underlying source/);
});

test("formatHalt — multiple hits pluralised", () => {
  const msg = formatHalt({
    sectionId: "identity",
    hits: [
      { term: "A", line: 1, column: 1, kind: "substring" },
      { term: "B", line: 2, column: 1, kind: "substring" },
    ],
  });
  assert.match(msg, /forbidden terms found/);
});
