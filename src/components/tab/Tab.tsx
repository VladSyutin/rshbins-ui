import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import './Tab.scss';

export type TabPreviewState = 'default' | 'hover' | 'focused';

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: ReactNode;
  leadingIcon?: ReactNode;
  previewState?: TabPreviewState;
  ref?: Ref<HTMLButtonElement>;
  selected?: boolean;
  trailingIcon?: ReactNode;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Token-driven tab item translated from the Figma `_Tab` component states.
 */
export function Tab({
  className,
  disabled = false,
  label,
  leadingIcon,
  previewState = 'default',
  ref,
  role,
  selected = false,
  trailingIcon,
  type = 'button',
  ...props
}: TabProps) {
  return (
    <button
      {...props}
      aria-selected={selected}
      className={joinClassNames('rshb-tab', className)}
      data-preview-state={previewState}
      data-selected={selected ? 'true' : 'false'}
      disabled={disabled}
      ref={ref}
      role={role ?? 'tab'}
      type={type}
    >
      {leadingIcon ? (
        <span aria-hidden="true" className="rshb-tab__icon">
          {leadingIcon}
        </span>
      ) : null}
      <span className="rshb-tab__label">{label}</span>
      {trailingIcon ? (
        <span aria-hidden="true" className="rshb-tab__icon">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}
