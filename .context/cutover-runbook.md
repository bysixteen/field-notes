# Phase 0 cutover runbook

**Master plan:** #218
**For:** the focused cutover session that closes Phase 0 and starts the GitHub Pages deploy-dark window.
**Source of truth:** master plan #218 (architecture, scope, success criteria). This runbook is the operational checklist for the cutover commit.

---

## What this commit does

Transforms the repo from "single Next.js app at root" → "pnpm workspace with `apps/docs/`":
- Root becomes a workspace-root manifest (no app deps; just workspace config + fan-out scripts).
- Existing app source moves into `apps/docs/` via `git mv`.
- `pnpm-workspace.yaml` added.
- The R1-spike-surfaced prerequisites land in `apps/docs/package.json`: `fumadocs-mdx` prebuild step + `@types/mdx` explicit devDep.
- GitHub Pages deploy goes dark from this commit until Phase 3 wires `.github/workflows/` against `apps/docs/out/`.

`packages/lib/`, `packages/cli/`, `packages/skills/` are NOT created here — those are Phase 1 / 2 / 5.

---

## Pre-flight (do before opening the editor)

- [ ] **`git status` clean.** No uncommitted Phase 0 work in flight. If `.context/spike-findings.md`, `.context/ia-draft.md`, or `.context/cutover-runbook.md` are uncommitted, commit them first as a separate "docs(plan): ..." commit so the cutover commit is purely structural.
- [ ] **Master plan #218 checklist is up to date.** All Phase 0 items checked except cutover. Sub-issues #219–#223 reference Learn/Build labels and the architecture decisions land here.
- [ ] **Snapshot the current working build.** From the live repo root: `pnpm install && pnpm build` (or `npm install && npm run build`). Confirm `out/` produces successfully. Note the page count + total size — this is the comparison point for post-cutover.
- [ ] **Decide upfront: `.github/workflows/` disposition.** Two options:
  - **Option A — disable in the cutover commit.** Comment out the `on:` triggers or add `if: false` to the deploy job, so the workflow does nothing during the dark window. Cleanest.
  - **Option B — let it fail naturally.** Workflow runs on push to main, fails because the build no longer works at root, surfaces a red badge. Loud but informational.
  - **Recommendation: A.** Quieter, no spurious red badges, easy to re-enable in Phase 3 with the new `apps/docs/out/` path. Reverse with one line in Phase 3.

---

## Mechanical steps

Order matters — keep root buildable in case you need to abort mid-way (until step 6).

1. **Create branch.** `git checkout -b phase-0-cutover` (or whatever branch convention fits — short, concrete, <30 chars).

2. **Create `apps/docs/` and move the app source.**
   ```bash
   mkdir -p apps/docs
   git mv app content lib components scripts public source.config.ts \
     next-env.d.ts next.config.mjs postcss.config.mjs tsconfig.json \
     mdx-components.tsx tokens.json DESIGN.md components.json \
     apps/docs/
   ```
   Adjust the file list against actual root contents — verify with `ls` first. Anything that's part of the live Next.js app moves; project-level docs (`README.md`, `INVENTORY.md`, `CLAUDE.md`, `ATTRIBUTION.md`, `PRISM.md`) stay at root.

3. **Move `package.json` → `apps/docs/package.json`.**
   ```bash
   git mv package.json apps/docs/package.json
   ```

4. **Apply R1 prerequisites to `apps/docs/package.json`:**
   - Rename `"name": "field-notes"` → `"name": "docs"` (or `"@field-notes/docs"` if scope is claimed).
   - Update `"build"` script: `"fumadocs-mdx && node scripts/generate-llms-txt.mjs && next build"`.
   - Add `"@types/mdx"` to `devDependencies`.

5. **Create root `package.json`.**
   ```json
   {
     "name": "field-notes-workspace",
     "private": true,
     "version": "0.0.0",
     "scripts": {
       "build": "pnpm --filter docs build",
       "dev": "pnpm --filter docs dev"
     },
     "packageManager": "pnpm@10.32.1"
   }
   ```
   Adjust `packageManager` to whatever pnpm version is installed (`pnpm --version`).

6. **Create root `pnpm-workspace.yaml`.**
   ```yaml
   packages:
     - "apps/*"
     - "packages/*"
   ```

7. **Disable GitHub Pages workflow** (per pre-flight Option A).
   - Edit `.github/workflows/<deploy>.yml` (whatever the file is named).
   - Add `if: false` to the deploy job, or comment out `on:` triggers.
   - Add a comment explaining: "Disabled during Phase 0–3 dark window. Re-enable + repath against `apps/docs/out/` in Phase 3 (#221)."

8. **Delete `package-lock.json` if present** at root or in `apps/docs/`. Switching to pnpm.

9. **Run `pnpm install`** at root.

10. **Run `pnpm build`** at root. This delegates to `pnpm --filter docs build` which runs `fumadocs-mdx && generate-llms-txt && next build`.

11. **Verify `apps/docs/out/`** exists with the expected page count and size, matching the pre-flight snapshot.

---

## Post-build verification

- [ ] `apps/docs/out/` exists and has the same page count as the pre-flight snapshot (~82 pages last seen).
- [ ] `out/` size is reasonable (~29 MB last seen — should be similar; small drift is fine).
- [ ] No errors during build.
- [ ] `git status` shows expected file moves (lots of renames into `apps/docs/`) + new root `package.json`, new `pnpm-workspace.yaml`, modified `apps/docs/package.json`, modified workflow file.
- [ ] No accidentally-committed `node_modules/`, `.next/`, `.source/`, or `out/` (verify `.gitignore` covers them).

---

## Commit message

Substantive, so a future reader sees the intentional dark window without digging:

```
chore: Phase 0 cutover — transform to pnpm workspace, move app to apps/docs/

Greenfield refactor per master plan #218. Root becomes a workspace
manifest; the existing Next.js + Fumadocs app moves into apps/docs/
as the first workspace package. packages/lib, packages/cli,
packages/skills land in Phases 1 / 2 / 5.

Includes the two R1-spike prerequisites: fumadocs-mdx prebuild step
in apps/docs/build script (generates .source/) and @types/mdx as
explicit devDependency (pnpm strict hoisting).

GitHub Pages deploy goes dark with this commit. The workflow is
disabled (if: false on deploy job) until Phase 3 (#221) wires it
against apps/docs/out/.

Spike findings: .context/spike-findings.md
IA draft: .context/ia-draft.md

Refs #218
```

---

## After cutover commit lands

- [ ] Open PR, merge to main (or push direct to main if that matches the repo's convention).
- [ ] Verify the disabled workflow doesn't run on push.
- [ ] Update master plan #218 checklist: cutover ✅.
- [ ] Update master plan #218: tick the cutover checkbox; comment with the merged commit SHA.
- [ ] Phase 1 begins next: `/start-issue #219`.

---

## Abort criteria

If at any step the build breaks in a way you don't immediately understand:

1. Don't push.
2. `git stash` or `git checkout main`.
3. Capture the failure mode (terminal output, error text) in a comment on master plan #218 or in this runbook.
4. Diagnose offline, return to the cutover with the fix prepared.

The cutover is structural surgery — better to abort and re-attempt than to push a broken state into the dark window where there's no deploy to catch issues.

---

## Notes for reading this later

- The dark window starts here. From cutover commit through Phase 3 close, `bysixteen.github.io/field-notes/` returns 404 or stale content. Acceptable; no production users.
- The R1 spike already validated that this configuration builds. The spike workspace was at `/tmp/fn-spikes/` and produced 82 pages, 196.7 kB gzipped initial JS for `/studio`, etc. This commit replicates that configuration in the live repo.
- `field-notes-toolkit/` (nested at the live repo root currently) is reference material — does NOT move into `apps/docs/`. Future Phase 5 work decides whether its content carries forward into `packages/skills/` (per the skills-content provenance bend in #223).
