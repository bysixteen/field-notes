# Field-notes issue triage — 2026-04-27

Triage pass on `bysixteen/field-notes` open issues. Goal: the open queue contains only work Daniel intends to do next; speculative tickets get a one-line decision recorded.

## Rubric

- **keep** — work intended in the next ~30d. Issue stays open, labels updated if drift.
- **defer** — real work, but blocked or out of horizon. Comment + `defer` label; stays open but won't surface in active queries.
- **close** — speculative, duplicate, superseded, or won't-fix. `gh issue close --comment "<reason>"`.

## Discrepancy flag

The original task said #131, #49, #104, #119, #120 were "now closed". Verified state on 2026-04-27 19:48 BST: only **#131** is closed. **#49, #104, #119, #120 remain OPEN**. They are excluded from this triage per Daniel's explicit candidate list, but flagged here so a follow-up triage can address them if intended.

Open issues in the candidate list below: 9.

## Decisions

### #27 — Explore: intent annotation pattern for Figma-to-code pipeline
- Decision: close
- Reason: Speculative exploration filed 29d ago with no comments, no follow-through, and no current consumer. Phase D custom components shipped without needing intent annotations. Reopen if a concrete consumer surfaces.
- Labels (if keep/defer): —

### #38 — Explore: designer onboarding guide for Claude Code skills
- Decision: defer
- Reason: Daniel's own reopen comment 2026-04-27 10:16 BST states "remains scoped for future consideration even though no immediate action" — textbook defer.
- Labels (if keep/defer): keep `explore:review`

### #91 — feat: bs-spec — Design System Spec Pipeline (Code → Figma documentation bridge)
- Decision: defer
- Reason: Multi-phase scope (Phase 0 doc components + Phase 1 foundations + Phase 2 components + Phase 3 evals, ~25 tasks). Natural successor to the `bs-design-md` bundle pattern that shipped via PR #116 yesterday, but not next-30d work. Revisit after the bundle pattern stabilises.
- Labels (if keep/defer): keep `enhancement`

### #98 — Adopt Terrazzo for token output pipeline
- Decision: keep
- Reason: `priority: high`, Phase 0.4. Concrete pipeline work that complements the existing `emit-tokens.mjs` flow without replacing the bespoke `generate-ramps.ts` ramp logic. Validated path forward.
- Labels (if keep/defer): —

### #101 — Create /design-review skill — multi-lens critique
- Decision: defer
- Reason: Real skill work, but explicitly depends on `_foundations/` (#100) and Variable Lock concepts that don't exist yet. Phase 1 Skill Consolidation theme; not next-30d.
- Labels (if keep/defer): keep `enhancement`, `skills`

### #102 — Convert project-squad to a Claude Code skill
- Decision: close
- Reason: 15d cold, no comments, no current pull. Refactor of an external repo (`bysixteen/project-squad`) into a skill format with no active consumer demanding it. Reopen if/when project-squad is needed in a Claude Code session and the format friction surfaces.
- Labels (if keep/defer): —

### #106 — Document Neo learnings in Claude & AI domain
- Decision: defer
- Reason: Worth keeping the breadcrumb — Neo's DESIGN-DECISIONS.md contains ~20 positions that should seed `_foundations/`. Medium priority documentation work; not next-30d.
- Labels (if keep/defer): keep `documentation`, `enhancement`

### #107 — Create reusable prompt collection
- Decision: keep
- Reason: Daniel refined scope 2026-04-26 20:03 BST after PR #116 shipped: "(1) document the bundle pattern so other skills can follow it, (2) identify which existing bs-* skills would benefit from being converted to the full bundle format." Clear next action; aligned with active work.
- Labels (if keep/defer): —

### #108 — Investigate Layout.design for compliance/audit capabilities
- Decision: close
- Reason: Pure research task, `priority: low`, 15d cold, no follow-through. Filed under "Knowledge & References" phase. Closeable as won't-do; the existing `/token-audit` and any future `/design-review` skill can decide their own evaluation patterns without an upstream investigation.
- Labels (if keep/defer): —

## Summary

| Decision | Count | Issues |
|---|---|---|
| keep | 2 | #98, #107 |
| defer | 4 | #38, #91, #101, #106 |
| close | 3 | #27, #102, #108 |

Total: 9 candidates triaged. Post-execution open queue (the 9 candidates only): 2 actively open + 4 open-with-defer = 6 visible; 3 closed.

The 4 not-actually-closed issues (#49, #104, #119, #120) remain untouched by this triage and stay open.

## Next step

Daniel reviews this doc. On approval, Phase 5.2 executes: create the `defer` label once, then run the per-issue `gh` commands per the decisions above.
