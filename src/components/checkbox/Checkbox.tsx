import type { InputHTMLAttributes, ReactNode } from 'react';
import './Checkbox.scss';

export type CheckboxSize = 'm' | 's';
export type CheckboxPreviewState = 'default' | 'hover' | 'focused';

type CheckboxVisualStatus = 'inactive' | 'active' | 'error';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  invalid?: boolean;
  label?: ReactNode;
  previewState?: CheckboxPreviewState;
  size?: CheckboxSize;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function resolvePreviewStatus({
  checked,
  defaultChecked,
  invalid
}: Pick<CheckboxProps, 'checked' | 'defaultChecked' | 'invalid'>): CheckboxVisualStatus {
  if (invalid && !Boolean(checked ?? defaultChecked)) {
    return 'error';
  }

  return Boolean(checked ?? defaultChecked) ? 'active' : 'inactive';
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="rshb-checkbox__mark-icon"
      fill="none"
      viewBox="0 0 16 12"
    >
      <path
        d="M1.5 6.5L5.5 10.5L14.5 1.5"
        stroke="var(--color-text-brand-on-brand)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * Token-driven checkbox control translated from the Figma base checkbox component.
 */
export function Checkbox({
  checked,
  className,
  defaultChecked,
  disabled = false,
  invalid = false,
  label,
  onChange,
  previewState = 'default',
  readOnly,
  size = 'm',
  ...props
}: CheckboxProps) {
  const previewStatus = resolvePreviewStatus({
    checked,
    defaultChecked,
    invalid
  });
  const isControlled = checked !== undefined;
  const resolvedReadOnly = readOnly ?? (isControlled && onChange === undefined);

  return (
    <label
      className={joinClassNames('rshb-checkbox', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-preview-state={previewState}
      data-preview-status={previewStatus}
      data-size={size}
    >
      <input
        {...props}
        aria-invalid={invalid || undefined}
        checked={checked}
        className="rshb-checkbox__input"
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        type="checkbox"
      />
      <span aria-hidden="true" className="rshb-checkbox__control">
        <span className="rshb-checkbox__mark">
          <CheckIcon />
        </span>
      </span>
      {label ? <span className="rshb-checkbox__label">{label}</span> : null}
    </label>
  );
}
