## Answer: Which token for a disabled border on a button component?

Use **`var(--color-border-disabled)`**, consumed through the component-scoped custom property **`--btn/color/border/rest`**.

This is already correctly implemented in `Button.css` at line 103:

```css
.btn[data-state='disabled'] {
  --btn/color/bg/rest: var(--color-bg-disabled);
  --btn/color/fg/rest: var(--color-fg-disabled);
  --btn/color/border/rest: var(--color-border-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}
```

**Reasoning via the skill's decision tree:**
1. Styling target: Color (border) -- follow the Color branch.
2. Component-level state? Yes, `disabled` is a State dimension value -- use `var(--{component}-bg/fg/border)` pattern.
3. The component-scoped property is `--btn/color/border/rest`. In the disabled state rule, it gets reassigned to the semantic global `--color-border-disabled`.

**Cascade integrity:** `--color-border-disabled` is a semantic color global (matching the `--{property}-{level}-{state}` naming convention). It is not a primitive and not hardcoded, so it will respond correctly to theme changes. Never use a primitive like `--colors-gray-300` or a hardcoded hex value for this purpose.
