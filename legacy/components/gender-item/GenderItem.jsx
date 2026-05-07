import React from 'react';
import './styles.css';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function resolvePreviewStatus(_ref) {
  const checked = _ref.checked;
  const defaultChecked = _ref.defaultChecked;
  const invalid = _ref.invalid;

  const isChecked = Boolean(checked != null ? checked : defaultChecked);

  if (invalid && !isChecked) {
    return 'error';
  }

  return isChecked ? 'active' : 'inactive';
}

export default function GenderItem(props) {
  const {
    checked,
    className,
    defaultChecked,
    disabled,
    grouped,
    invalid,
    label,
    onChange,
    position,
    previewState,
    readOnly,
    ...rest
  } = props;

  const resolvedDisabled = Boolean(disabled);
  const resolvedGrouped = Boolean(grouped);
  const resolvedInvalid = Boolean(invalid);
  const resolvedPosition = position || 'left';
  const resolvedPreviewState = previewState || 'default';

  const previewStatus = resolvePreviewStatus({
    checked: checked,
    defaultChecked: defaultChecked,
    invalid: resolvedInvalid
  });

  const isControlled = checked !== undefined;
  const resolvedReadOnly =
    readOnly != null ? readOnly : isControlled && onChange == null;

  return (
    <label
      className={joinClassNames('rshb-legacy-gender-item', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-grouped={resolvedGrouped ? 'true' : 'false'}
      data-position={resolvedPosition}
      data-preview-state={resolvedPreviewState}
      data-preview-status={previewStatus}
    >
      <input
        {...rest}
        aria-invalid={resolvedInvalid || undefined}
        checked={checked}
        className="rshb-legacy-gender-item__input"
        defaultChecked={defaultChecked}
        disabled={resolvedDisabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        type="radio"
      />
      <span className="rshb-legacy-gender-item__content">
        <span className="rshb-legacy-gender-item__label">{label}</span>
      </span>
    </label>
  );
}
