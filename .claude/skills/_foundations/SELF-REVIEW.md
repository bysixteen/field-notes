# SELF-REVIEW protocol

Run as the final step of every skill, before declaring output done. Catches the failure mode where a skill delivers something plausible but mismatched against the actual ask.

## The four steps

1. **Re-read the brief.** Confirm what was actually asked, not what's convenient to deliver.
2. **List assumptions made.** Each unstated decision the skill made on the user's behalf — file layout, naming, scope, defaults.
3. **List what wasn't checked.** Gaps in verification (e.g. "didn't run the linter against the output", "didn't confirm the file path matched the user's actual layout", "didn't test the round-trip").
4. **Gate on green-light.** State explicitly either "ready to declare done" or "halt and surface" with a one-line reason. No third option.

Keep it short. Three to five lines per step is enough.

## Worked example (hypothetical `bs-component-scaffold` output)

> **Brief:** scaffold a `Button` component for a consumer project.
> **Assumptions:** React + CSS modules per repo convention; placed in `src/components/button/`; default variant `primary`; no Storybook story (out of scope per brief).
> **Not checked:** didn't run `bs-accessibility` against the scaffold; didn't verify the import path resolves in the consumer app; didn't confirm `button` isn't already taken in the components directory.
> **Gate:** ready to declare done — user can run `bs-accessibility` and confirm the directory is free before importing.

## When to halt instead

- A listed assumption contradicts something explicit in the brief.
- A "not checked" item is load-bearing (e.g. the path the skill wrote to may not exist; the linter the skill skipped is the gate the user cares about).
- The brief implied a verification step the skill couldn't perform.

In those cases the gate is "halt and surface", not "ready". Surface specifics — what was assumed, what wasn't checked, what to confirm — so the user can decide.
