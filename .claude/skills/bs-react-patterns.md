---
name: bs-react-patterns
description: >-
  Review React component code for modern patterns and best practices in
  design system contexts. Covers hooks, memo, key usage, RSC boundaries,
  forwardRef, composition, and performance. Use when reviewing React
  components, checking for anti-patterns, or ensuring modern React practices.
  Triggers on: "review React patterns", "is this React correct", "hooks
  usage", "memo", "forwardRef", "server components", "React best practices",
  "React component review", "review this component", "React anti-patterns",
  "use client", "use server", "RSC boundary", "server component boundary",
  "forward ref", "ref forwarding", "spread props", "rest props",
  "useMemo", "useCallback", "useRef", "useState", "useEffect",
  "custom hook", "React.lazy", "Suspense", "composition pattern",
  "render prop", "children pattern", "slot pattern in React",
  "compound component", "controlled vs uncontrolled",
  "key prop", "list rendering", "array index key",
  "React performance", "unnecessary re-render", "memoization",
  "React design system patterns", "component implementation",
  "how should I implement this in React", "React code review".
---

# React Patterns for Design Systems

## Priority Rules

### P1 -- Must fix (merge blocked)

| Rule | Pattern | Anti-pattern |
|------|---------|-------------|
| **forwardRef on all leaf components** | `forwardRef<HTMLElement, Props>(function Name(props, ref) {...})` | `function Name(props) {...}` without ref |
| **Spread remaining props** | `const { emphasis, ...rest } = props; return <el {...rest}>` | Not spreading, blocking consumer `className`, `data-*`, `aria-*` |
| **Memoize expensive computations** | `useMemo(() => derive(data), [data])` | Recomputing on every render |

### P2 -- Should fix

| Rule | Pattern | Anti-pattern |
|------|---------|-------------|
| **Composition over configuration** | `<Card><CardHeader>...</CardHeader></Card>` | `<Card header="..." body="..." />` |
| **'use client' on interactive components** | `'use client'` at top of file with hooks/events | Missing directive on component using onClick |
| **Correct key usage** | `key={item.id}` on dynamic lists | `key={index}` on reorderable lists |

### P3 -- Nice to have

| Rule | Pattern | Anti-pattern |
|------|---------|-------------|
| **Custom hooks for complex state** | `useAccordion()` hook | Inline useState/useEffect soup |
| **CSS for visual states** | `[data-state="hover"]` in CSS | `onMouseEnter` + `useState` for hover |
| **Lazy loading** | `React.lazy()` + `Suspense` for heavy components | Importing everything eagerly |

## forwardRef Template

```tsx
import { forwardRef, type ComponentPropsWithRef } from 'react';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  emphasis?: 'high' | 'medium' | 'low';
  sentiment?: 'neutral' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { emphasis = 'medium', sentiment = 'neutral', size = 'md', children, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        data-emphasis={emphasis}
        data-sentiment={sentiment}
        data-size={size}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
```

## Server Component Decision Tree

```
Uses hooks (useState, useEffect, etc.)?     --> 'use client'
Has event handlers (onClick, onChange)?      --> 'use client'
Accesses browser APIs (window, document)?   --> 'use client'
Uses context (useContext)?                   --> 'use client'
Pure display, no interactivity?             --> Server Component (no directive)
```

## Composition Patterns

### Compound Component

```tsx
// Parent owns shared state, children compose structure
<Accordion>
  <AccordionItem>
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionPanel>Content 1</AccordionPanel>
  </AccordionItem>
</Accordion>
```

### Slot Pattern (NEO)

```tsx
// Named slots via props, not children
<Button
  prefixIcon={<Icon name="search" />}
  suffixIcon={<Icon name="chevron-down" />}
>
  Search
</Button>
```

### Controlled + Uncontrolled

```tsx
// Support both patterns
interface ToggleProps {
  value?: boolean;           // controlled
  defaultValue?: boolean;    // uncontrolled
  onChange?: (value: boolean) => void;
}
```

## Audit Checklist

| Check | Severity | Category |
|-------|----------|----------|
| Missing forwardRef on leaf component | P1 | Refs |
| Not spreading ...rest | P1 | Props |
| Unnecessary re-renders (missing memo/useMemo) | P1 | Performance |
| Configuration over composition | P2 | Architecture |
| Missing 'use client' on interactive component | P2 | RSC |
| Array index as key in dynamic list | P2 | Rendering |
| Hover/focus state managed in React instead of CSS | P3 | Performance |
| Inline object/array creation in JSX props | P3 | Performance |
| Missing displayName on forwardRef component | P3 | DX |

## Output Format Template

```
===========================================================
REACT PATTERNS AUDIT: {ComponentName}
File: {path}
===========================================================

P1 -- MUST FIX ({count})
  [{rule}] {description}
    Line {n}: {code snippet}
    Fix: {specific remediation with code}

P2 -- SHOULD FIX ({count})
  [{rule}] {description}
    Line {n}: {code snippet}
    Fix: {specific remediation with code}

P3 -- NICE TO HAVE ({count})
  [{rule}] {description}
    Line {n}: {code snippet}
    Fix: {specific remediation with code}

RSC BOUNDARY: {'use client' present | Missing | Not needed (pure display)}
FORWARDED REF: {Yes | No -- MUST ADD}
REST SPREAD: {Yes | No -- MUST ADD}

===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `bs-component-api` | API defines props interface that React implementation must honor |
| `bs-component-scaffold` | Scaffold generates TSX following these patterns |
| `bs-html` | HTML element choice determines forwardRef generic type |
| `bs-review` | Full review runs React patterns as Stage 1 |
| `bs-testing` | Test patterns depend on React implementation (render, fireEvent) |
| `bs-css` | CSS handles visual states; React should not duplicate with useState |

Full documentation: [React Patterns](/design-system/react-patterns)
