**Recommended token: `var(--color-border-disabled)`**

Use the component-scoped custom property `--btn/color/border/rest` and set it to `var(--color-border-disabled)` within the disabled state selector. This is exactly what the existing Button component already does at line 103 of `Button.css`:

```css
.btn[data-state='disabled'] {
  --btn/color/border/rest: var(--color-border-disabled);
}
```

**Cascade position:** `disabled` is a State-layer value. The alias chain is State -> Emphasis -> Sentiment -> Semantic Color. The `--color-border-disabled` token is a semantic-level global that resolves through the theme pipeline, so theme changes and sentiment swaps propagate automatically.

**Why not alternatives:**
- Primitives like `--colors-gray-300` -- breaks theme propagation (BLOCKING audit finding)
- `transparent` -- hides the border rather than communicating disabled state
- `--color-neutral-border` -- wrong cascade layer (Sentiment, not State)
- `--color-border-primary` -- rest-state token, doesn't convey disabled semantics
