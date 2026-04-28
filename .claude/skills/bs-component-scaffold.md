---
name: bs-component-scaffold
description: >-
  Scaffold a new design system component with full boilerplate. Generates
  React .tsx, .css, .stories.tsx, .test.tsx, .types.ts, and index.ts using
  the dimensional model vocabulary and CSS custom properties. Use when
  creating a new component from scratch or generating the standard file
  structure for a component directory. Appropriate whenever you need a
  starting point that follows design system conventions rather than writing
  files manually.
---

# Component Scaffold

## Foundations (read first)

- [DIMENSIONAL-MODEL](_foundations/DIMENSIONAL-MODEL.md)
- [TOKEN-ARCHITECTURE](_foundations/TOKEN-ARCHITECTURE.md)

## Inputs

- **Component name** (kebab-case, e.g. `status-indicator`)
- **Dimensions needed** -- determined by component-api decision framework

## File Manifest

| File | Purpose | Key Contents |
|------|---------|-------------|
| `{name}.tsx` | React component with props interface | forwardRef, data-* attributes, rest spread |
| `{name}.types.ts` | Type unions for each dimension | String unions, Props interface |
| `{name}.css` | Styles with CSS custom properties + `data-*` selectors | Seven-section order, no margin |
| `{name}.stories.tsx` | Storybook stories (CSF3, autodocs) | Dimension grids, all combinations |
| `{name}.test.tsx` | Unit + jest-axe tests | Contract tests, a11y layer |
| `index.ts` | Barrel export | Named exports only |

## Dimension Decision Matrix

| Question | Yes --> Dimension | Modes |
|----------|-------------------|-------|
| Interactive? | `state` + `emphasis` | state: rest/hover/active/selected/disabled/resolving; emphasis: high/medium/low |
| Conveys meaning? | `sentiment` | neutral/warning/highlight/new/success/error |
| Has size variants? | `size` | xs/sm/md/lg/xl |

## Size Scale Reference

| Mode | Height | Padding-inline | Gap | Icon Size | Font Size |
|------|--------|----------------|-----|-----------|-----------|
| `xs` | 24px | 6px | 4px | 12px | 12px |
| `sm` | 32px | 10px | 6px | 14px | 13px |
| `md` | 40px | 14px | 8px | 16px | 14px |
| `lg` | 48px | 18px | 10px | 18px | 16px |
| `xl` | 56px | 22px | 12px | 20px | 18px |

## Component Template (.tsx)

```tsx
'use client';
import { forwardRef } from 'react';
import type { {PascalName}Props } from './{kebab-name}.types';
import './{kebab-name}.css';

const {PascalName} = forwardRef<HTML{Element}Element, {PascalName}Props>(
  function {PascalName}(
    {
      emphasis = 'medium',
      sentiment = 'neutral',
      size = 'md',
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <{element}
        ref={ref}
        data-emphasis={emphasis}
        data-sentiment={sentiment}
        data-size={size}
        className="{kebab-name}"
        {...rest}
      >
        {children}
      </{element}>
    );
  },
);

export { {PascalName} };
export type { {PascalName}Props };
```

## Types Template (.types.ts)

```tsx
import type { ComponentPropsWithRef } from 'react';

type Emphasis = 'high' | 'medium' | 'low';
type Sentiment = 'neutral' | 'warning' | 'highlight' | 'new' | 'success' | 'error';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface {PascalName}Props extends ComponentPropsWithRef<'{element}'> {
  emphasis?: Emphasis;
  sentiment?: Sentiment;
  size?: Size;
  children: React.ReactNode;
}
```

## CSS Template (.css)

```css
/* 1. Host -- layout invariants */
.{kebab-name} {
  display: inline-flex;
  align-items: center;
  gap: var(--{kebab-name}-gap);
  border: none;
  cursor: pointer;
}

/* 2. Rest state -- token reads */
.{kebab-name} {
  block-size: var(--{kebab-name}-height);
  padding-inline: var(--{kebab-name}-padding-x);
  background: var(--{kebab-name}-bg);
  color: var(--{kebab-name}-fg);
  border-radius: var(--{kebab-name}-radius);
}

/* 3. Interactive states -- pseudo-classes with :not() guards */
.{kebab-name}:hover:not([data-state="disabled"]):not([data-state="resolving"]) {
  background: var(--{kebab-name}-bg-hover);
}

/* 4. Programmatic states -- data-attribute selectors */
.{kebab-name}[data-state="disabled"] {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 5. Slot containers */
/* 6. Child elements */
/* 7. Motion */
.{kebab-name} {
  transition: background var(--duration-fast) var(--ease-out);
}
```

## Test Template (.test.tsx)

```tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { {PascalName} } from './{kebab-name}';

expect.extend(toHaveNoViolations);

describe('{PascalName}', () => {
  it('renders with defaults', () => {
    render(<{PascalName}>Label</{PascalName}>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('maps dimension props to data attributes', () => {
    const { container } = render(
      <{PascalName} emphasis="high" sentiment="error" size="lg">Label</{PascalName}>
    );
    const el = container.firstChild;
    expect(el).toHaveAttribute('data-emphasis', 'high');
    expect(el).toHaveAttribute('data-sentiment', 'error');
    expect(el).toHaveAttribute('data-size', 'lg');
  });

  it('has no axe violations', async () => {
    const { container } = render(<{PascalName}>Label</{PascalName}>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

## Variant Templates

The default template assumes a single interactive element (Button shape). Use these alternative starting points for other component shapes.

### Form Component (Input with label + error)

```tsx
'use client';
import { forwardRef, useId } from 'react';
import type { TextInputProps } from './text-input.types';
import './text-input.css';

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ label, helpText, errorMessage, size = 'md', ...rest }, ref) {
    const id = useId();
    const helpId = helpText ? `${id}-help` : undefined;
    const errorId = errorMessage ? `${id}-error` : undefined;
    return (
      <div className="text-input" data-size={size} data-state={errorMessage ? 'invalid' : undefined}>
        <label className="text-input__label" htmlFor={id}>{label}</label>
        <input
          ref={ref}
          id={id}
          className="text-input__control"
          aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={errorMessage ? 'true' : undefined}
          {...rest}
        />
        {helpText && <span id={helpId} className="text-input__help">{helpText}</span>}
        {errorMessage && <span id={errorId} className="text-input__error" role="alert">{errorMessage}</span>}
      </div>
    );
  },
);
```

### Composite Component (Accordion with sub-components)

```tsx
// accordion.tsx — owns shared state
const AccordionContext = createContext<AccordionContextValue | null>(null);

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion({ children, ...rest }, ref) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    return (
      <AccordionContext.Provider value={{ openItems, setOpenItems }}>
        <div ref={ref} className="accordion" {...rest}>{children}</div>
      </AccordionContext.Provider>
    );
  },
);

// accordion-item.tsx — consumes context
// accordion-trigger.tsx — button with aria-expanded
// accordion-panel.tsx — content region
```

### Overlay (Dialog)

```tsx
'use client';
const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog({ open, onClose, title, children, ...rest }, ref) {
    useEffect(() => {
      const el = (ref as React.RefObject<HTMLDialogElement>).current;
      if (el) open ? el.showModal() : el.close();
    }, [open, ref]);
    return (
      <dialog ref={ref} className="dialog" aria-labelledby="dialog-title" onClose={onClose} {...rest}>
        <h2 id="dialog-title" className="dialog__title">{title}</h2>
        <div className="dialog__body">{children}</div>
      </dialog>
    );
  },
);
```

## What to Customize First

After running the scaffold, work through this sequence:

1. **Swap the HTML element** — replace `{element}` with the correct native element (`button`, `a`, `div`, `input`, etc.).
2. **Remove unused dimensions** — delete `data-*` attributes and CSS selectors for dimensions that don't apply to this component.
3. **Wire token values in CSS** — replace placeholder `var(--{kebab-name}-*)` with the real token names defined in your token collections.
4. **Add slots** — if the component has icon slots or other pluggable areas, add `prefixIcon` / `suffixIcon` props and render positions.
5. **Implement keyboard interaction** — for B2+ components, add `onKeyDown` handler or delegate to CSS (prefer CSS for hover/focus states).

## File Naming Edge Cases

| Scenario | Convention |
|----------|-----------|
| Multi-word component | `status-indicator.tsx` → class name `StatusIndicator`, CSS class `.status-indicator` |
| Sub-components | Place in same directory: `accordion/accordion.tsx`, `accordion/accordion-item.tsx`, `accordion/accordion-trigger.tsx` |
| Compound component index | `accordion/index.ts` — exports `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel` |
| Shared types file | `accordion/accordion.types.ts` — define all sub-component prop types here |

## After Scaffold

1. Open in Storybook
2. Iterate on token values visually
3. Verify all dimension combinations
4. Check contrast ratios (4.5:1 text, 3:1 UI)
5. Run accessibility checks
6. Run `bs-review` for full audit

## Output Format Template

```
===========================================================
SCAFFOLD: {ComponentName}
===========================================================

FILES CREATED:
  [x] {path}/{kebab-name}.tsx
  [x] {path}/{kebab-name}.types.ts
  [x] {path}/{kebab-name}.css
  [x] {path}/{kebab-name}.stories.tsx
  [x] {path}/{kebab-name}.test.tsx
  [x] {path}/index.ts

DIMENSIONS:
  {dimension}: {modes} (default: {default})

NEXT STEPS:
  1. Run `npm run storybook` and verify rendering
  2. Wire up token values in CSS
  3. Run `bs-review` for full audit
===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `bs-component-api` | Run FIRST to decide dimensions, props, and slots before scaffolding |
| `bs-tokens` | After scaffold, define token collections for each dimension |
| `bs-css` | CSS file must follow seven-section order and all non-negotiables |
| `bs-react-patterns` | TSX file must follow forwardRef, rest spread, composition patterns |
| `bs-testing` | Test file structure follows three-layer strategy |
| `bs-storybook-docs` | After scaffold, generate comprehensive documentation stories |
| `bs-accessibility` | Run after scaffold to verify a11y compliance |

File layout and directory structure are project-configurable. See your project's design system documentation for the full component scaffolding reference.

## Self-review

Before declaring done, run the self-review protocol from `_foundations/SELF-REVIEW.md`.
