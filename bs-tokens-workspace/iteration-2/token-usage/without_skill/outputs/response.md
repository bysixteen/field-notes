**Answer: Use `--color-border-disabled`.**

This is the semantic token already used in the Button's CSS at line 103 within the `[data-state='disabled']` rule. It follows the consistent `--color-{category}-disabled` pattern used alongside `--color-bg-disabled` and `--color-fg-disabled`. The disabled state override sits correctly in the cascade, ensuring a uniform disabled appearance regardless of sentiment or emphasis variant. The Button also applies `opacity: 0.5` at the host level, so no additional border-level dimming is needed.
