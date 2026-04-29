## Card CSS Token Audit (No Skill)

**7 hardcoded values** found in `Card.css` that should use design tokens:

- `background: #f5f5f5` -- should use a background color token
- `color: rgb(51, 51, 51)` -- should use a text color token
- `border-radius: 8px` -- should use a radius token
- `padding: 16px 24px` -- should use spacing tokens
- `font-size: 14px` (on `.card`) -- should use a type-scale token
- `font-size: 18px` (on `.card__title`) -- should use a type-scale token
- `color: #1a1a1a` (on `.card__title`) -- should use a text/heading color token

13 other stylistic declarations correctly use `var(--token-name)` references, giving an approximate **65% compliance rate**.
