---
name: bs-review
description: >-
  Orchestrate a full design system component review across 6 stages: component API,
  React patterns, HTML semantics, accessibility (WCAG 2.2 AA), token integrity,
  and CSS authoring. Use when reviewing a component before merge, auditing an
  existing component, or running a full quality check. Triggers on: "review this
  component", "audit", "check before merge", "full review", "run all checks".
---

# Design System Component Review

Run all 6 review stages in sequence. Each stage has a dedicated skill — this orchestrator ensures they run in the right order and produces a consolidated verdict.

## Stages

| Stage | Concern | Skill |
|-------|---------|-------|
| 0 | Component API contract | `bs-component-api` |
| 1 | React patterns (hooks, memo, key usage, RSC) | `bs-react-patterns` |
| 2 | Semantic HTML + ARIA | `bs-html` |
| 3 | WCAG 2.2 AA accessibility (scored, bracket-aware) | `bs-accessibility` |
| 4 | Token integrity (cascade, hardcoded values) | `bs-tokens` |
| 5 | CSS/SCSS authoring | `bs-css` |

## Workflow

1. Read all component files (`.tsx`, `.css`/`.scss`, `.test.tsx`, `.stories.tsx`, types)
2. Run stages 0–5 in order
3. Collect all findings across stages
4. Calculate consolidated score
5. Produce verdict

## Verdict Logic

```
NEEDS UPLIFT    — any BLOCKING finding in any stage
MINOR IMPROVEMENTS — no BLOCKING, but SERIOUS findings exist
UP TO STANDARD — no BLOCKING or SERIOUS findings
```

## Consolidated Report Template

```
═══════════════════════════════════════════════════════════════
COMPONENT REVIEW: {ComponentName}
Files: {list}
═══════════════════════════════════════════════════════════════

STAGE 0 — COMPONENT API                    {PASS|FINDINGS}
STAGE 1 — REACT PATTERNS                   {PASS|FINDINGS}
STAGE 2 — HTML SEMANTICS                   {PASS|FINDINGS}
STAGE 3 — ACCESSIBILITY (B{n})             Score: {n}/100
STAGE 4 — TOKEN INTEGRITY                  {PASS|FINDINGS}
STAGE 5 — CSS AUTHORING                    {PASS|FINDINGS}

═══════════════════════════════════════════════════════════════
VERDICT: {NEEDS UPLIFT | MINOR IMPROVEMENTS | UP TO STANDARD}

{If findings exist, list all with stage number, severity, and fix}
═══════════════════════════════════════════════════════════════
```

## After Review

Offer to:
1. Apply all fixes directly to the component files
2. Generate GitHub issues for findings that need discussion

## Reference

- [Component API](/design-system/component-api)
- [Accessibility Audit](/design-system/accessibility-audit)
- [Token Audit](/design-system/token-audit)
- [CSS Authoring Rules](/design-system/css-authoring-rules)
- [HTML Semantics](/design-system/html-semantics)
- [Testing Strategy](/design-system/testing-strategy)
