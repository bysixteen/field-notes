# .context/ — AI Context Directory

This directory stores context that AI coding agents use across sessions. It follows a three-tier model for what gets tracked in git vs ignored.

## Tiers

| Tier | What | Tracked in git? | Examples |
|------|------|-----------------|----------|
| 1 — Shared persistent | Plans, rules, design decisions | Yes | `plans/`, `rules/`, `README.md` |
| 2 — Living docs | Active work-in-progress plans | Yes | `plans/current-sprint.md` |
| 3 — Ephemeral | Session notes, todos, binary attachments | No | `notes.md`, `todos.md`, `attachments/` |

## What goes where

**Tracked (committed):**
- `plans/` — implementation plans that survive across worktrees and agent sessions
- `rules/` — project-specific rules and conventions for agents
- `README.md` — this file

**Ignored (in `.gitignore`):**
- `notes.md` — scratch notes for the current session
- `todos.md` — session-scoped task lists
- `attachments/` — screenshots, SRT files, ZIPs, and other binary artefacts

## Why

Conductor worktrees are ephemeral. When a worktree is archived, blanket-ignoring `.context/` loses valuable plans and decisions. Selective ignoring preserves shared context while keeping ephemeral session data out of git.
