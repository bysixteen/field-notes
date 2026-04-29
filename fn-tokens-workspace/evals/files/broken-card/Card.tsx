import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import './Card.css';

export interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  title?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, header, footer, title, ...rest }, ref) => {
    return (
      <div ref={ref} className="card" {...rest}>
        {(header || title) && (
          <div className="card__header">
            {title && <h3 className="card__title">{title}</h3>}
            {header}
          </div>
        )}
        <div className="card__body">{children}</div>
        {footer && <div className="card__footer">{footer}</div>}
      </div>
    );
  },
);

Card.displayName = 'Card';
