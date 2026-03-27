# Skills

Skill files are structured documentation that define repeatable design-system workflows. They are not executable code — they are reference documents that describe what a task does, what it needs, and how to carry it out.

## Skill File Format

Every skill file follows this structure:

```markdown
# Skill Name

> One-line description of what this skill does.

## Required Inputs

| Input | Type | Description |
|-------|------|-------------|
| ... | ... | ... |

## Expected Outputs

- What files, artefacts, or side-effects the skill produces.

## Prerequisites

- Tools, scripts, or configuration that must exist before running.

## Execution Steps

1. Step-by-step instructions for carrying out the skill.
2. Each step should be concrete and verifiable.

## Verification

How to confirm the skill completed successfully.
```

## Tiers

Skills are organised into three tiers:

| Tier | Purpose | Examples |
|------|---------|---------|
| **Bootstrap** | Scaffold new projects or subsystems | `bootstrap-project-shell`, `bootstrap-colour-architecture` |
| **Sync** | Move data between tools (Figma, code, tokens) | `sync-tokens-to-figma`, `sync-anchors-from-figma` |
| **Component** | Create or document individual components | `scaffold-new-component`, `generate-figma-documentation` |
