---
name: fn-accessibility
description: >-
  Run a scored WCAG 2.2 AA accessibility audit on a design system component.
  Classifies components into brackets (B1–B6) and applies rules A01–A30
  selectively. Use when reviewing a component for accessibility compliance —
  including keyboard operability, ARIA attributes, focus management, screen
  reader announcements, contrast ratios, reduced motion, and touch target
  sizing. Also use when asked whether a component meets WCAG or is usable
  with assistive technology.
---

# Accessibility Audit

## Foundations (read first)

- [DESIGN-INTENT](_foundations/DESIGN-INTENT.md)
- [QUALITY-GATES](_foundations/QUALITY-GATES.md)

## Bracket Classification Matrix

| Bracket | Name | Example Components | Key A11y Concerns |
|---------|------|--------------------|-------------------|
| B6 | Overlay | dialog, drawer, tooltip, popover, toast, modal, dropdown menu | Focus trap, restoration, Escape dismiss, backdrop |
| B5 | Data | table, avatar, stat, timeline, data grid, list | Table semantics, captions, row/col headers |
| B4 | Composite | accordion, card with actions, data table, toolbar, tabs | Keyboard nav pattern, arrow keys, roving tabindex |
| B3 | Form | input, select, checkbox, radio, switch, slider, textarea | Label association, error states, aria-invalid |
| B2 | Interactive | button, toggle, chip, tab strip, link, menu item | Click+keyboard parity, disabled state, name |
| B1 | Display | badge, icon, label, separator, avatar (static), spinner | Alt text, decorative vs informative, aria-hidden |

Higher bracket wins if ambiguous. Component with action button = B4 minimum.

## Rules by Bracket Applicability

| Rule | Sev | B1 | B2 | B3 | B4 | B5 | B6 | Summary |
|------|-----|:--:|:--:|:--:|:--:|:--:|:--:|---------|
| A01 | CRIT | x | x | x | x | x | x | Missing alt text on images |
| A02 | CRIT | | x | | x | | x | Icon-only button with no accessible name |
| A03 | CRIT | | | x | x | | | Form control without label |
| A04 | CRIT | | x | x | x | x | x | Click handler on non-interactive element (div/span) |
| A05 | CRIT | | x | | | | | Anchor element without href |
| A18 | CRIT | x | x | x | x | x | x | Viewport zoom lock (maximum-scale=1) |
| A19 | CRIT | | x | x | x | | x | APG pattern violation |
| A20 | CRIT | | | | | | x | No focus trap in overlay |
| A21 | CRIT | | x | x | x | | x | Accessible name doesn't include visible label |
| A06 | SER | | x | x | x | x | x | Focus outline removed (outline:none without replacement) |
| A07 | SER | | x | x | x | x | x | Click without keyboard equivalent |
| A08 | SER | | x | x | x | x | | Color-only state indication |
| A13 | SER | x | x | x | x | x | x | aria-hidden on focusable element |
| A16 | SER | | | | | | x | No focus restoration after overlay closes |
| A17 | SER | x | x | x | x | x | x | Mobile font size below 16px |
| A22 | SER | | | x | x | x | x | Status update with no live region |
| A23 | SER | | | | | | x | Tooltip not dismissible via Escape |
| A24 | SER | | x | x | x | | x | Focus indicator obscured by overflow/z-index |
| A25 | SER | | x | | x | x | | Drag-only interaction without alternative |
| A09 | MOD | | x | x | x | | | Target size below 24x24 CSS px |
| A09b | MOD | | x | x | x | | | Target size below 44x44 on touch (mobile) |
| A10 | MOD | | x | x | x | x | x | Custom role without matching tabindex |
| A11 | MOD | | | | x | x | | Heading level skip (h2 -> h4) |
| A12 | MOD | | x | x | x | x | x | Positive tabindex value |
| A14 | MOD | | | | | x | | Table without caption or aria-label |
| A15 | MOD | | | x | x | x | x | Live region with wrong politeness |
| A26 | MOD | | | x | | | | Missing autocomplete on personal data inputs |
| A27 | MOD | x | x | x | x | x | x | Content breaks at 320px reflow |
| A28 | MOD | x | x | x | x | x | x | Text spacing override breaks layout |
| A29 | MOD | | | x | | | | Auth flow requires cognitive test |
| A30 | MOD | x | x | x | x | x | x | Viewport scale not 1-2 |

## Why Severity Tiers Matter

**CRITICAL** — Complete breakage for assistive technology users. A screen reader user cannot use the component at all, or a keyboard user has no path through the interface. No exceptions.

**SERIOUS** — Degraded but functional. The component works, but with meaningful friction for AT users — missing focus outlines, no keyboard equivalent for a mouse action, color-only state. Fix before next release.

**MODERATE** — Aspirational or edge-case. The component is usable but falls short of best practice in scenarios that may affect a subset of users (touch targets, cognitive load, text spacing edge cases). Fix in follow-up.

## Judgment Guidance

### Component sits between two brackets

Use the higher bracket. A card with a dismiss button is B4 (Composite), not B1 (Display) — the presence of an interactive control elevates the whole component.

### Rules that technically apply but are low-risk in context

Apply the rule, note the context. A `MODERATE` finding on a static admin dashboard used only on desktop can be noted as low-priority. A `MODERATE` on a mobile-first public product should be treated closer to `SERIOUS`.

### Escalating MODERATE to SERIOUS

Escalate when: the component is used in a high-traffic or high-stakes context (authentication, payment, forms), the user population is likely to include AT users, or the mobile-first context makes touch target size a real barrier.

### APG pattern doesn't exactly match your component

Find the closest APG pattern and note the divergence. If your component is a "disclosure with animation" — it still follows the Disclosure pattern. Document which aspects deviate and why, and verify the keyboard model is consistent.

## Common False Positives

| Scenario | Correct interpretation |
|----------|----------------------|
| `aria-hidden="true"` on decorative SVG | Correct — not a violation. Decorative icons should be hidden from AT. |
| Disabled button has no focus styles | Correct — disabled buttons intentionally don't receive focus. Do not flag missing focus ring. |
| Dialog heading doesn't follow page heading hierarchy | Correct — dialog headings are scoped to the dialog. `h2` inside a dialog after `h1` on the page is fine. |
| `role="presentation"` on layout table | Correct — removes table semantics from a table used purely for layout. |
| `aria-label` differs from visible text | Flag only if the accessible name does NOT include the visible label text (rule A21). A label that extends the visible text is fine. |

## Scoring Formula

```
Score = 100 - (CRITICAL x 10) - (SERIOUS x 5) - (MODERATE x 2)
```

| Score Range | Verdict | Action |
|-------------|---------|--------|
| >= 90 | Merge-ready | No blockers, proceed |
| 70-89 | Warrants attention | Fix before next release |
| < 70 | Requires remediation | Merge blocked |

## Contrast Ratio Quick Reference

| Context | Minimum Ratio | WCAG SC |
|---------|---------------|---------|
| Normal text (<24px / <18.66px bold) | 4.5:1 | 1.4.3 |
| Large text (>=24px / >=18.66px bold) | 3:1 | 1.4.3 |
| UI components & graphical objects | 3:1 | 1.4.11 |
| Focus indicator | 3:1 against adjacent | 2.4.11 |
| Disabled / inactive elements | Exempt | -- |

## APG Pattern Quick Reference

| Pattern | Keyboard | ARIA Roles |
|---------|----------|------------|
| Button | Enter/Space activates | `button` |
| Dialog (modal) | Tab cycles within, Escape closes | `dialog` + `aria-modal="true"` |
| Accordion | Enter/Space toggles, Arrow moves focus | `button` with `aria-expanded` |
| Tabs | Arrow switches tab, Tab moves to panel | `tablist` > `tab` + `tabpanel` |
| Menu | Arrow navigates, Enter selects, Escape closes | `menu` > `menuitem` |
| Switch | Space toggles | `switch` + `aria-checked` |
| Combobox | Arrow opens list, type to filter | `combobox` + `listbox` |
| Disclosure | Enter/Space toggles | `button` + `aria-expanded` |

## Workflow

1. Identify bracket (use classification matrix above)
2. Filter rule table to applicable rules for that bracket
3. Apply rules in severity order: CRITICAL -> SERIOUS -> MODERATE
4. Check APG compliance for B2/B3/B4/B6 (use APG quick reference)
5. Verify contrast ratios (use contrast quick reference)
6. Calculate score
7. Produce report using output template
8. Offer to fix all findings

## Output Format Template

```
===========================================================
ACCESSIBILITY AUDIT: {ComponentName}
Bracket: B{n} — {BracketName}
Files reviewed: {list}
===========================================================

SCORE: {n}/100 — {Merge-ready | Warrants attention | Requires remediation}

CRITICAL ({count})
  [{rule}] {description}
    File: {path}:{line}
    Fix: {specific remediation}

SERIOUS ({count})
  [{rule}] {description}
    File: {path}:{line}
    Fix: {specific remediation}

MODERATE ({count})
  [{rule}] {description}
    File: {path}:{line}
    Fix: {specific remediation}

APG COMPLIANCE: {pattern name} — {PASS | FAIL: details}
CONTRAST CHECK: {PASS | FAIL: details}

===========================================================
NEXT STEPS:
1. {prioritized fix}
2. {prioritized fix}
===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `fn-html` | HTML semantics decisions feed directly into a11y audit (link vs button, ARIA roles) |
| `fn-review` | Full component review runs a11y as Stage 3 — use fn-review for comprehensive audit |
| `fn-testing` | Layer 2 testing covers automated a11y (jest-axe, axe-core) — pair findings with test coverage |
| `fn-css` | Focus ring rules (non-negotiable #4) and :not() guards (#3) directly affect a11y |
| `fn-component-api` | State dimension (disabled, resolving) must map correctly to aria attributes |

See your project's design system documentation for the full accessibility audit reference.

## Self-review

Before declaring done, run the self-review protocol from `_foundations/SELF-REVIEW.md`.
