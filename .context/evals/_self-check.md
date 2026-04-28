# eval: _self-check

- **Total (strong stub):** 8 / 8
- **Total (weak stub):** 1 / 8
- **Tiebreak:** alphabetical by skill name

Synthetic-stub assertions in `eval-harness.mjs` validate the rubric:
- A deliberately strong SKILL.md scores 8/8 (Strong) across all four axes.
- A deliberately weak SKILL.md scores 1/8 (Weak) — frontmatter thin, no trigger / output / input language.
- Bottom-three ordering tiebreaks alphabetically when totals match.

Run via `node .claude/skills/_foundations/eval-harness.mjs --self-check`. Exit code 0 on success, 1 on assertion failure.
