---
name: bs-html
description: >-
  Decide which HTML elements and ARIA attributes to use in a design system
  component. Use when choosing between link/button, deciding container
  semantics, implementing dialog/menu/tabs/accordion, or adding ARIA
  attributes. Triggers on: "should this be a link or button", "what role",
  "which ARIA attributes", "semantic HTML", "dialog pattern", "form labels",
  "nav vs menu", "disclosure pattern".
---

# HTML Semantics

Native HTML elements first. ARIA only when no native element fits.

## Link vs Button

```
Navigates to URL? → <a href>
Submits form?     → <button type="submit">
Everything else   → <button type="button">
```

## Key Patterns

- **Dialog:** Prefer native `<dialog>` — built-in focus trap, Escape, backdrop
- **Navigation:** `<nav>` with `<a>` links, Tab between links
- **Menu:** `role="menu"` with `role="menuitem"`, Arrow keys between items — NOT for navigation
- **Switch:** `<button role="switch" aria-checked={isOn}>` — no extra keyboard handler needed
- **Tabs:** `role="tablist"` + `role="tab"` + `role="tabpanel"`, Arrow keys between tabs
- **Disclosure:** `<button aria-expanded>` + content with `role="region"`

## Form Rules

- Every input needs a `<label>` (visible or `aria-label`)
- Group related inputs with `<fieldset>` + `<legend>`
- Use `aria-describedby` for help text and error messages
- Set `aria-invalid` on invalid controls
- Use `autocomplete` on personal data inputs

## Summary Rules

1. Native elements first
2. Don't add ARIA to override native semantics
3. Every interactive element needs a keyboard path
4. Every image needs alt text
5. Every form control needs a label
6. Never use `tabindex > 0`
7. Never put `aria-hidden` on focusable elements

Full documentation: [HTML Semantics](/design-system/html-semantics)
