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

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="rshb-legacy-checkbox__mark-icon"
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

export default function Checkbox(props) {
  const {
    checked,
    className,
    defaultChecked,
    disabled,
    invalid,
    label,
    onChange,
    previewState,
    readOnly,
    size,
    ...rest
  } = props;

  const resolvedDisabled = Boolean(disabled);
  const resolvedInvalid = Boolean(invalid);
  const resolvedSize = size || 'm';
  const resolvedPreviewState = previewState || 'default';

  const previewStatus = resolvePreviewStatus({
    checked: checked,
    defaultChecked: defaultChecked,
    invalid: resolvedInvalid
  });

  const isControlled = checked !== undefined;
  const resolvedReadOnly =
    readOnly != null
      ? readOnly
      : isControlled && onChange == null;

  const inputProps = Object.assign({}, rest);
  delete inputProps.previewState;

  return (
    <label
      className={joinClassNames('rshb-legacy-checkbox', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-preview-state={resolvedPreviewState}
      data-preview-status={previewStatus}
      data-size={resolvedSize}
    >
      <input
        {...inputProps}
        aria-invalid={resolvedInvalid || undefined}
        checked={checked}
        className="rshb-legacy-checkbox__input"
        defaultChecked={defaultChecked}
        disabled={resolvedDisabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        type="checkbox"
      />
      <span aria-hidden="true" className="rshb-legacy-checkbox__control">
        <span className="rshb-legacy-checkbox__mark">
          <CheckIcon />
        </span>
      </span>
      {label != null ? (
        <span className="rshb-legacy-checkbox__label">{label}</span>
      ) : null}
    </label>
  );
}
