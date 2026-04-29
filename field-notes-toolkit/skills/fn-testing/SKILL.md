---
name: fn-testing
description: >-
  Review or write tests for design system components using the three-layer
  strategy: unit tests, accessibility automation, and visual regression. Use
  when writing tests, reviewing test coverage, deciding what to test, or
  setting up testing infrastructure for a component. Covers jest-axe, Testing
  Library patterns, userEvent, and Playwright/Chromatic visual testing. Also
  use when identifying testing gaps or deciding the right test approach for a
  given interaction.
---

# Testing Strategy

## Foundations (read first)

- [QUALITY-GATES](../_foundations/QUALITY-GATES.md)

## Three Layers

| Layer | Tool | Purpose | Catches |
|-------|------|---------|---------|
| 1. Unit Tests | Testing Library + Jest/Vitest | Component contract (inputs -> outputs) | Logic bugs, broken API |
| 2. Accessibility | jest-axe + @axe-core/playwright | Automated WCAG checks | ~30-40% of WCAG violations |
| 3. Visual Regression | Chromatic / Playwright screenshots | Screenshot comparison | Style regressions, layout shifts |

## Test Depth Decision Guidance

Not every component needs the same test depth. Use this to calibrate:

| Signal | Guidance |
|--------|---------|
| High-traffic component (Button, Input) | Exhaustive — test every dimension boundary, every interaction |
| Low-traffic component (Separator, Badge) | Minimal — defaults render, data attributes map correctly, axe passes |
| After a bug fix | Always add a test that would have caught the bug |
| Dimension with many modes | Test first and last mode, not every mode |
| No visual states beyond unit test coverage | Skip Layer 3 visual regression |

### Writing good test descriptions

Test names should describe **behaviour**, not implementation:

| Bad | Good |
|-----|------|
| `'sets disabled attribute'` | `'prevents click when disabled'` |
| `'renders with className'` | `'applies custom className to root element'` |
| `'onChange fires and updates state'` | `'calls onChange with new value on input'` |

**Rules:**
- If the test name has "and", split it into two tests — one assertion per test.
- Structure as Arrange / Act / Assert: setup, interaction, expectation.
- Describe the observable outcome from a consumer's perspective.

## Layer 1: Unit Tests

**Test these:**
| What | How |
|------|-----|
| Dimension props -> data attributes | `expect(el).toHaveAttribute('data-emphasis', 'high')` |
| Default prop values | Render bare, check data attributes |
| Disabled state behaviour | `expect(onClick).not.toHaveBeenCalled()` |
| Slot rendering | `expect(screen.getByTestId('prefix')).toBeInTheDocument()` |
| Event callbacks | `fireEvent.click(el); expect(onClick).toHaveBeenCalledTimes(1)` |
| Keyboard interaction | `fireEvent.keyDown(el, { key: 'Enter' })` |
| Conditional rendering | Render with/without optional props |
| Ref forwarding | `const ref = createRef(); render(<C ref={ref} />); expect(ref.current).toBeTruthy()` |
| Rest prop spreading | `render(<C data-testid="x" />); expect(screen.getByTestId('x'))` |

**Do NOT test:**
- Token values (CSS concerns)
- Internal implementation details
- React framework behaviour
- Storybook-specific rendering

## Layer 2: Accessibility Tests

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no axe violations', async () => {
  const { container } = render(<Component>Label</Component>);
  expect(await axe(container)).toHaveNoViolations();
});

it('has no axe violations when disabled', async () => {
  const { container } = render(<Component disabled>Label</Component>);
  expect(await axe(container)).toHaveNoViolations();
});

// For form components
it('has no axe violations with error state', async () => {
  const { container } = render(
    <Component aria-invalid="true" aria-describedby="err">
      <span id="err">Error message</span>
    </Component>
  );
  expect(await axe(container)).toHaveNoViolations();
});
```

## Layer 3: Visual Regression Snapshots

| Snapshot | What It Captures |
|----------|-----------------|
| All sentiments at default emphasis/size | Color correctness |
| All emphases at default sentiment/size | Weight differentiation |
| All sizes | Scale consistency |
| All programmatic states | State visual feedback |
| Dark theme | Theme token resolution |
| Slots populated vs empty | Layout with optional content |
| Error state | Validation visual feedback |

## Coverage by Bracket

| Bracket | Unit Tests | A11y Tests | Visual Tests |
|---------|-----------|-----------|-------------|
| **B1 Display** | Inputs + defaults, conditional render | jest-axe on all variants | All sentiments |
| **B2 Interactive** | + click/keyboard events, disabled | + keyboard navigation | + emphases x states |
| **B3 Form** | + value, validation, onChange | + label association, aria-invalid | + error states, focus |
| **B4 Composite** | + sub-component interaction | + keyboard nav (arrow keys) | + expanded/collapsed |
| **B5 Data** | + data rendering, empty state | + table semantics (caption, headers) | + empty state, loading |
| **B6 Overlay** | + focus trap, restore, Escape | + focus management, aria-modal | + backdrop, position |

## Test File Template

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';
import { ComponentName } from './component-name';

expect.extend(toHaveNoViolations);

describe('ComponentName', () => {
  // -- Rendering --
  it('renders with default props', () => {
    render(<ComponentName>Label</ComponentName>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  // -- Dimension mapping --
  it('maps dimension props to data attributes', () => {
    const { container } = render(
      <ComponentName emphasis="high" sentiment="error" size="lg">Label</ComponentName>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('data-emphasis', 'high');
    expect(el).toHaveAttribute('data-sentiment', 'error');
    expect(el).toHaveAttribute('data-size', 'lg');
  });

  // -- Defaults --
  it('applies default dimension values', () => {
    const { container } = render(<ComponentName>Label</ComponentName>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('data-emphasis', 'medium');
    expect(el).toHaveAttribute('data-sentiment', 'neutral');
    expect(el).toHaveAttribute('data-size', 'md');
  });

  // -- Ref forwarding --
  it('forwards ref to root element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ComponentName ref={ref}>Label</ComponentName>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // -- Rest spread --
  it('spreads rest props to root element', () => {
    render(<ComponentName data-testid="custom">Label</ComponentName>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  // -- Events (B2+) --
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<ComponentName onClick={onClick}>Label</ComponentName>);
    fireEvent.click(screen.getByText('Label'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // -- Disabled (B2+) --
  it('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    render(<ComponentName onClick={onClick} disabled>Label</ComponentName>);
    fireEvent.click(screen.getByText('Label'));
    expect(onClick).not.toHaveBeenCalled();
  });

  // -- Accessibility --
  it('has no axe violations', async () => {
    const { container } = render(<ComponentName>Label</ComponentName>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

## Test Maintenance

**When to update tests after a component change:**
- API change (prop renamed, new prop added) → update test assertions and descriptions
- Behaviour change (disabled no longer prevents click) → update the test that covers the old behaviour
- Bug fix → add a regression test, don't delete the existing test

**When to delete tests:**
- Feature was removed and the test only covers the removed behaviour
- Test was covering internal state that is no longer exposed

**Red flags in a test file:**
- Test that always passes regardless of component state (testing framework behaviour, not component behaviour)
- Test description doesn't match what the test actually checks
- Two tests that are identical except for a label — deduplicate
- Test that imports and asserts on internal functions or private state

## Audit Checklist

| Check | Severity |
|-------|----------|
| No unit tests exist | BLOCKING |
| No axe test | BLOCKING |
| Missing disabled state test (B2+) | SERIOUS |
| Missing keyboard test (B2+) | SERIOUS |
| Missing focus trap test (B6) | SERIOUS |
| Missing ref forwarding test | MODERATE |
| Missing rest spread test | MODERATE |
| No visual regression snapshots | MODERATE |
| Missing error state test (B3) | SERIOUS |
| Missing empty state test (B5) | MODERATE |

## Output Format Template

```
===========================================================
TEST AUDIT: {ComponentName}
Bracket: B{n} -- {BracketName}
Test file: {path}
===========================================================

LAYER 1 -- UNIT TESTS
  Coverage: {count}/{expected} checks
  Missing:
    - {description of missing test}

LAYER 2 -- ACCESSIBILITY
  axe test present: {Yes | No -- MUST ADD}
  States tested: {list of states with axe}

LAYER 3 -- VISUAL REGRESSION
  Snapshots: {count}/{expected}
  Missing:
    - {description of missing snapshot}

FINDINGS:
  [{BLOCKING|SERIOUS|MODERATE}] {description}
    Fix: {specific test to add with code snippet}

===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `fn-accessibility` | A11y audit findings should have corresponding Layer 2 tests |
| `fn-component-api` | API contract defines what Layer 1 tests must cover |
| `fn-react-patterns` | React patterns (forwardRef, rest spread) need dedicated tests |
| `fn-component-scaffold` | Scaffold generates initial test file following this strategy |
| `fn-review` | Review findings should be captured as regression tests |
| `fn-html` | Keyboard interaction patterns from HTML semantics define keyboard tests |

Test runner is project-dependent (Vitest, Jest, etc.). See your project's design system documentation for the full testing strategy reference.
