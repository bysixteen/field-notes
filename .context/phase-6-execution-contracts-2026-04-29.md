# Phase 6 — Execution rules (an optional per-component sidecar section)

A self-contained plan for adding an *execution-rules* layer to field-notes. The layer is now expressed as an **optional `## Execution rules` section** in the per-component contract sidecar (`<Component>.contract.md`), added per-component when real drift surfaces. There is no foundation-defaults file, and no `behaviorContract` field embedded in `components.json`. Read alongside `ROADMAP.md`, `INVENTORY.md`, and `ARCHITECTURE.md`.

> **Aligned 2026-04-29.** Supersedes the earlier "foundation defaults + embedded `behaviorContract`" shape, which did not survive contact with the canonical sidecar schema in #166 (`content/design-system/tools/component-schema.mdx`).

---

## TL;DR

Today's pipeline (tokens → DESIGN.md → per-component contract sidecar → component code) defines style, intent, and per-component contract. *Behavioural execution* — hover layout effects, focus mechanisms, padding compensation, layout-shift forbidden — remains implicit unless a specific component needs to pin it down.

This plan keeps the execution-rules **vocabulary** available (`layoutEffect`, `allowedMechanisms`, `forbiddenMechanisms`, `paddingCompensation`, `interactivity`, `widthBehaviour`, `heightBehaviour`, `forbiddenSideEffects`, `guarantees`) so that when a real drift case surfaces in review, the relevant component's `<Component>.contract.md` gains a `## Execution rules` section that names the constraint.

Outcome: drift gets caught at the component that produced it, without a speculative foundation schema. Scaffold-time and lint-time enforcement can be layered on later, per-component, once 2+ components carry the section and the repetition justifies the tooling.

---

## Trigger — when to add `## Execution rules` to a component

Do **not** preemptively add the section. Add it only when at least one of these conditions is true for that specific component:

1. **A real drift case surfaced in review or production** that the section would have prevented (e.g. button grew on hover; focus ring not honoured consistently; disabled state still received pointer events).
2. **A second consumer beyond lanefour** has signalled they need execution-level guarantees on that component (a real ask, not a hypothetical).
3. **A CI failure** in a Storybook regression test that an execution-rules constraint would have caught at scaffold time.
4. **Phase 5 triage** explicitly elevates this for that component after reviewing the surfaced drift evidence.

If none of those is true, leave the section off. The cost of adding speculative rules is real; the cost of waiting is small.

---

## What "execution rules" actually means — concrete vocabulary

A worked example for button hover/focus/disabled, expressed as the optional `## Execution rules` section template a per-component sidecar would carry:

```yaml
states:
  hover:
    layoutEffect: non-layout
    allowedMechanisms: [inset-box-shadow, ring-utility, opacity-shift]
    forbiddenMechanisms: [border-width-change, padding-change, margin-change]
    paddingCompensation: false
  focus:
    layoutEffect: non-layout
    allowedMechanisms: [focus-ring, outline]
    forbiddenMechanisms: [border-width-change]
  disabled:
    interactivity: false
    ariaDisabled: true
    pointerEvents: none
    cursorPolicy: not-allowed
layout:
  widthBehaviour: hug-content       # hug-content | fixed | grow
  heightBehaviour: fixed
  verticalRhythmHonoured: true
constraints:
  forbiddenSideEffects: [layout-shift]
  guarantees: [no-cls-on-hover, focus-visible-on-keyboard-only]
```

The full vocabulary is the union of fields above. A component's section uses **only the subset relevant to the drift case it captures** — most components will not need every state, every layout field, or every constraint.

**Foundation-level defaults stay parked** until ≥2 component contracts carry this section. Once the pattern repeats, the case for extracting a foundation file (`_foundations/EXECUTION-RULES-DEFAULTS.md`) becomes evidential rather than speculative — and the schema is then designed against the real drift evidence rather than imagined cases.

**Per-component overrides** are the only authoring surface today. The component's `## Execution rules` block is hand-authored when the trigger fires.

**Validation** can be layered on later. Scaffold-time and lint-time enforcement against the rules block is plausible once the section exists for ≥2 components — until then, enforcement is human review.

---

## Files to change (when a trigger fires)

When a single component's `## Execution rules` section earns its keep, the work is small and confined:

```
<Component>.contract.md     ← EDIT — add `## Execution rules` section per the schema in component-schema.mdx
```

That's the entire surface. No foundation file. No JSON sibling. No `components.json` schema change. The canonical schema lives in `content/design-system/tools/component-schema.mdx`; the section template above provides the worked example.

When ≥2 components carry the section and we choose to extract foundation defaults, *that* PR adds a foundation file and updates the relevant scaffold/lint skills — but only then.

---

## Sequencing — single, per-component path

The earlier draft sequenced this as three small PRs (foundation defaults → seed-component overrides → consumer skill updates). That sequencing assumed a foundation-first shape; the current shape inverts it.

**Today's path:**

```
Prompt: A real drift case has surfaced for <Component> in review or
production. Add a `## Execution rules` section to <Component>.contract.md
naming the constraint that would have prevented the drift, using the
vocabulary subset relevant to this case (states / layout / constraints).
Reference this document for the vocabulary and the component-schema.mdx
for the section's place in the contract.

Do NOT touch components.json. Do NOT create a foundation file. Do NOT
update bs-component-scaffold or bs-css yet — those become possible after
≥2 components carry the section and the repetition justifies enforcement.

PR title: docs(<component>): add execution rules for <drift case>
```

**Re-evaluate sequencing once the trigger fires twice.** When 2+ components carry `## Execution rules`, the next questions become:

- Does the overlap between the two sections justify a foundation defaults file?
- Does scaffold-time enforcement (e.g. `fn-component-scaffold` reading the section to pick mechanisms) earn its keep?
- Does a lint/audit pass (e.g. a `fn-css` extension flagging code that violates the section) earn its keep?

These questions get answered against real drift evidence, not imagined drift.

---

## What this does NOT do

- **Does not replace tokens, DESIGN.md, or the contract sidecar.** It extends per-component sidecars with an optional section. Tokens still describe values; DESIGN.md still describes the system; the contract sidecar still describes the component's API and intent.
- **Does not invent new mechanisms.** Allowed/forbidden lists reference patterns that already exist in CSS (inset box-shadow, focus-ring, etc.). No new rendering primitives.
- **Does not touch the dimensional model.** Sentiment × Emphasis × Size × Structure × State stays as-is. Rules operate on top.
- **Does not add a foundation defaults file.** Until ≥2 components warrant extraction, defaults stay implicit.
- **Does not embed `behaviorContract` in `components.json`.** Execution rules are a per-component sidecar concern, not a centralised manifest field.
- **Does not modify the Fumadocs site content** in this phase. The canonical sidecar schema in `component-schema.mdx` already references the deferred section.

---

## Acceptance criteria

The plan succeeds when:

- [ ] The vocabulary in this document remains a valid section template a per-component sidecar can adopt.
- [ ] `content/design-system/tools/component-schema.mdx` documents `## Execution rules` as a deferred section with a trigger condition (already done via #174).
- [ ] When the first drift case surfaces, the corresponding `<Component>.contract.md` carries a hand-authored `## Execution rules` section that names the constraint and would have caught the drift.
- [ ] Foundation-defaults extraction is re-evaluated only after ≥2 components carry the section.

---

## Why park foundation extraction rather than build it now

Three reasons:

1. **No real consumer needs it yet.** Lanefour has tokens-and-prose. It hasn't yet hit a drift case in production code that an execution-rules section would have caught. Building foundation defaults ahead of need leads to over-engineered schema.
2. **Phase 1–5 already get the toolkit to "ready".** The roadmap closes the value-and-intent layer. Execution rules are the *behavioural* layer, which is one rung up. Don't add a rung before the existing rungs are solid.
3. **The trigger condition is real drift.** Phase 3 calibration (the three-references exercise) is where drift cases surface. Wait for those examples; design any foundation defaults *against* them rather than speculatively.

If tempted to skip the wait and build foundation defaults now: don't. The cost is a 2–3 PR sequence built against imagined drift, which gets rewritten when real drift surfaces. The cost of waiting is roughly zero — the layer doesn't block anything in flight.

---

## What to do with this file today

Nothing structural. Leave foundation extraction parked. When a drift case surfaces, return to this file for the vocabulary and add a `## Execution rules` section to that component's contract sidecar.

If a second consumer beyond lanefour signals an execution-rules need before any drift surfaces internally, treat that as a trigger and follow the same per-component path.

---

## Provenance

- Aligned 2026-04-29 with #166 (component-schema.mdx) and #172 (architecture review)
- Receivers: design-system maintainers (decision authority on triggers); Claude Code (execution when greenlit per-component)
- Status: vocabulary documented; foundation extraction parked behind ≥2 drift cases

---

## Trigger evaluation log

- 2026-04-28: STAY PARKED. 0/4 triggers met (Phase 3 not run; only one consumer; no CI failures; Phase 5 triage didn't elevate). Re-evaluate after Phase 3 calibration produces drift evidence.
- 2026-04-29: STAY PARKED. Reframed from foundation-first to per-component-first, aligned with #166. No drift cases surfaced; no per-component sections added.
