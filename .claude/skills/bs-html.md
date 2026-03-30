---
name: bs-html
description: >-
  Decide which HTML elements and ARIA attributes to use in a design system
  component. Use when choosing between link/button, deciding container
  semantics, implementing dialog/menu/tabs/accordion, or adding ARIA
  attributes. Triggers on: "should this be a link or button", "what role",
  "which ARIA attributes", "semantic HTML", "dialog pattern", "form labels",
  "nav vs menu", "disclosure pattern", "HTML element", "which tag",
  "what element should I use", "native element", "ARIA role",
  "aria-expanded", "aria-selected", "aria-checked", "aria-label",
  "aria-describedby", "aria-hidden", "aria-live", "aria-controls",
  "aria-haspopup", "aria-modal", "role=button", "role=dialog",
  "role=tablist", "role=menu", "role=switch", "role=combobox",
  "fieldset", "legend", "label element", "form semantics",
  "tabpanel", "tab pattern", "accordion pattern", "menu pattern",
  "listbox pattern", "combobox pattern", "disclosure widget",
  "modal dialog", "non-modal dialog", "popover", "tooltip semantics",
  "nav element", "header element", "main element", "section element",
  "landmark", "heading level", "heading hierarchy", "interactive element",
  "keyboard path", "focusable", "tabindex", "which HTML for this component".
---

# HTML Semantics

Native HTML elements first. ARIA only when no native element fits.

## Element Decision Tree

```
Navigates to URL?              --> <a href="...">
Submits form?                  --> <button type="submit">
Toggles boolean state?         --> <button role="switch" aria-checked>
Opens/closes content?          --> <button aria-expanded> + content
Triggers an action?            --> <button type="button">
Groups form controls?          --> <fieldset> + <legend>
Contains navigation links?     --> <nav> with <a> links
Is a modal overlay?            --> <dialog> (native)
Is a data table?               --> <table> with <caption>, <thead>, <th scope>
Is a list of items?            --> <ul>/<ol> + <li>
Is a heading?                  --> <h1>-<h6> (never skip levels)
Is decorative?                 --> aria-hidden="true"
```

## Key APG Patterns

| Pattern | Element | Keyboard | Required ARIA |
|---------|---------|----------|---------------|
| **Button** | `<button>` | Enter/Space activates | Native role sufficient |
| **Link** | `<a href>` | Enter activates | Native role sufficient |
| **Switch** | `<button role="switch">` | Space toggles | `aria-checked={boolean}` |
| **Dialog (modal)** | `<dialog>` | Tab cycles within, Escape closes | `aria-modal="true"`, `aria-labelledby` |
| **Dialog (non-modal)** | `<div role="dialog">` | Tab can leave, Escape closes | `aria-labelledby` |
| **Tabs** | `<div role="tablist">` | Arrow switches tab, Tab to panel | `role="tab"` + `role="tabpanel"` + `aria-selected` + `aria-controls` |
| **Accordion** | `<button aria-expanded>` per header | Enter/Space toggles, Arrow between headers | `aria-expanded`, `aria-controls` |
| **Menu** | `<div role="menu">` | Arrow navigates, Enter selects, Escape closes | `role="menuitem"`, NOT for navigation |
| **Combobox** | `<input role="combobox">` | Arrow opens, type filters, Escape closes | `aria-expanded`, `aria-controls`, `aria-activedescendant` |
| **Disclosure** | `<button aria-expanded>` | Enter/Space toggles | `aria-expanded`, `aria-controls` |
| **Tooltip** | `<div role="tooltip">` | Appears on focus/hover, Escape dismisses | `aria-describedby` on trigger |
| **Listbox** | `<div role="listbox">` | Arrow navigates, Enter selects | `role="option"`, `aria-selected` |

## Form Rules

| Rule | Implementation |
|------|---------------|
| Every input needs a label | `<label for="id">` or `aria-label` or `aria-labelledby` |
| Group related inputs | `<fieldset>` + `<legend>` |
| Help text | `aria-describedby` pointing to help element |
| Error messages | `aria-describedby` pointing to error + `aria-invalid="true"` |
| Required fields | `aria-required="true"` or `required` attribute |
| Personal data | `autocomplete` attribute (name, email, tel, etc.) |

## Common ARIA Attribute Reference

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `aria-label` | Accessible name (no visible label) | String |
| `aria-labelledby` | Accessible name from visible element | ID reference |
| `aria-describedby` | Supplementary description | ID reference(s) |
| `aria-expanded` | Expandable control state | `true` / `false` |
| `aria-selected` | Selection state (tabs, options) | `true` / `false` |
| `aria-checked` | Checked state (switch, checkbox) | `true` / `false` / `mixed` |
| `aria-controls` | Controlled element | ID reference |
| `aria-hidden` | Hidden from assistive tech | `true` (decorative only) |
| `aria-live` | Dynamic content announcements | `polite` / `assertive` / `off` |
| `aria-modal` | Modal dialog indicator | `true` |
| `aria-invalid` | Validation state | `true` / `false` |
| `aria-required` | Required field | `true` |
| `aria-disabled` | Disabled (still focusable) | `true` |
| `aria-haspopup` | Indicates popup type | `true` / `menu` / `listbox` / `dialog` |
| `aria-activedescendant` | Virtual focus within composite | ID reference |

## Seven Summary Rules

1. Native elements first -- never add ARIA to override native semantics
2. Don't add `role` to override what an element already is
3. Every interactive element needs a keyboard path
4. Every image needs alt text (or `aria-hidden="true"` if decorative)
5. Every form control needs a label
6. Never use `tabindex > 0`
7. Never put `aria-hidden="true"` on focusable elements

## Audit Checklist

| Check | Severity |
|-------|----------|
| `<div>` or `<span>` with click handler | BLOCKING |
| `<a>` without `href` | BLOCKING |
| Form control without label | BLOCKING |
| ARIA role overriding native semantics | SERIOUS |
| Missing keyboard handler for custom widget | SERIOUS |
| Wrong APG pattern implementation | SERIOUS |
| `tabindex > 0` | MODERATE |
| Heading level skip | MODERATE |
| Missing `autocomplete` on personal data input | MODERATE |

## Output Format Template

```
===========================================================
HTML SEMANTICS AUDIT: {ComponentName}
===========================================================

ELEMENT CHOICES:
  Root: <{element}> -- {rationale}
  {sub-elements with rationale}

ARIA ATTRIBUTES:
  {attribute}: {value} -- {purpose}

APG PATTERN: {pattern name}
  Keyboard: {expected interactions}
  Compliance: {PASS | FAIL: details}

FINDINGS:
  [{BLOCKING|SERIOUS|MODERATE}] {description}
    Current: {what exists}
    Should be: {correct implementation}

===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `bs-accessibility` | HTML decisions directly feed a11y audit rules (A01-A05, A19) |
| `bs-component-api` | API decisions (link vs button) determine HTML element choice |
| `bs-react-patterns` | React implementation of HTML patterns (forwardRef on correct element) |
| `bs-review` | Full review runs HTML semantics as Stage 2 |
| `bs-css` | HTML elements determine valid CSS selectors |

Full documentation: [HTML Semantics](/design-system/html-semantics)
