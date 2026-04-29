# Stability triage — 2026-04-28

Triage of the 5 actively-open issues in `bysixteen/field-notes` against the goal "as stable and ready as possible before moving to Bolton Metro / Phase 3 consumer calibration." The 4 `defer`-labelled issues (#38, #91, #101, #106) are out of scope for this pass; they stay parked.

## Honest finding

None of the 5 active issues score HIGH on stability. Field-notes is already at "stable and ready" by any reasonable yardstick. The eval trio (#142, #143, #144) is polish that compounds because the affected skills run frequently; #98 (Terrazzo) is a refactor of a working pipeline, not a fix; #107 (prompt collection) is shelfware speculation. If the goal is "stable and ready before Bolton Metro / Phase 3," the answer is: you already are. The recommended work below is optional polish, not load-bearing.

## Per-issue

| # | Title | Stability | Effort | Coupling | Recommendation |
| --- | --- | --- | --- | --- | --- |
| 143 | eval: start-issue — bottom 3 from #49 baseline | LOW | SMALL | independent | **DO NEXT (bundled)** — highest leverage of the 3 eval issues; this is the primary per-session skill |
| 144 | eval: start-work — bottom 3 from #49 baseline | LOW | SMALL | independent | **DO NEXT (bundled)** — paired sibling to #143; same mechanical fix |
| 142 | eval: fn-storybook-helpers — bottom 3 from #49 baseline | LOW | SMALL | independent | **DO NEXT (bundled)** — same mechanical fix as #143/#144 |
| 98  | Adopt Terrazzo for token output pipeline | LOW¹ | LARGE | depends on a real second consumer needing DTCG features the bridge lacks | **DEFER** — refactor of a working pipeline, not a stability fix |
| 107 | Create reusable prompt collection | LOW | MEDIUM | independent; speculative | **CLOSE — won't-do** — no concrete workflow gap names a specific prompt that should exist |

¹ The "high" priority label reflects strategic importance to the token pipeline architecture, not current instability. The existing custom DTCG bridge works.

## Recommended execution order

1. **#142 + #143 + #144 — eval trio, ONE bundled PR.** Add Output / Inputs sections to each of `fn-storybook-helpers.md`, `start-issue/SKILL.md`, `start-work/SKILL.md`. SMALL across three files; closes all three issues in one coherent edit.

   Rationale: The discipline through this arc has been "don't bundle UNRELATED work." These three are the same fix shape (add Output/Inputs sections), all from #49's baseline, all polish-not-stability. Three near-identical micro-PRs is audit-trail overhead for trivial gain. Bundle. PR #161 set the precedent for "cleanup batch" PRs that close multiple related issues with one coherent edit.

2. **#98 — Terrazzo adoption.** DEFER. Re-evaluate when a real second consumer surfaces a DTCG-output need the custom bridge can't meet.

3. **#107 — Reusable prompt collection.** CLOSE — won't-do. No concrete workflow gap names a specific prompt that should exist; reopen if a real trigger surfaces.

## Items recommended to defer or close-won't-do

- **#98 — Adopt Terrazzo (DEFER, do not close).** The existing pipeline is working; the issue is a refactor of a working system, not a fix for instability. Recommend adding the `defer` label with a comment: "deferred pending a second consumer (Bolton Metro or other) requiring DTCG features the existing custom bridge doesn't provide. Phase 3 is consumer calibration; that doesn't change the token pipeline's needs."

- **#107 — Reusable prompt collection (CLOSE — won't-do).** No part of the current toolkit fails without this. The seven proposed prompts read as speculative — no caller is waiting on `create-spacing-scale.md`. Close as won't-do; reopen if a real trigger surfaces.

  Follow-up command (do NOT run as part of this triage PR; run only after this PR merges and Daniel confirms):

  ```
  gh issue close 107 --reason "not planned" --comment "Closing per stability triage 2026-04-28: speculative; no concrete workflow gap names a specific prompt that should exist. Reopen if a real trigger surfaces."
  ```

## Notes on the eval trio (#142, #143, #144)

The static rubric verdict is "Adequate" (not "Failing"), so this is polish, not a stability fix. The reason to do it anyway: start-issue and start-work run at the start of every session, so any clarity improvement compounds. Bundling rationale is in the execution order above.
