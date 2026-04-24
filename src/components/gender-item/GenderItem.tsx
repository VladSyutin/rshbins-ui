import type { InputHTMLAttributes, ReactNode } from 'react';
import './GenderItem.scss';

export type GenderItemPosition = 'left' | 'right';
export type GenderItemPreviewState = 'default' | 'hover' | 'focused';

type GenderItemVisualStatus = 'inactive' | 'active' | 'error';

export interface GenderItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  grouped?: boolean;
  invalid?: boolean;
  label: ReactNode;
  position?: GenderItemPosition;
  previewState?: GenderItemPreviewState;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function resolvePreviewStatus({
  checked,
  defaultChecked,
  invalid
}: Pick<GenderItemProps, 'checked' | 'defaultChecked' | 'invalid'>): GenderItemVisualStatus {
  const isChecked = Boolean(checked ?? defaultChecked);

  if (invalid && !isChecked) {
    return 'error';
  }

  return isChecked ? 'active' : 'inactive';
}

/**
 * Side-specific segmented option used by the Gender control.
 */
export function GenderItem({
  checked,
  className,
  defaultChecked,
  disabled = false,
  grouped = false,
  invalid = false,
  label,
  onChange,
  position = 'left',
  previewState = 'default',
  readOnly,
  ...props
}: GenderItemProps) {
  const previewStatus = resolvePreviewStatus({
    checked,
    defaultChecked,
    invalid
  });
  const isControlled = checked !== undefined;
  const resolvedReadOnly = readOnly ?? (isControlled && onChange === undefined);

  return (
    <label
      className={joinClassNames('rshb-gender-item', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-grouped={grouped ? 'true' : 'false'}
      data-position={position}
      data-preview-state={previewState}
      data-preview-status={previewStatus}
    >
      <input
        {...props}
        aria-invalid={invalid || undefined}
        checked={checked}
        className="rshb-gender-item__input"
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        type="radio"
      />
      <span className="rshb-gender-item__content">
        <span className="rshb-gender-item__label">{label}</span>
      </span>
    </label>
  );
}
