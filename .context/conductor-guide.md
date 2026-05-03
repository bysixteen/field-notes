# Conductor Guide — Field Notes

How to use Conductor and the surrounding toolchain to their full extent on this project. Living document; update when tooling shifts or the workflow surfaces friction.

## Tooling inventory

| Tool | Role | Capability leveraged |
|---|---|---|
| **Conductor** | Parallel worktree manager | Independent worktrees off the same repo; independent agent sessions per worktree; review PRs from one while another is working |
| **Claude Code** | Per-worktree agent | Autonomous work-and-PR loop; full repo context per session |
| **GitHub Issues** | Canonical plan + structure | Master plan **#218** with native sub-issue wiring to phase sub-issues **#219–#223** — source of truth for architecture, scope, and success criteria |
| **GitHub PRs** | Review surface, merge gate | One PR per agent task; review before merge |
| **`gh` CLI** | Issue/PR ops from terminal | Used by Claude Code for `gh issue create`, `gh pr create`, status checks |
| **`/start-issue` skill** | Per-issue work scaffolding | Loads issue context into agent at session start |
| **`.context/` artefacts** | Cross-session memory | `spike-findings.md`, `ia-draft.md`, `cutover-runbook.md`, this file. Survives between sessions; agents read at startup |
| **pnpm workspaces** | Package isolation | Each package edits independently; workspace protocol resolves cross-package deps; `pnpm install <path>` for CLI consumer testing |
| **Biome** | Single-tool format/lint | Same root `biome.json` works in every worktree; one binary across packages |
| **vitest** | Test runner | Browser mode for lib browser-safety verification; same test config in every package |
| **Playwright** | E2E | `/studio` → CLI roundtrip in Phase 3 |
| **Terrazzo** | Token transformer | Wrapped in `lib/tokens/transform.ts`; JSON → CSS variables this iteration |
| **gray-matter, js-yaml** | DESIGN.md projection primitives | Frontmatter parse + YAML emit; methodology layer stays in-house |
| **culori** | OKLCH math | Deep-imports for bundle weight |
| **Radix UI + shadcn/ui** | `/studio` controls | Headless behaviour primitives + copy-paste starter pattern |

When a new tool enters the workflow, add a row above and note the specific capability being leveraged. Issue bodies (#218 + #219–#223) stay canonical for design decisions; this table stays canonical for tool-shape decisions.

---

## Topology — when to fork, when to converge

The plan's phases have a sequencing constraint (Phase 1 → 2 → 3 → 4) plus an interleaved Phase 5. Conductor's parallelism aligns most cleanly with the **cross-phase boundary**: code work in one worktree, KB content authoring in another. Intra-phase splitting only pays off where modules are genuinely disjoint.

### Phase 0 cutover

**Single worktree.** The cutover is mechanical surgery on the repo root — `pnpm-workspace.yaml`, root `package.json` transform, app move into `apps/docs/`. Don't parallelize. One agent, one PR, one merge.

Branch: `phase-0/cutover`. Runbook: `.context/cutover-runbook.md`.

### Phase 1 lib (#219)

**Two worktrees, cross-phase split:**

- **Worktree A** — `phase-1/lib`: builds `packages/lib/` end-to-end. Tokens, design-md, scaffold, barrel index, cross-module tests. Sequential within the worktree.
- **Worktree B** — `phase-5/<mvp-item-1>`: authors the first Phase 5 MVP item (e.g. principles index). Touches `apps/docs/content/` only.

Disjoint file scopes. PRs land independently. No conflict management needed.

### Phase 2 CLI (#220)

**Two worktrees, same cross-phase split:**

- **Worktree A** — `phase-2/cli`: builds `packages/cli/`. Imports from `packages/lib/` via workspace protocol.
- **Worktree B** — `phase-5/<mvp-item-2>`: next KB MVP item.

### Phase 3 docs + studio + IA (#221)

Cross-phase parallelism breaks here — Phase 3 touches `apps/docs/`, which Phase 5 also touches. Two options:

**Option A — pause Phase 5, fork Phase 3 internally:**

- **Worktree A1** — `phase-3/kb-port`: port and restructure `apps/docs/content/` per the IA decision. Independent of `/studio`.
- **Worktree A2** — `phase-3/studio`: build `apps/docs/app/studio/` route. Independent of KB content.
- **Worktree A3** — `phase-3/nav-and-workflow`: top-level Learn / Build nav, cross-link placeholder wiring, `.github/workflows/` update. Depends on A1 and A2 landing first.
- **Worktree B** — paused.

**Option B — defer Phase 5, run Phase 3 sequentially:**

- **Worktree A** — `phase-3/all`: Phase 3 in a single worktree, sequential.
- **Worktree B** — paused; resume after Phase 3 lands.

Pick A if A1 and A2 have natural file-level seams (likely — KB content under `content/` is disjoint from `app/studio/` route components). Pick B if managing three worktrees feels like more overhead than the parallelism win, or if the IA decision turns out to need cross-cutting changes that blur the seams.

### Phase 4 publish + dogfood (#222)

**Single worktree.** Sequential: publish lib → publish cli → publish skills → prior-art page → onboarding tour → fresh-project sim → dogfood. Each step's output feeds the next.

Branch: `phase-4/publish-and-polish`.

### Phase 5 KB curation (#223, interleaved)

**One worktree per MVP item, picked up as bandwidth allows:**

- `phase-5/principles-index`
- `phase-5/skills-catalogue`
- `phase-5/designer-onboarding`
- `phase-5/prior-art`
- `phase-5/dimensional-model`

Each is a small focused PR. Run two or three concurrently when bandwidth allows, but always one MVP item per worktree.

---

## Handoffs between worktrees

Worktrees run independently, but the work has dependencies. Two rules:

1. **A worktree owns its branch end-to-end** until the PR merges. Don't share a branch across worktrees.
2. **Pull from `main`, not from another worktree's branch.** When Worktree A's PR lands, Worktree B picks it up via `git fetch && git rebase origin/main`. If conflicts surface during rebase, resolve in B.

Concrete sequence:

- After Phase 1 lib PR lands → Worktree A switches to Phase 2 (new branch `phase-2/cli`). Phase 2 fetches `main` to pick up Phase 1's exports. Worktree B (Phase 5) can rebase if it wants the latest content shape, but doesn't need to.
- After Phase 2 CLI lands → Worktree A switches to Phase 3.
- During Phase 3 (Option A): Worktrees A1 and A2 work concurrently. A3 waits until A1 and A2 merge, then rebases off the combined `main` and wires the cross-links.

---

## PR / merge policy

- **One PR per agent task.** Each worktree opens its own PR.
- **PRs reference sub-issues**: `Closes #219` for the phase-completing PR, `Refs #221` for sub-track PRs.
- **Solo review = self-review with discipline.** Open PR → read full diff cold → squash-merge if good. The PR description plus the diff should be enough that *next-week-you* could understand the change without context-loading the original session.
- **Squash-merge.** Keeps `main` history readable; each PR collapses to one commit.
- **Conflicts get resolved in the opening worktree, not on main.** If two PRs converge on the same files, second-to-merge rebases.

---

## Conflict management

Plain rules:

- **Disjoint files**: zero conflict, zero coordination.
- **Same file, different lines**: git auto-merges.
- **Same lines**: first-to-merge wins; second rebases and resolves.

Phase-by-phase:

| Window | Worktree A scope | Worktree B scope | Conflict risk |
|---|---|---|---|
| Phase 1 | `packages/lib/` | `apps/docs/content/` | None |
| Phase 2 | `packages/cli/` | `apps/docs/content/` | None |
| Phase 3 | `apps/docs/` | `apps/docs/content/` | High — pause B or fork A internally |
| Phase 4 | Multiple | Paused | None (B paused) |

---

## When NOT to parallelize

Heuristic: only spin up a parallel worktree if all four hold:

1. **The task is at least ~1 hour of agent work.** Otherwise worktree spin-up + context load + PR setup overhead dominates.
2. **The file scope is cleanly disjoint** from any other active worktree.
3. **You have bandwidth to review multiple PRs in flight.** Solo review serializes; if you can only read one diff at a time, parallel agents just stack PRs in your queue.
4. **The task has a clear definition-of-done** the agent can verify itself before opening the PR. Otherwise the PR is half-baked and needs a back-and-forth that breaks the parallelism win.

If any is iffy, single-worktree sequential is the right call.

---

## Branch and worktree naming

Convention: `<phase>/<scope>` for both branch and Conductor worktree label.

- `phase-0/cutover`
- `phase-1/lib`
- `phase-2/cli`
- `phase-3/kb-port`, `phase-3/studio`, `phase-3/nav-and-workflow`
- `phase-4/publish-and-polish`
- `phase-5/principles-index`, `phase-5/skills-catalogue`, etc.

When a phase isn't split, the scope is the phase keyword: `phase-2/cli`. When it splits, the scope names the sub-track.

---

## Quick reference — starting a worktree

For each Conductor worktree:

1. Fork from current `main` in Conductor → name per the convention above.
2. Open the agent in the new worktree.
3. Agent reads master plan #218 + relevant phase sub-issue (#219–#223) for context.
4. Agent reads `.context/spike-findings.md`, `.context/ia-draft.md`, this file as needed.
5. Agent runs `/start-issue <issue-number>` to load the sub-issue's specific scope.
6. Agent works → opens PR → you review → merge.
7. Worktree shut down or repurposed for the next task.

---

## What this guide doesn't cover

- **Hotfixes.** If something breaks on `main` mid-Phase 3, all worktrees rebase to pick it up. Hotfix gets its own short-lived worktree (`hotfix/<thing>`), lands fast, others rebase.
- **Spike work.** Phase 0 spikes already ran. Future spikes that come up mid-execution get their own worktree (`spike/<thing>`) and don't merge to main — findings go to `.context/`.
- **Reverts.** If a merged PR turns out wrong, revert with a new PR; don't force-push `main`. The reverted state becomes the new starting point for affected worktrees.
- **External contributors.** Out of scope this iteration — primary user is the project author.
