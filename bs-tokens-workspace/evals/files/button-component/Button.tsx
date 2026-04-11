import { forwardRef } from 'react';
import type { ButtonProps } from './Button.types';
import './Button.css';

/**
 * Button — primary interactive element for triggering actions.
 *
 * Uses the dimensional model: sentiment, emphasis, state, size, structure.
 * All dimensions are expressed via `data-*` attributes for CSS targeting.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      sentiment = 'neutral',
      emphasis = 'high',
      state = 'rest',
      size = 'md',
      structure = 'standard',
      prefix,
      suffix,
      onClick,
      type = 'button',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = state === 'disabled' || state === 'resolving';

    return (
      <button
        ref={ref}
        type={type}
        className="btn"
        data-sentiment={sentiment}
        data-emphasis={emphasis}
        data-state={state}
        data-size={size}
        data-structure={structure}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={state === 'resolving' ? true : undefined}
        onClick={isDisabled ? undefined : onClick}
        {...rest}
      >
        {prefix && <span className="btn__prefix">{prefix}</span>}
        {structure !== 'icon-only' && (
          <span className="btn__label">{children}</span>
        )}
        {suffix && <span className="btn__suffix">{suffix}</span>}
        {state === 'resolving' && (
          <span className="btn__spinner" aria-hidden="true" />
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
