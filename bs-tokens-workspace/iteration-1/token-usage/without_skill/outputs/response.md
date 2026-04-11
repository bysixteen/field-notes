**Answer: Use `--color-border-disabled`.**

The Button CSS already demonstrates this on line 103 of `Button.css`:

```css
.btn[data-state='disabled'] {
  --btn/color/border/rest: var(--color-border-disabled);
}
```

This follows the codebase's `--color-{property}-{state}` naming convention for interactive state tokens and pairs with its siblings `--color-bg-disabled` and `--color-fg-disabled`. It is a semantic token (describes intent, not a literal color), so themes can redefine the value without touching component CSS.
