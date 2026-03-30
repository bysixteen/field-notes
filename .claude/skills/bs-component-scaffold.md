---
name: bs-component-scaffold
description: >-
  Scaffold a new design system component with full boilerplate. Generates
  React .tsx, .css, .stories.tsx, .test.tsx, .types.ts, and index.ts using
  the dimensional model vocabulary and CSS custom properties. Use when:
  "create a component", "scaffold X", "new component called Y", "generate
  component boilerplate", "build component from scratch", "bootstrap component",
  "stub out a component", "start a new component", "generate files for",
  "create boilerplate", "set up component structure", "init component",
  "make me a component", "add a new component to the design system",
  "component template", "component starter", "skeleton for component",
  "file structure for component", "what files do I need for a component",
  "generate component files", "component directory structure".
---

# Component Scaffold

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

Full documentation: [Component Scaffolding](/design-system/component-scaffolding)
