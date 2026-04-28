---
name: start-work
description: Start a working session in the field-notes repo. Writes a work brief, creates a branch, and sets up the session for implementation without opening a PR.
---

# Start Work — Field Notes

When the user invokes `/start-work`, follow these steps:

## 1. Write a work brief

- Create `.context/work-brief.md` with three sections: **What**, **Why**, and **Scope**.
- Keep each section to 1–3 sentences.

## 2. Branch

- Create a branch from `main` using one of these prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`.
- Do **not** use `feature/` or `prototype/`.

## 3. Implement

- Follow Conventional Commits: `type(scope): description`.
- Use `npm` for all tooling (no yarn, no pnpm).
- For content changes:
  - MDX files go in `content/{domain}/`, lowercase kebab-case.
  - Every MDX file needs frontmatter with `title` and `description`.
  - Add the filename (without `.mdx` extension) to the directory's `meta.json`.
  - Cross-domain links use absolute paths (e.g., `/principles/answer-first`).
  - All content must be project-agnostic.
  - Run `npm run generate:llms` after any content change.

## 4. Verify

- Run `npm run build` (static export to `out/`). The build must pass.

## 5. No PR

- Do **not** open a pull request. The user will open it manually once coding is complete.
