/** Sentiment — communicates the intent or tone of the action. */
export type ButtonSentiment = 'neutral' | 'warning' | 'highlight' | 'success' | 'error';

/** Emphasis — visual prominence within a layout. */
export type ButtonEmphasis = 'high' | 'medium' | 'low';

/** State — interactive state driven by user interaction or logic. */
export type ButtonState = 'rest' | 'hover' | 'active' | 'disabled' | 'resolving';

/** Size — physical footprint on the screen. */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Structure — layout variant of the button. */
export type ButtonStructure = 'standard' | 'icon-only' | 'split';

export interface ButtonProps {
  /** Primary label text. */
  children: React.ReactNode;

  /** Sentiment dimension — defaults to `'neutral'`. */
  sentiment?: ButtonSentiment;

  /** Emphasis dimension — defaults to `'high'`. */
  emphasis?: ButtonEmphasis;

  /** Interactive state — defaults to `'rest'`. */
  state?: ButtonState;

  /** Size dimension — defaults to `'md'`. */
  size?: ButtonSize;

  /** Structure dimension — defaults to `'standard'`. */
  structure?: ButtonStructure;

  /** Optional leading icon slot. */
  prefix?: React.ReactNode;

  /** Optional trailing icon slot. */
  suffix?: React.ReactNode;

  /** Click handler. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** HTML type attribute. */
  type?: 'button' | 'submit' | 'reset';

  /** Accessible label — required when `structure` is `'icon-only'`. */
  'aria-label'?: string;
}
