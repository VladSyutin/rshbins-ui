import type { HTMLAttributes, ReactNode } from 'react';
import './Divider.scss';

export type DividerView = 'text' | 'without-text';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  view?: DividerView;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Horizontal divider that visually separates content blocks and can optionally render a centered label.
 */
export function Divider({
  className,
  label = 'или',
  view = 'text',
  ...props
}: DividerProps) {
  const showsLabel = view === 'text';

  return (
    <div
      {...props}
      className={joinClassNames('rshb-divider', className)}
      data-view={view}
    >
      <span aria-hidden="true" className="rshb-divider__line" />
      {showsLabel ? <span className="rshb-divider__label">{label}</span> : null}
      <span aria-hidden="true" className="rshb-divider__line" />
    </div>
  );
}
