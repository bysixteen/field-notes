---
name: bs-react-patterns
description: >-
  Review React component code for modern patterns and best practices in
  design system contexts. Covers hooks, memo, key usage, RSC boundaries,
  forwardRef, composition, and performance. Use when reviewing React
  components, checking for anti-patterns, or ensuring modern React practices.
  Triggers on: "review React patterns", "is this React correct", "hooks
  usage", "memo", "forwardRef", "server components", "React best practices".
---

# React Patterns for Design Systems

## Priority Rules

### P1 — Must fix

**1. forwardRef for all leaf components** — Design system components must forward refs so consumers can access the DOM node.

```tsx
// ✅
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    return <button ref={ref} {...props} />;
  }
);

// ❌
function Button(props: ButtonProps) {
  return <button {...props} />;
}
```

**2. Spread remaining props** — Always spread `...rest` onto the root element so consumers can pass `className`, `data-*`, `aria-*`, etc.

```tsx
const { sentiment, emphasis, size, children, ...rest } = props;
return <button data-sentiment={sentiment} {...rest}>{children}</button>;
```

**3. Use `useMemo` / `useCallback` for expensive computations and stable references** — but don't over-memoize. Memoize when:
- Computing derived data from props
- Passing callbacks to memoized children
- Creating objects/arrays passed as props

### P2 — Should fix

**4. Prefer composition over configuration** — Use children and slots instead of render props or large config objects.

```tsx
// ✅ Composition
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>

// ❌ Configuration
<Card header="Title" body="Content" />
```

**5. Server Component boundaries** — Design system components that use hooks, event handlers, or browser APIs need `'use client'`. Pure display components can be Server Components.

```tsx
// Badge — no interactivity, can be Server Component
export function Badge({ sentiment, children }: BadgeProps) {
  return <span data-sentiment={sentiment}>{children}</span>;
}

// Button — has onClick, needs 'use client'
'use client';
export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

**6. Use `key` correctly** — Keys identify list items. Never use array index as key when items can reorder, be added, or removed.

### P3 — Nice to have

**7. Custom hooks for complex state** — Extract stateful logic into custom hooks when it's reusable or complex.

**8. Prefer CSS for visual states** — Use `:hover`, `:focus-visible`, `[data-*]` selectors in CSS instead of `onMouseEnter`/`onMouseLeave` state in React.

**9. Lazy loading heavy components** — Use `React.lazy()` + `Suspense` for components not needed on initial render.

## Audit Checklist

| Check | Severity |
|-------|----------|
| Missing forwardRef on leaf component | P1 |
| Not spreading ...rest | P1 |
| Unnecessary re-renders (missing memo/useMemo) | P2 |
| Configuration over composition | P2 |
| Missing 'use client' on interactive component | P2 |
| Array index as key in dynamic list | P2 |
| Hover/focus state managed in React instead of CSS | P3 |
