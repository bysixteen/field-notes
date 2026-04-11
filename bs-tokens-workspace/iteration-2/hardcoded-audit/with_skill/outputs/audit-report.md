## Token Audit: Card Component (Iteration 2)

**7 hardcoded values found:**

- **3 BLOCKING (color):** `#f5f5f5` (line 8), `rgb(51, 51, 51)` (line 9), `#1a1a1a` (line 33) — all should use token-backed custom properties that chain through the cascade (State → Emphasis → Sentiment → Semantic Color)
- **3 SERIOUS (structural):** `16px 24px` padding (line 12), `14px` font-size (line 13), `18px` font-size (line 31) — should use `var(--size-*)` and `var(--font-size-*)` tokens
- **1 WARNING (radius):** `8px` border-radius (line 11) — should use `var(--radii-*)`

The component has no component-level token API at all (no `--card-bg`, `--card-fg`, etc.), meaning the entire color cascade is absent. Theme/dark-mode changes, sentiment swaps, and density adjustments will not propagate.

**Tokens currently consumed correctly:** `--color-border-primary`, `--color-border-secondary`, `--space-300`, `--space-200`, `--font-family-sans`, `--font-weight-600`, `--leading-normal`, `--border-width-thin`.
