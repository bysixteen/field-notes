# Bootstrap Project Shell

> Scaffold a new project with directory structure, workspace configuration, and foundational documentation.

## Required Inputs

| Input | Type | Description |
|-------|------|-------------|
| Project Name | String | kebab-case name used for the root directory and `package.json` `name` field |
| Framework / Stack | String | Primary framework (e.g., Next.js, Vite + React, Node library) |
| Monorepo Strategy | String | Workspace tool — `npm workspaces`, `pnpm workspaces`, or single-package |

## Expected Outputs

- Scaffolded directory structure with `packages/` and `apps/` (or flat `src/` for single-package).
- Root `package.json` with workspace configuration matching the chosen strategy.
- `CLAUDE.md` at the project root with commands, structure, git, and content sections.

## Prerequisites

- Node.js ≥ 18 installed.
- Git initialised in the target directory.

## Execution Steps

1. Ask the user for Project Name, Framework / Stack, and Monorepo Strategy.
2. Create the root directory and initialise `git init` if not already a repo.
3. Scaffold the directory structure:
   - **Monorepo:** `packages/`, `apps/`, `scripts/`, `.github/`.
   - **Single-package:** `src/`, `scripts/`, `.github/`.
4. Create root `package.json`:
   - Set `name`, `private: true`, and `workspaces` array (monorepo) or standard fields (single-package).
   - Add baseline scripts: `dev`, `build`, `lint`, `test`.
5. Create `CLAUDE.md` with sections: Commands, Structure, Git (branch prefixes + Conventional Commits), and Content conventions.
6. Create a minimal `.gitignore` covering `node_modules/`, `dist/`, `out/`, and `.env`.
7. Run `npm install` (or `pnpm install`) to generate the lock file.

## Verification

- `ls` confirms expected directory structure exists.
- `cat package.json | jq .workspaces` returns the correct workspace globs (monorepo) or `jq .name` returns the project name (single-package).
- `CLAUDE.md` exists and contains all four sections.
- `git status` shows all new files as untracked, ready for initial commit.
