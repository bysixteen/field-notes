---
name: bs-component-api
description: >-
  Define, name, type, and default component inputs for a design system.
  Use when specifying a new component API, auditing existing inputs, deciding
  between boolean/enum, naming props, handling slots, or extrapolating an API
  from the canonical Button example. Triggers on: "what should this component
  accept", "should this be a boolean or an enum", "how do I name this prop",
  "what's the API for X", "slot patterns", "component API", "props interface",
  "component contract", "define the inputs", "design the API",
  "prop naming", "prop types", "default values", "dimension inputs",
  "content inputs", "slot inputs", "event outputs", "enum vs boolean",
  "boolean prop", "string union", "emphasis prop", "sentiment prop",
  "size prop", "state prop", "which props does this need",
  "what dimensions should this have", "API surface", "breaking change",
  "prop audit", "input categories", "component inputs", "consumer API",
  "public interface", "how should I type this", "design token mode",
  "dimensional model", "add a new variant", "extend this component",
  "component configuration".
---

# Component API

Define the consumer-facing contract of a design system component: every input it accepts, how it is typed, named, defaulted, and slotted.

## Four Input Categories

| Category | Purpose | Example | Convention |
|----------|---------|---------|------------|
| **Dimension** | Activate a token collection mode | `emphasis`, `sentiment`, `size` | String union, always has default |
| **Content** | Text and values the component renders | `label`, `description`, `count` | String / number, default `''` or `0` |
| **Slot** | Optional content areas | `prefixIcon`, `suffix`, `avatar` | `ReactNode`, default `undefined` |
| **Event** | Interactions communicated to parent | `onClick`, `onChange`, `onDismiss` | Callback, optional |

## Three Rules

1. **Enums, not booleans** -- every dimension input is a string union. A boolean can never grow without a breaking change.
2. **Every input has a default** -- a bare `<Button />` must render sensibly.
3. **Names describe the dimension, not the visual** -- `emphasis: 'high'` not `isPrimary: true`.

## Dimension Vocabulary (Standard Modes)

| Dimension | Standard Modes | Include When | Default |
|-----------|---------------|--------------|---------|
| `state` | `rest` `hover` `active` `selected` `disabled` `resolving` `pending` | Interactive (B2+) | `rest` |
| `emphasis` | `high` `medium` `low` | Multiple visual weights | `medium` |
| `sentiment` | `neutral` `warning` `highlight` `new` `success` `error` | Communicative meaning | `neutral` |
| `size` | `xs` `sm` `md` `lg` `xl` | Size variants | `md` |
| `structure` | *(never exposed as a prop)* | Always -- fixed skeleton | N/A |

## Decision Tree

```
Is it a new interactive condition?     --> Mode on `state`
Is it a new visual weight?             --> Mode on `emphasis`
Does it change the layer structure?    --> Variant (separate component)
Is it content to render?               --> String prop, default ''
Is it an optional content area?        --> ReactNode slot prop
Does it convey semantic meaning?       --> Mode on `sentiment`
Does it need size variants?            --> Mode on `size`
None of the above                      --> New enum input, name the dimension, provide default
```

## Naming Conventions

| Pattern | Correct | Incorrect | Why |
|---------|---------|-----------|-----|
| Visual weight | `emphasis="high"` | `isPrimary`, `variant="primary"` | Dimension name, not visual outcome |
| Meaning | `sentiment="error"` | `isError`, `color="red"` | Semantic, not presentational |
| Size | `size="sm"` | `small`, `isCompact` | Standardized scale |
| State | `state="disabled"` | `isDisabled`, `disabled` | Unified state dimension |
| Loading | `state="resolving"` | `isLoading`, `loading` | Loading is a state mode, not separate prop |

## Canonical Button Example

```tsx
interface ButtonProps {
  // Dimensions
  emphasis?: 'high' | 'medium' | 'low';      // default: 'medium'
  sentiment?: 'neutral' | 'warning' | 'highlight' | 'new' | 'success' | 'error';  // default: 'neutral'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // default: 'md'

  // Content
  children: ReactNode;

  // Slots
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;

  // Events
  onClick?: (event: MouseEvent) => void;

  // State (managed internally, can be overridden)
  disabled?: boolean;  // maps to data-state="disabled"
}
```

## Audit Checklist

| Check | Severity | Rule |
|-------|----------|------|
| Boolean used for dimension input | BLOCKING | Enums, not booleans |
| Input missing default value | BLOCKING | Every input has a default |
| Visual name (`isPrimary`, `isGhost`) | BLOCKING | Names describe dimension |
| Non-standard mode value | SERIOUS | Use standard vocabulary |
| Loading as separate prop | SERIOUS | Merge into state='resolving' |
| Dimension inputs on child instead of parent | SERIOUS | Dimensions on parent (composites) |
| Missing slot for obvious content area | MODERATE | Consider slot inputs |
| Overly broad `children` instead of named slots | MODERATE | Named slots for clarity |

## Output Format Template

```
===========================================================
COMPONENT API AUDIT: {ComponentName}
===========================================================

INPUTS FOUND:
  Dimensions: {list with types and defaults}
  Content:    {list with types and defaults}
  Slots:      {list with types}
  Events:     {list with types}

FINDINGS:
  [{BLOCKING|SERIOUS|MODERATE}] {description}
    Current: {what exists}
    Should be: {correct form}

RECOMMENDED API:
  interface {ComponentName}Props {
    // Dimensions
    ...
    // Content
    ...
    // Slots
    ...
    // Events
    ...
  }
===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `bs-component-scaffold` | After defining the API, scaffold generates all boilerplate files |
| `bs-tokens` | Dimension inputs map 1:1 to token collection modes |
| `bs-react-patterns` | API decisions affect React implementation (forwardRef, rest spread) |
| `bs-review` | Full review runs API audit as Stage 0 |
| `bs-html` | API decisions like link vs button affect which HTML element to use |
| `bs-css` | Dimension inputs map to `data-*` attribute selectors in CSS |

See your project's design system documentation for the full component API reference.
