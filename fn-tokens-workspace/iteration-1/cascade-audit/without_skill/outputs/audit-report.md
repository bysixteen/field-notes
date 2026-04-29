## Token Cascade Audit: Alert.css

**File:** `fn-tokens-workspace/evals/files/broken-cascade/Alert.css`

### Expected Cascade

```
Primitive -> Semantic/Global -> Sentiment -> Emphasis -> State -> Component API (--alert-*)
```

Each layer should reference only the layer immediately below it.

### Findings

| Section | Lines | Status | Issue |
|---------|-------|--------|-------|
| Host | 7-27 | PASS | Component tokens correctly alias semantic tokens (`--color-*`, `--space-*`, etc.) |
| Sentiment | 30-49 | PASS | Correctly overrides component tokens with sentiment-scoped semantics (`--color-warning-*`, etc.) |
| **Emphasis** | 51-69 | **FAIL** | Skips the Sentiment layer. References generic semantic tokens (`--bg-surface-bold`, `--fg-on-bold`) that are not sentiment-aware. When both sentiment and emphasis are set, emphasis wins by source order and erases sentiment meaning. |
| **State** | 71-81 | **FAIL** | Skips 3 layers. References raw primitive tokens (`--colors-blue-100`, `--colors-blue-300`, etc.) directly. Hover/active states are hardcoded blue regardless of sentiment, and will break under theming/dark mode. |
| Slots | 87-104 | PASS | Correctly uses component-level custom properties. |

### Bug Details

**Bug 1 -- Emphasis skips Sentiment (Medium severity):**
Lines 53-57 assign `--alert-bg: var(--bg-surface-bold)` etc. These generic tokens have no awareness of whether the alert is warning, error, or success. Fix: use sentiment-contextualized emphasis tokens like `--color-{sentiment}-bg-bold`.

**Bug 2 -- State uses primitives (High severity):**
Lines 74-75 assign `--alert-bg: var(--colors-blue-100)`. Primitive tokens (`--colors-blue-*`) should never appear in component CSS. They bypass semantic, sentiment, and emphasis layers. Fix: use semantic interaction tokens like `--color-surface-primary-hover` or sentiment-scoped equivalents.

### Recommendations
1. Introduce sentiment-aware emphasis tokens so emphasis composes with sentiment rather than replacing it.
2. Replace all primitive references in state overrides with semantic interaction tokens.
3. Add a lint rule flagging any component CSS that references primitive-tier tokens (`--colors-*`).
