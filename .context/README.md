# .context/ — AI Context Directory

This directory stores context that AI coding agents use across sessions. Tracked files survive across worktrees and agent handoffs; ephemeral session files stay out of git.

## Contents

**Tracked (committed):**

- `INDEX.md` — Tier 2 routing map for the design system manifest.
- `README.md` — this file.
- `evals/` — skill evaluation specs (one `.md` per skill).
- Audit and planning files at the root — `architecture-*.md`, `content-audit.md`, `decision-*.md`, plus dated audit and triage notes (e.g. `phase-6-execution-contracts-2026-04-29.md`, `issue-triage-2026-04.md`, `stability-triage-2026-04-28.md`).

**Ignored (in `.gitignore`):**

- `notes.md` — scratch notes for the current session.
- `todos.md` — session-scoped task lists.
- `attachments/` — screenshots, SRT files, ZIPs, and other binary artefacts.

## Why

Conductor worktrees are ephemeral. When a worktree is archived, blanket-ignoring `.context/` would lose valuable plans and decisions. Selective ignoring preserves shared context while keeping ephemeral session data out of git.
