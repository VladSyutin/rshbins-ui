import React from 'react';
import './styles.css';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

export default function Divider(props) {
  var className = props.className;
  var label = props.label !== undefined ? props.label : 'или';
  var view = props.view !== undefined ? props.view : 'text';

  var restProps = Object.assign({}, props);
  delete restProps.className;
  delete restProps.label;
  delete restProps.view;

  var showsLabel = view === 'text';

  return (
    <div
      {...restProps}
      className={joinClassNames('rshb-legacy-divider', className)}
      data-view={view}
    >
      <span aria-hidden="true" className="rshb-legacy-divider__line" />
      {showsLabel ? <span className="rshb-legacy-divider__label">{label}</span> : null}
      <span aria-hidden="true" className="rshb-legacy-divider__line" />
    </div>
  );
}
