# IA draft — Learn / Build (with alternatives steel-manned)

**Date:** 2026-05-03
**Master plan:** #218
**Status:** Phase 0 deliverable. **Starting point, not freeze** — IA can revise during Phase 3 porting if problems surface (per master plan).

This document captures three artefacts:
1. Nav-bar label decision (with alternatives steel-manned).
2. Home page wireframe.
3. Cross-link slot inventory — placeholder slots Phase 3 wires, Phase 5 fills.

---

## 1. Nav-bar labels

### Decision: **"Learn" / "Build"**

Two verbs, audience-aligned (`Designer learning` / `Designer doing`). Short. Scannable in a top nav. Avoids overlap with the existing `principles` content domain (which would happen if "Principles" became the Read-mode label).

### Steel-manned alternatives

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Read / Start** | Plainest; matches the brief's working titles; "Start" suggests beginning a project. | Generic. "Read" is passive — doesn't convey value beyond "consume content." | Working titles, not final. |
| **Learn / Build** ✓ | Verb-shaped, audience-aligned, scannable, no domain-name conflict. | "Learn" risks reading course-y if the Read-mode content tilts academic. Tone-checked at Phase 3. | **Picked.** |
| **Methods / Studio** | Content-name-forward; "Methods" describes what the Read mode actually contains. | "Methods" is dry; less inviting for a cold designer landing. | Reasonable fallback if "Learn" reads wrong. |
| **Docs / Studio** | Pragmatic; convention-familiar for developers. | "Docs" undersells the Read mode — it's a knowledge base, not API reference. Codes the audience as developer-first. | Off-direction (audience is designer-first). |
| **Field Guide / Studio** | Plays on the project name; characteristically named (parallel to "Studio"). | Cute risk; less scannable; "Field Guide" is two words. | Skip; cleverness over clarity. |
| **Knowledge / Tool** | Formal, accurate. | Cold; doesn't invite. | Skip. |
| **Reference / Studio** | Reference-doc convention. | "Reference" implies "look-up," not "read-through." Read-mode is more journey-shaped. | Skip. |

### Tone-check during Phase 3

When the home page comes together with copy, re-read with "Learn / Build" labels. If the Read mode tilts academic and "Learn" reads course-y, fall back to **"Methods / Studio"**. If neither feels right, the working titles "Read / Start" survive as final-fallback-fallback.

---

## 2. Home page wireframe

Single-page entry. Cold visitor identifies both modes within one click (success criterion #1).

```
┌─────────────────────────────────────────────────────────────────────┐
│  Field Notes                              Learn   Build   GitHub →  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                                                                     │
│                       FIELD NOTES                                   │
│                                                                     │
│         A code-first design system toolkit for designers            │
│         who scaffold their own systems.                             │
│                                                                     │
│                                                                     │
│   ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│   │                             │  │                             │  │
│   │  Learn                      │  │  Build                      │  │
│   │  ─────                      │  │  ─────                      │  │
│   │                             │  │                             │  │
│   │  Read the methodology.      │  │  Scaffold a clean-slate     │  │
│   │  Principles, dimensional    │  │  project with /studio +     │  │
│   │  model, skills catalogue,   │  │  the CLI. Pick anchors,     │  │
│   │  prior-art.                 │  │  copy a command, run it.    │  │
│   │                             │  │                             │  │
│   │  →                          │  │  →                          │  │
│   │                             │  │                             │  │
│   └─────────────────────────────┘  └─────────────────────────────┘  │
│                                                                     │
│                                                                     │
│   For designers, design engineers, and Claude Code agents.          │
│   Built greenfield. Code-first because CSS is durable.              │
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Notes on the wireframe

- **Two equally-weighted cards.** Not "main + sidebar." Both modes are first-class per the brief's "two products, neither subordinate" framing.
- **Tagline** captures the unique angle: "code-first design system toolkit for designers who scaffold their own systems." Distinguishes from token tools (Token Lab) and from designer-first tools that hide the code (Figma plugins).
- **Card subtitles** sketch the Read content (Principles / dimensional model / skills / prior-art) and the Build flow (anchors → copy command → run). Concrete, not abstract.
- **Audience footer** names the three audiences from the brief: designers, design engineers, Claude Code agents. "Built greenfield. Code-first because CSS is durable." reinforces the project's stance in one sentence.
- No carousel, no marketing-page tricks. One screen, scannable, two CTAs.

### Card behavior

- `Learn` card → routes to `/learn` (the Learn mode landing). Shows curated principles index + skills catalogue index + prior-art teaser.
- `Build` card → routes to `/studio`. Direct to the tool.

---

## 3. Cross-link slot inventory

Phase 3 wires these as **placeholders**. Phase 5 fills them with actual cross-links once both Read content and `/studio` controls exist.

### From `/studio` controls → Read content

Each studio control ships with a small "Why this?" link that routes to a Read-mode principle.

| Studio control | Linked Read content | Slot ID |
|---|---|---|
| Anchor color picker (hex input) | Why hex-input not OKLCH-direct? Why OKLCH under the hood? | `studio.anchors → learn/why-oklch` |
| Starter ramp picker (Radix Colors) | Starter ramps explained. When to drift, when to stay. | `studio.starter-ramps → learn/starter-ramps` |
| Dimension picker — sentiment | Sentiment dimension overview. | `studio.dim.sentiment → learn/dimensional/sentiment` |
| Dimension picker — emphasis | Emphasis dimension overview. | `studio.dim.emphasis → learn/dimensional/emphasis` |
| Dimension picker — state | State dimension overview. | `studio.dim.state → learn/dimensional/state` |
| Dimension picker — size | Size dimension overview. | `studio.dim.size → learn/dimensional/size` |
| Dimension picker — structure | Structure dimension overview. | `studio.dim.structure → learn/dimensional/structure` |
| Contrast badges (WCAG 2 + WCAG 3 draft) | Contrast methodology, WCAG 3 vs APCA call. | `studio.contrast → learn/contrast` |
| Ramp preview (12-step OKLCH) | Why 12 steps? Why OKLCH, not HSL? Bell-curve chroma rationale. | `studio.ramp → learn/ramps` |
| Component preview | Component API methodology. Why these 5 primitives. | `studio.components → learn/component-api` |
| Copy-CLI-command export | Why CLI scaffold, not zip download. Code-first rationale. | `studio.export → learn/code-first` |

### From Read content → `/studio` controls

Each principle / Read-mode page ships with a "See it in /studio" call-out where applicable.

| Read content | Linked studio surface | Slot ID |
|---|---|---|
| OKLCH principle | `/studio` anchors form | `learn/why-oklch → studio.anchors` |
| Dimensional model overview | `/studio` dimension pickers | `learn/dimensional → studio.dim.*` |
| Component API principle | `/studio` component preview | `learn/component-api → studio.components` |
| Contrast methodology | `/studio` contrast badges | `learn/contrast → studio.contrast` |
| Code-first principle | `/studio` export action | `learn/code-first → studio.export` |
| Skills catalogue (per skill) | Relevant studio surface or CLI command | `learn/skills/<skill> → studio.<surface>` |
| Prior-art page (per third-party / criteria-flip item) | Relevant studio surface | `learn/prior-art#<item> → studio.<surface>` |

### Across Learn content (within Learn mode)

Cross-links inside the Learn mode itself — not slots that touch /studio, but worth listing so Phase 5 doesn't miss them.

| From | To |
|---|---|
| Principles index | Each principle page |
| Each principle page | Related principles (back-references) |
| Skills catalogue index | Each skill page (with plugin-vs-npm consumption marker) |
| Designer onboarding guide (#38) | Principles index + skills catalogue + studio |
| Prior-art page | Per-third-party criteria-flip notes |

---

## What this leaves for Phase 3

- Wire the home page per the wireframe with `Learn` / `Build` cards routing to `/learn` and `/studio`.
- Wire the top-nav with the labels.
- Wire the cross-link **slots as placeholders** — empty `<CrossLink slot="studio.anchors → learn/why-oklch">` components or similar pattern. Phase 5 fills them.
- IA can revise during Phase 3 if porting reveals problems. Specifically: tone-check `Learn / Build` against actual Read-mode content; fall back to `Methods / Studio` if "Learn" reads course-y.

## What this leaves for Phase 5

- Fill every slot in the inventory with actual `href`/anchor links.
- Curate the Read content per the 5 MVP items (principles index, skills catalogue, designer onboarding, prior-art, dimensional model overview).
- Verify the cross-link inventory has no orphans — every studio control has a matching learn slot, every learn page has a matching studio link where applicable.
