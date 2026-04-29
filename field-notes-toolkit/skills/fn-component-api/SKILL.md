---
name: fn-component-api
description: >-
  Define, name, type, and default component inputs for a design system.
  Use when specifying a new component API, auditing existing inputs for
  convention compliance, deciding between boolean/enum/T-shirt sizing, naming
  props, or handling slots. Draws on the canonical Button example to
  extrapolate APIs for any component — covering dimension inputs, content
  inputs, event outputs, and public interface surface. Also use when extending
  a component or evaluating breaking changes.
---

# Component API

## Foundations (read first)

- [DIMENSIONAL-MODEL](../_foundations/DIMENSIONAL-MODEL.md)
- [QUALITY-GATES](../_foundations/QUALITY-GATES.md)

Define the consumer-facing contract of a design system component: every input it accepts, how it is typed, named, defaulted, and slotted.

## Four Input Categories

| Category | Purpose | Example | Convention |
|----------|---------|---------|------------|
| **Dimension** | Activate a token collection mode | `emphasis`, `sentiment`, `size` | String union, always has default |
| **Content** | Text and values the component renders | `label`, `description`, `count` | String / number, default `''` or `0` |
| **Slot** | Optional content areas | `prefixIcon`, `suffix`, `avatar` | `ReactNode`, default `undefined` |
| **Event** | Interactions communicated to parent | `onClick`, `onChange`, `onDismiss` | Callback, optional |

## Three Rules

1. **Enums, not booleans** — every dimension input is a string union. A boolean can never grow without a breaking change. Two booleans create combinatorial ambiguity: what does `isPrimary && isGhost` mean? An enum makes states mutually exclusive and self-documenting.
2. **Every input has a default** — a bare `<Button />` must render. Defaults also document the *expected* usage: if `emphasis` defaults to `'medium'`, that's the normal case — high emphasis is the exception.
3. **Names describe the dimension, not the visual** — `emphasis: 'high'` not `isPrimary: true`. If the brand changes, `primary` becomes meaningless. `emphasis="high"` is abstract and stable across any visual treatment.

**Exception: `disabled` is correctly a boolean.** It is binary, DOM-native, and has no meaningful third state in this model. It maps to `data-state="disabled"` internally.

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

## Real-World Trade-offs

| Scenario | Guidance |
|----------|---------|
| Only 2 modes, unlikely to grow | A new dimension may be overkill. Consider if the variation is truly structural or just visual. If purely visual, handle in CSS without a prop. |
| `children` vs named slots | Simple, unstructured content → `children`. Structured content with distinct regions (icon + label + badge) → named slots (`prefixIcon`, `suffixIcon`). |
| When to break "enums not booleans" | `disabled` (binary, DOM-native), `required` (binary, form standard). Not for anything that describes visual weight, meaning, or state. |

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

## Canonical Form Input Example

Button is simple — a single interactive element. Input shows how the model handles a more complex form component.

```tsx
interface TextInputProps {
  // Dimensions
  size?: 'sm' | 'md' | 'lg';                                   // default: 'md'
  state?: 'rest' | 'invalid' | 'valid' | 'disabled';           // default: 'rest'

  // Content
  label: string;                                                // required, no default
  placeholder?: string;                                         // default: ''
  helpText?: string;                                            // default: undefined
  errorMessage?: string;                                        // default: undefined

  // Controlled + uncontrolled
  value?: string;                                               // controlled
  defaultValue?: string;                                        // uncontrolled
  onChange?: (value: string) => void;

  // DOM passthrough
  disabled?: boolean;                                           // maps to state='disabled'
  required?: boolean;
}
```

Note: `state` for form components uses `invalid`/`valid`/`pending` — not `hover`/`active`. The state dimension is component-specific; use modes that reflect the component's actual interactive model.

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
| `fn-component-scaffold` | After defining the API, scaffold generates all boilerplate files |
| `fn-tokens` | Dimension inputs map 1:1 to token collection modes |
| `fn-react-patterns` | API decisions affect React implementation (forwardRef, rest spread) |
| `fn-review` | Full review runs API audit as Stage 0 |
| `fn-html` | API decisions like link vs button affect which HTML element to use |
| `fn-css` | Dimension inputs map to `data-*` attribute selectors in CSS |

See your project's design system documentation for the full component API reference.
