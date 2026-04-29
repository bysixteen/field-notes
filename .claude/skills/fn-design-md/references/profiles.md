# Section profiles — `--template` and the per-section model

A **profile** is a YAML template that drives a `DESIGN.md` emit. It names the sections that go in the file, their headings, whether each is regenerated from tokens or hand-authored, and (optionally) a redaction list that halts the emit if forbidden terms appear in the rendered prose.

Two profiles ship with the skill:

| Template | Use when | Linter |
|---|---|---|
| `references/templates/google-spec.yaml` (default) | You want a `DESIGN.md` that the official `@google/design.md` linter accepts. Section names are spec-mandated (`Overview`, `Colors`, `Typography`, `Components`, `Do's and Don'ts`). | `scripts/lint.sh` (Google linter) |
| `references/templates/dimensional-prose.yaml` | You want a custom-vocabulary `DESIGN.md` (e.g. `Identity`, `Type`, `Colour`, `Surfaces`, `Layout`, `Content fundamentals`, `Anti-patterns`). | `scripts/lint-template.mjs` (template linter — opts out of Google linter) |

Pass a profile via `--template <path>`:

```
node scripts/emit-design-md.mjs --from-dimensional <root> --out <dir> --template references/templates/dimensional-prose.yaml
```

## Schema

```yaml
profile_name: <string>            # used in CLI summaries; not surfaced in DESIGN.md

sections:
  - id: <kebab-case identifier>   # used in section markers; STABLE — do not rename casually
    heading: <display heading>    # rendered as `## <heading>`; can use spec or custom vocabulary
    disposition: generated | preserved
    source: <renderer-id>         # required when disposition: generated
    placeholder: |                # optional; used on first emit only when disposition: preserved
      seed prose for the consumer to overwrite

redactions:                       # optional
  forbidden_terms_path: <path>    # resolved relative to the template file
```

### `disposition: generated`

The renderer identified by `source` is invoked on every emit. Output is replaced wholesale between the section's start/end markers. Hand-edits between those markers will not survive regeneration.

Available renderers (`scripts/lib/sections.mjs`):

| `source:` | Body |
|---|---|
| `overview` | Brand-agnostic intro paragraph using the consumer's name. |
| `colors` | Tally of colour tokens + sidecar pointer for OKLCH. |
| `typography` | Intent-vs-value paragraph for the typography scale. |
| `components` | Tally of components + variant naming convention. |
| `dos-and-donts` | Composition model + cascade + anti-patterns + wide-gamut subsections. |
| `anti-patterns` | Standalone anti-patterns list (subset of `dos-and-donts`). |
| `wide-gamut` | Standalone wide-gamut paragraph. |

Need a renderer that doesn't exist? Add it to `RENDERERS` in `sections.mjs`, write a test, document it here.

### `disposition: preserved`

Content between the section's start/end markers is **kept verbatim** across regenerates. On the first emit (or if the markers don't yet exist in the file), the section's `placeholder` is inserted as the body — that is the only point at which the emitter writes prose into a preserved section.

Use preserved sections for prose that depends on judgement and shouldn't be regenerated from tokens — brand identity, layout commitments, anti-patterns, content style.

If a preserved section's body matches the placeholder exactly, the emitter still considers it user-authored — there is no special-case "this looks like the seed, treat it as fresh". The contract is simply "everything between the per-section markers belongs to the consumer".

## Redaction (`forbidden_terms_path`)

Used to enforce rules like "never leak inspiration-source names into the public `DESIGN.md`". Path is resolved relative to the template file unless absolute.

Format of the forbidden-terms file:

```
# comments and blank lines ignored
PlainSubstring         # case-insensitive substring match
regex:/pattern/flags   # JavaScript regex; the matched substring is reported as the term
```

Behaviour: emit halts on the **first** section with any hit. Halting is the safer choice — silent stripping would be re-introduced by the next regen and quietly drift. The error names the term, the section, the line, and the column so the author can fix the underlying source (token comments, contract sidecars, model MDX, prose template) and re-run.

The same redaction list runs again under `lint-template.mjs`, so checked-in `DESIGN.md` files are validated before review.

## Linter trade-off

The default Google linter mandates spec-canonical section names and orderings. Custom-vocabulary profiles like `dimensional-prose` will fail it. Use `scripts/lint-template.mjs` for those — it validates:

1. Frontmatter delimiter on line 1.
2. Each template section appears, in template order, with matching markers and the right `## heading`.
3. No foreign sections interleaved.
4. Redaction pass (when configured).

It does **not** validate token cross-references or accessibility heuristics — those are spec features. If you want both, run the Google linter against the default profile elsewhere in CI; the templates are parallel artefacts.

## Backward compatibility

The legacy single-block markers (`<!-- fn-design-md:generated:start -->` / `<!-- fn-design-md:generated:end -->`) from earlier versions are still recognised on read. The first emit against a legacy file rewrites it to per-section markers and preserves any prose that lived below `:end` as a one-shot suffix. After that, the file is in the new shape and the legacy markers don't reappear.

## Authoring a new profile

1. Copy `references/templates/google-spec.yaml` or `references/templates/dimensional-prose.yaml` into your consumer repo.
2. Decide the section ordering and which sections are generated vs preserved.
3. For each generated section, point `source` at one of the registered renderers.
4. For each preserved section, optionally add a `placeholder` to seed first-emit prose.
5. (Optional) Commit a forbidden-terms list and reference it via `redactions.forbidden_terms_path`.
6. Run `emit-design-md.mjs --template <your-template>.yaml` and lint with `lint-template.mjs`.
7. Wire both into your repo's manifest script (cf. this repo's `scripts/generate-manifest.mjs`).
