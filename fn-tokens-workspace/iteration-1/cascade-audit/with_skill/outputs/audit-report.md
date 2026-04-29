## Alert Token Cascade Audit

**3 BLOCKING findings, 1 WARNING:**

| # | Severity | Finding |
|---|----------|---------|
| 1 | BLOCKING | **Emphasis skips Sentiment** -- Lines 53-69 alias Semantic Color globals directly (`--bg-surface-bold`, `--fg-on-bold`, etc.) instead of aliasing the Sentiment layer. A sentiment change (e.g., switching to error) has no effect when emphasis is also set. |
| 2 | BLOCKING | **State skips Emphasis** -- Lines 73-81 alias primitive tokens (`--colors-blue-100/200/300/400`) instead of Emphasis layer tokens. Hover/active states are hardcoded to blue palette regardless of sentiment or emphasis. |
| 3 | BLOCKING | **Primitives in component CSS** -- 4 instances of `--colors-*` tokens on lines 74, 75, 79, 80. These must never appear in component CSS per audit rule. |
| 4 | WARNING | **Hardcoded `transparent`** -- Lines 66, 68 use the `transparent` keyword instead of a semantic token. |

**Structural track is clean:** Spacing uses `--space-*`, typography uses `--font-size-*`, radius uses `--radii-*`.

**The cascade is broken at two links:** Emphasis-to-Sentiment and State-to-Emphasis. The BUG comments on lines 52 and 72 of Alert.css confirm these are intentionally broken for evaluation purposes.
