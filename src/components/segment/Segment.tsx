import type { InputHTMLAttributes, ReactNode } from 'react';
import './Segment.scss';

export type SegmentPreviewState = 'default' | 'hover' | 'focused';

type SegmentVisualStatus = 'inactive' | 'active';

export interface SegmentProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  label: ReactNode;
  leadingIcon?: ReactNode;
  previewState?: SegmentPreviewState;
  trailingIcon?: ReactNode;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function resolvePreviewStatus({
  checked,
  defaultChecked
}: Pick<SegmentProps, 'checked' | 'defaultChecked'>): SegmentVisualStatus {
  return Boolean(checked ?? defaultChecked) ? 'active' : 'inactive';
}

/**
 * Token-driven segmented option built on top of native radio semantics.
 */
export function Segment({
  checked,
  className,
  defaultChecked,
  disabled = false,
  label,
  leadingIcon,
  onChange,
  previewState = 'default',
  readOnly,
  trailingIcon,
  ...props
}: SegmentProps) {
  const previewStatus = resolvePreviewStatus({
    checked,
    defaultChecked
  });
  const isControlled = checked !== undefined;
  const resolvedReadOnly = readOnly ?? (isControlled && onChange === undefined);

  return (
    <label
      className={joinClassNames('rshb-segment', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-preview-state={previewState}
      data-preview-status={previewStatus}
    >
      <input
        {...props}
        checked={checked}
        className="rshb-segment__input"
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        type="radio"
      />
      <span className="rshb-segment__content">
        {leadingIcon ? <span className="rshb-segment__icon">{leadingIcon}</span> : null}
        <span className="rshb-segment__label">{label}</span>
        {trailingIcon ? <span className="rshb-segment__icon">{trailingIcon}</span> : null}
      </span>
    </label>
  );
}
