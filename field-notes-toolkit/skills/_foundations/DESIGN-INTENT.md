# Design Intent — foundations

Some projects ship a `DESIGN.md` (Google design.md spec) that captures the project's stated intent — brand voice, sentiment vocabulary, component inventory, do's and don'ts. When it exists, **every skill reads it before applying its specialist lens**. The project's stated intent overrides general defaults from the other foundation files.

Canonical source: [`fn-design-md/SKILL.md`](../fn-design-md/SKILL.md). That skill generates and validates `DESIGN.md`. This file describes how other skills consume it.

## Where to look for DESIGN.md

In order of precedence:

1. `<project-root>/DESIGN.md` — primary location.
2. `<project-root>/design/DESIGN.md` or `<project-root>/docs/DESIGN.md` — common alternates.
3. `<project-root>/tokens.json` — DTCG sidecar; canonical for OKLCH and dimensional structure when DESIGN.md and the sidecar disagree.

If none of these exist, the project has no captured intent. Fall back to the general defaults in [DIMENSIONAL-MODEL](DIMENSIONAL-MODEL.md) and [TOKEN-ARCHITECTURE](TOKEN-ARCHITECTURE.md).

## What a skill should read first

When a `DESIGN.md` is present, read these sections before starting work:

| Section | Why it matters |
|---|---|
| YAML frontmatter (`colors`, `typography`, `spacing`, `rounded`, `components`) | Defines the available token surface — anything outside this set is a custom invention. |
| `## Overview` prose | Brand voice + visual character. Required reading for tone-sensitive output. |
| `## Colors` prose | Sentiment intent — which palette is `warning`, which is `highlight`, etc. Don't infer from hex values. |
| `## Components` prose | When/how to use each primitive. |
| `## Do's and Don'ts` | Carrier for dimensional rules the schema can't encode. Highest-signal section for skill audits. |

## Two files, one truth

`DESIGN.md` is the **agent-facing context document** (hex sRGB only, flat variant names like `button-primary-hover`).

`tokens.json` is the **tooling-facing source of truth** (OKLCH preserved, dimensional combinations preserved).

When they disagree, `tokens.json` wins. If a skill needs precise colour values for contrast checks or wide-gamut rendering, it reads from `tokens.json`. For everything else, `DESIGN.md` is enough.

## Behaviour when absent

If the project has no `DESIGN.md`:

- A skill must not invent one mid-task. Producing a `DESIGN.md` is the job of `fn-design-md`.
- The skill applies general dimensional defaults from this directory.
- The skill notes the absence in any output that depends on intent (e.g., a component review that can't check sentiment alignment because no sentiment vocabulary is captured).

## Behaviour on conflict

If `DESIGN.md` and a foundation file conflict (e.g., the project pins `highlight` to a different hex than the foundation's example), the project wins. Foundations describe defaults; the project describes its specific instance.

If `DESIGN.md` is internally inconsistent or fails its own linter, surface that to the user before continuing — don't paper over it.
