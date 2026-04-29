# Quality Gates — foundations

Every audit-style skill (`fn-component-api`, `fn-react-patterns`, `fn-html`, `fn-accessibility`, `fn-tokens`, `fn-css`, and the `fn-review` orchestrator) emits findings using the same severity model and the same output schema. This file defines both.

Canonical source: [`fn-review.md`](../fn-review.md). This file summarises the parts every skill needs to share.

## Severity model

| Severity | Meaning | Effect on merge |
|---|---|---|
| **BLOCKING** | Breaks a non-negotiable contract — cascade integrity, accessibility critical rules, API conventions that downstream consumers rely on | Merge blocked |
| **SERIOUS** | Significant deviation from convention or known-good patterns; production impact likely | Merge at discretion, fix soon |
| **MODERATE** | Style or polish issue; no functional impact | Fix when convenient |

A finding is **BLOCKING** when:

- It breaks the [color cascade](TOKEN-ARCHITECTURE.md#color-cascade).
- It violates an accessibility rule classified CRITICAL (A01–A05, A18–A21).
- It uses a boolean dimension input (e.g., `isPrimary` instead of `emphasis="high"`).
- It hardcodes a value that should be a token.
- It removes a focus indicator without replacement.
- The root HTML element is wrong for the component's role (e.g., `<div>` for a button).

## Verdict logic

Aggregate severity counts across all stages, then:

| Verdict | Condition |
|---|---|
| **NEEDS UPLIFT** | Any BLOCKING finding in any stage |
| **MINOR IMPROVEMENTS** | No BLOCKING; one or more SERIOUS |
| **UP TO STANDARD** | No BLOCKING and no SERIOUS |

Verdict drives merge action. `fn-review` produces the final consolidated verdict; individual skills report counts only.

## Findings schema

Every audit skill emits findings in this exact shape. The `fn-review` orchestrator consumes the schema directly — there is one contract, not one per skill.

```
## Findings

### [BLOCKING] <one-line title — what's wrong, not why>
- Where:  <file:line  |  component/dimension>
- Issue:  <one sentence stating the violation>
- Fix:    <one sentence with the concrete change — current vs. desired>
- Rule:   <foundation rule violated, e.g. "TOKEN-ARCHITECTURE §cascade", "DIMENSIONAL-MODEL §vocabulary">

### [SERIOUS] <title>
- Where:  ...
- Issue:  ...
- Fix:    ...
- Rule:   ...
```

Rules:

- One finding per `###` block. Don't bundle multiple violations into one entry.
- Severity tag at the start of the title, in square brackets, uppercase.
- All four bullet keys present. If unknown, write `n/a` rather than omit.
- `Rule:` cites a specific section in this directory or in a project-specific spec. Skills that audit against project-specific rules (e.g., a project DESIGN.md) cite that file.

### Calibration — too terse

```
[BLOCKING] Boolean props found. Fix them.
```

Missing `Where`, `Issue`, `Fix`, `Rule`. Cannot be acted on.

### Calibration — too verbose

```
[BLOCKING] In the Button component, which is a Tier 1 interactive element commonly
used across many contexts including primary actions, secondary actions, and
destructive actions, we found that the prop `isPrimary` uses a boolean pattern
which is problematic because...
```

Padding prose. Move context to the surrounding skill output, not the finding.

### Calibration — just right

```
### [BLOCKING] isPrimary is a boolean dimension input
- Where:  Button.tsx:12
- Issue:  Booleans cannot encode three emphasis levels; consumers cannot reach `medium`.
- Fix:    Replace `isPrimary?: boolean` with `emphasis?: 'high' | 'medium' | 'low'` (default `'medium'`).
- Rule:   DIMENSIONAL-MODEL §vocabulary
```

## Consolidating findings across stages

When the same root cause appears in multiple stages (e.g., `outline: none` violates both CSS non-negotiable #4 and accessibility rule A06), report it in each stage with a cross-reference. Count it once in the severity totals; fix it once.

## When 15+ findings appear

Sort by:

1. Blast radius — findings that affect every instance of the component first.
2. Severity — BLOCKING before SERIOUS before MODERATE.
3. Stage order — earlier-stage fixes often unblock later ones.

Group and consolidate; never list 15 equally-weighted findings.
