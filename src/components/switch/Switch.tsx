import type { InputHTMLAttributes, ReactNode } from 'react';
import './Switch.scss';

export type SwitchPreviewState = 'default' | 'hover' | 'focused';

type SwitchVisualStatus = 'inactive' | 'active';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> {
  label?: ReactNode;
  previewState?: SwitchPreviewState;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function resolvePreviewStatus({
  checked,
  defaultChecked
}: Pick<SwitchProps, 'checked' | 'defaultChecked'>): SwitchVisualStatus {
  return Boolean(checked ?? defaultChecked) ? 'active' : 'inactive';
}

/**
 * Token-driven switch control translated from the Figma switch component.
 */
export function Switch({
  checked,
  className,
  defaultChecked,
  disabled = false,
  label,
  onChange,
  previewState = 'default',
  readOnly,
  ...props
}: SwitchProps) {
  const previewStatus = resolvePreviewStatus({
    checked,
    defaultChecked
  });
  const isControlled = checked !== undefined;
  const resolvedReadOnly = readOnly ?? (isControlled && onChange === undefined);

  return (
    <label
      className={joinClassNames('rshb-switch', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-preview-state={previewState}
      data-preview-status={previewStatus}
    >
      <input
        {...props}
        checked={checked}
        className="rshb-switch__input"
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        role="switch"
        type="checkbox"
      />
      <span aria-hidden="true" className="rshb-switch__control">
        <span className="rshb-switch__thumb" />
      </span>
      {label ? <span className="rshb-switch__label">{label}</span> : null}
    </label>
  );
}
