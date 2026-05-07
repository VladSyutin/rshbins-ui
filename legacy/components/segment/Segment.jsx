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

export default function Segment(props) {
  const {
    checked,
    className,
    defaultChecked,
    disabled,
    label,
    leadingIcon,
    onChange,
    previewState,
    readOnly,
    trailingIcon,
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
      className={joinClassNames('rshb-legacy-segment', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-preview-state={resolvedPreviewState}
      data-preview-status={previewStatus}
    >
      <input
        {...rest}
        checked={checked}
        className="rshb-legacy-segment__input"
        defaultChecked={defaultChecked}
        disabled={resolvedDisabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        type="radio"
      />
      <span className="rshb-legacy-segment__content">
        {leadingIcon ? <span className="rshb-legacy-segment__icon">{leadingIcon}</span> : null}
        <span className="rshb-legacy-segment__label">{label}</span>
        {trailingIcon ? <span className="rshb-legacy-segment__icon">{trailingIcon}</span> : null}
      </span>
    </label>
  );
}
