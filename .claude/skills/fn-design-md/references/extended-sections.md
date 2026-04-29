# Extended sections — what consumers append below `:end`

The Google `DESIGN.md` spec covers `Overview`, `Colors`, `Typography`, `Components`, and `Do's and Don'ts`. These are the boilerplate sections the emitter generates inside the marker block. The spec does **not** cover the full surface a consumer needs to brief a designer or an agent on a specific product — that surface lives in hand-authored prose appended below `<!-- fn-design-md:generated:end -->`.

This file names the prose conventions that consumers commonly add and explains why the emitter is designed to leave that space alone.

## Where consumer prose lives

```
---
<frontmatter>                <- fully derived; replaced wholesale on every emit
---

<!-- fn-design-md:generated:start -->
## Overview
## Colors
## Typography
## Components
## Do's and Don'ts
<!-- fn-design-md:generated:end -->

## <consumer-authored sections>   <- preserved verbatim across regenerates
```

Anything below `:end` is preserved on every regenerate. There is no whitelist of "allowed" section names — the emitter does not inspect the suffix.

## Common section shapes

These are not required, not enforced, and not exhaustive. Consumers pick what their product needs. The list exists so an author looking at a blank space below `:end` has a starting vocabulary.

| Section | Carries | Typical reader |
|---|---|---|
| `## Identity` | Brand archetype, voice, the one-line description of what makes the product feel like itself | Designer, marketing, agent generating new copy |
| `## Aesthetic direction` | Visual references, mood, motion sensibilities, the prose answer to "what does this look like" beyond the token values | Designer onboarding, agent generating new visuals |
| `## Surfaces` | Background hierarchy, elevation rules, where each surface token applies in a real layout | Engineer composing a new screen |
| `## Layout` | Grid commitments, container widths, breakpoints expressed as intent rather than just numbers | Engineer, design reviewer |
| `## Content fundamentals` | Tone of voice, capitalisation rules, terminology decisions, what the product calls things | Writer, agent generating new strings |
| `## Metadata` | Project metadata that needs to survive regeneration (owner, source repo, last-audited date) — the escape hatch for everything the frontmatter would otherwise carry | Tooling, audit trail |

If your product has a distinctive section that doesn't fit the above (`## Brand worldbuilding`, `## Sound and motion`, `## Accessibility commitments`), that's fine — name it whatever fits. The skill takes no position.

## Why consumer prose lives below `:end`, not in frontmatter

The YAML frontmatter is **fully derived from `tokens.json` + `components.json`**. Every key in it (`name`, `description`, `colors`, `typography`, `rounded`, `spacing`, `components`) is regenerated on every emit. There is no whitelist of "generated" vs "user-authored" keys. There is no merge strategy for unknown keys.

This is a deliberate choice. Three alternatives were considered and rejected:

1. **Whitelist generated keys, preserve everything else.** Every new key the emitter introduces becomes a breaking change for consumers — the new key gets clobbered the first time the emitter outputs it. Maintenance overhead grows with the spec.
2. **Refuse-on-unknown-key.** The emitter inspects the existing frontmatter, errors if a key isn't in its known set, forces the consumer to either remove the key or update the emitter. False-positive risk: a consumer's `metadata.audit_date` is not malicious, just out of scope.
3. **Merge: preserve existing values, fill missing keys, log conflicts.** Silent drift between the source dimensional system and what the file actually says. The whole point of the regenerate flow is that the file reflects the source — merging breaks that contract.

The chosen behaviour — replace wholesale, document the footgun — keeps the emitter simple and the contract honest. The cost is that `metadata.author = "Daniel"` placed in frontmatter will be lost on the next emit. The remedy is `## Metadata` (or any name) below `:end`.

## What lives where — quick reference

| Concern | Where it lives | Survives regenerate? |
|---|---|---|
| Token values, component variants | Frontmatter (derived) | Replaced wholesale every emit |
| Boilerplate prose (`## Overview`, `## Colors`, …) | Inside marker block | Replaced wholesale every emit |
| Brand voice, identity, aesthetic | `## Identity`, `## Aesthetic direction` below `:end` | Yes |
| Layout commitments, surface rules | `## Surfaces`, `## Layout` below `:end` | Yes |
| Project metadata (author, audit date, source repo) | `## Metadata` below `:end` | Yes |
| Hand-edited keys inside frontmatter | Frontmatter | **No — silently overwritten** |

## Project-agnostic by design

Every section heading and rationale in this file is described in terms of the kind of information it carries, not in terms of any specific product. The skill is consumed by multiple projects through their own `CLAUDE.md`; nothing in this skill should encode one consumer's house style. If you find yourself wanting to name a specific consumer's section in this file, the right move is to push that knowledge into the consumer's repo, not here.
