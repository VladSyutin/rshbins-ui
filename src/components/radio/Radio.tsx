import type { InputHTMLAttributes, ReactNode } from 'react';
import './Radio.scss';

export type RadioPreviewState = 'default' | 'hover' | 'focused';

type RadioVisualStatus = 'inactive' | 'active';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  label?: ReactNode;
  previewState?: RadioPreviewState;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function resolvePreviewStatus({
  checked,
  defaultChecked
}: Pick<RadioProps, 'checked' | 'defaultChecked'>): RadioVisualStatus {
  return Boolean(checked ?? defaultChecked) ? 'active' : 'inactive';
}

/**
 * Token-driven radio control translated from the Figma base radio component.
 */
export function Radio({
  checked,
  className,
  defaultChecked,
  disabled = false,
  label,
  onChange,
  previewState = 'default',
  readOnly,
  ...props
}: RadioProps) {
  const previewStatus = resolvePreviewStatus({
    checked,
    defaultChecked
  });
  const isControlled = checked !== undefined;
  const resolvedReadOnly = readOnly ?? (isControlled && onChange === undefined);

  return (
    <label
      className={joinClassNames('rshb-radio', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-preview-state={previewState}
      data-preview-status={previewStatus}
    >
      <input
        {...props}
        checked={checked}
        className="rshb-radio__input"
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        type="radio"
      />
      <span aria-hidden="true" className="rshb-radio__control">
        <span className="rshb-radio__dot" />
      </span>
      {label ? <span className="rshb-radio__label">{label}</span> : null}
    </label>
  );
}
