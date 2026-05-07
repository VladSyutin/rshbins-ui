import React from 'react';
import './styles.css';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function resolvePreviewStatus(_ref) {
  const checked = _ref.checked;
  const defaultChecked = _ref.defaultChecked;

  return Boolean(checked != null ? checked : defaultChecked) ? 'active' : 'inactive';
}

export default function Radio(props) {
  const {
    checked,
    className,
    defaultChecked,
    disabled,
    label,
    onChange,
    previewState,
    readOnly,
    ...rest
  } = props;

  const resolvedDisabled = Boolean(disabled);
  const resolvedPreviewState = previewState != null ? previewState : 'default';
  const previewStatus = resolvePreviewStatus({
    checked: checked,
    defaultChecked: defaultChecked
  });
  const isControlled = checked !== undefined;
  const resolvedReadOnly = readOnly != null ? readOnly : isControlled && onChange == null;

  return (
    <label
      className={joinClassNames('rshb-legacy-radio', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-preview-state={resolvedPreviewState}
      data-preview-status={previewStatus}
    >
      <input
        {...rest}
        checked={checked}
        className="rshb-legacy-radio__input"
        defaultChecked={defaultChecked}
        disabled={resolvedDisabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        type="radio"
      />
      <span aria-hidden="true" className="rshb-legacy-radio__control">
        <span className="rshb-legacy-radio__dot" />
      </span>
      {label ? <span className="rshb-legacy-radio__label">{label}</span> : null}
    </label>
  );
}
