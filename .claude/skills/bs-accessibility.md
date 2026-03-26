---
name: bs-accessibility
description: >-
  Run a scored WCAG 2.2 AA accessibility audit on a design system component.
  Classifies components into brackets (B1–B6) and applies rules A01–A30
  selectively. Use when asked to review for accessibility, run an a11y audit,
  check WCAG compliance, verify screen reader support, check keyboard
  operability, or audit focus management. Triggers on: "accessibility review",
  "a11y audit", "WCAG check", "screen reader", "keyboard navigation",
  "focus trap", "aria-label", "check this component for accessibility".
---

# Accessibility Audit

## Brackets

| Bracket | Name | Example |
|---------|------|---------|
| B6 | Overlay | dialog, drawer, tooltip, popover |
| B4 | Composite | accordion, card with actions, data table |
| B3 | Form | input, select, checkbox, radio |
| B2 | Interactive | button, toggle, chip, tab strip |
| B5 | Data | table, avatar, stat, timeline |
| B1 | Display | badge, icon, label, separator |

Higher bracket wins if ambiguous. Component with action button = B4 minimum.

## Scoring

```
Score = 100 − (CRITICAL × 10) − (SERIOUS × 5) − (MODERATE × 2)
```

≥90 = Merge-ready · 70–89 = Warrants attention · <70 = Requires remediation

## CRITICAL Rules (−10, merge blocked)

A01 (missing alt), A02 (icon button no name), A03 (form no label), A04 (click on div),
A05 (anchor no href), A18 (viewport zoom lock), A19 (APG violation), A20 (no focus trap),
A21 (label not in name)

## SERIOUS Rules (−5)

A06 (focus outline removed), A07 (click no keyboard), A08 (colour-only state),
A13 (aria-hidden focusable), A16 (no focus restoration), A17 (mobile font <16px),
A22 (status no live region), A23 (tooltip not dismissible), A24 (focus obscured),
A25 (drag only)

## MODERATE Rules (−2)

A09/A09b (target size), A10 (role no tabindex), A11 (heading skip), A12 (positive tabindex),
A14 (table no caption), A15 (live region issues), A26 (no autocomplete), A27 (reflow 320px),
A28 (text spacing), A29 (auth cognitive), A30 (viewport scale 1-2)

## Workflow

1. Identify bracket
2. Apply rules by bracket (CRITICAL first)
3. Check APG compliance for B2/B3/B4/B6
4. Calculate score
5. Produce report
6. Offer to fix

Full documentation: [Accessibility Audit](/design-system/accessibility-audit)
