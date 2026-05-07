import React from 'react';
import './styles.css';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

export default function Tab(props) {
  var className = props.className;
  var disabled = props.disabled != null ? props.disabled : false;
  var label = props.label;
  var leadingIcon = props.leadingIcon;
  var previewState = props.previewState || 'default';
  var role = props.role;
  var selected = props.selected != null ? props.selected : false;
  var trailingIcon = props.trailingIcon;
  var type = props.type || 'button';

  var rest = Object.assign({}, props);
  delete rest.className;
  delete rest.disabled;
  delete rest.label;
  delete rest.leadingIcon;
  delete rest.previewState;
  delete rest.role;
  delete rest.selected;
  delete rest.trailingIcon;
  delete rest.type;

  return (
    <button
      {...rest}
      aria-selected={selected}
      className={joinClassNames('rshb-legacy-tab', className)}
      data-preview-state={previewState}
      data-selected={selected ? 'true' : 'false'}
      disabled={disabled}
      role={role != null ? role : 'tab'}
      type={type}
    >
      {leadingIcon ? (
        <span aria-hidden="true" className="rshb-legacy-tab__icon">
          {leadingIcon}
        </span>
      ) : null}
      <span className="rshb-legacy-tab__label">{label}</span>
      {trailingIcon ? (
        <span aria-hidden="true" className="rshb-legacy-tab__icon">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}
