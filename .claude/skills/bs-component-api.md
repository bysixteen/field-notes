---
name: bs-component-api
description: >-
  Define, name, type, and default component inputs for a design system.
  Use when specifying a new component API, auditing existing inputs, deciding
  between boolean/enum, naming props, handling slots, or extrapolating an API
  from the canonical Button example. Triggers on: "what should this component
  accept", "should this be a boolean or an enum", "how do I name this prop",
  "what's the API for X", "slot patterns".
---

# Component API

Define the consumer-facing contract of a design system component: every input it accepts, how it is typed, named, defaulted, and slotted.

## Four Input Categories

```
Dimension inputs  →  which token collection mode to activate
Content inputs    →  text and values the component renders
Slot inputs       →  optional content areas (icons, badges, avatars)
Event outputs     →  interactions communicated back to the parent
```

## Three Rules

1. **Enums, not booleans** — every dimension input is a string union. A boolean can never grow without a breaking change.
2. **Every input has a default** — a bare `<Button />` must render sensibly.
3. **Names describe the dimension, not the visual** — `emphasis: 'high'` not `isPrimary: true`.

## Dimension Vocabulary

| Dimension | Standard modes | Include when |
|---|---|---|
| `state` | `rest` `hover` `active` `selected` `disabled` `resolving` `pending` | Interactive |
| `emphasis` | `high` `medium` `low` | Multiple visual weights |
| `sentiment` | `neutral` `warning` `highlight` `new` `success` `error` | Communicative meaning |
| `size` | `xs` `sm` `md` `lg` `xl` | Size variants |
| `structure` | *(never exposed as a prop)* | Always — fixed skeleton |

## Decision Tree

```
New condition → Mode on `state`
New visual weight → Mode on `emphasis`
Layer structure changes → Variant (separate component)
Content → String prop, default ''
Slot presence → Optional ReactNode prop
None of the above → New enum input, name the dimension, provide default
```

## Audit Checklist

- No boolean dimension inputs
- Every input has a default
- No visual names (isPrimary, isGhost)
- Standard mode values only
- Loading merged into state='resolving'
- Dimension inputs on parent, not child (composites)

Full documentation: [Component API](/design-system/component-api)
