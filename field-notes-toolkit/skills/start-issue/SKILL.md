---
name: start-issue
description: Begin work on a GitHub issue in the field-notes repo. Creates a branch, plans the approach, implements changes, verifies the build, and opens a PR against main.
---

# Start Issue — Field Notes

When the user invokes `/start-issue`, follow these steps:

## 1. Understand the issue

- Read the GitHub issue (use `gh issue view <number>`).
- Summarise the goal in one sentence before writing any code.

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

- Run `npm run build` (static export to `out/`). The build must pass before opening a PR.

## 5. Open PR

- Open the PR against `main`.
- If the `/coderabbit:review` command is available, run it after creating the PR.
