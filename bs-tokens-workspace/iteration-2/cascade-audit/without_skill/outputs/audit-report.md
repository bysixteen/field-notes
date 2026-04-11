## Alert.css Token Cascade Audit (No Skill)

- **Host section** — PASS. All 8 component-local tokens correctly alias semantic tokens.
- **Sentiment section** — PASS. Warning/error/success variants correctly override via sentiment-scoped semantic tokens (`--color-warning-*`, etc.).
- **Emphasis section** — FAIL (3 issues).
  - Bypasses the sentiment layer by using generic semantic tokens (`--bg-surface-bold`, `--fg-on-bold`) instead of sentiment-aware ones.
  - Inconsistent naming convention (`--bg-*`/`--fg-*` vs `--color-*` used elsewhere).
  - Hardcoded `transparent` in low emphasis instead of a token.
- **State section** — FAIL (2 issues).
  - Aliases primitive tokens directly (`--colors-blue-100`, etc.), skipping the semantic layer entirely.
  - Hardcoded to blue hue, meaning interaction states would override sentiment colors (e.g., an error alert turns blue on hover).
- **Slots section** — PASS. All slots consume component-local tokens correctly.

**3 high-severity breaks total.** The file's own `BUG` comments on lines 52 and 72 confirm the two major cascade violations.
