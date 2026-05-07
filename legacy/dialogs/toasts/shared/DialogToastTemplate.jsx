import React from 'react';
import Toast from '../../../components/toast/index.js';

export default function DialogToastTemplate(props) {
  var autoCloseDuration = props.autoCloseDuration !== undefined ? props.autoCloseDuration : 5000;
  var className = props.className;
  var closable = props.closable !== undefined ? props.closable : true;
  var closeLabel = props.closeLabel !== undefined ? props.closeLabel : 'Закрыть уведомление';
  var message = props.message;
  var onClose = props.onClose;
  var placement = props.placement !== undefined ? props.placement : 'inline';
  var previewState = props.previewState !== undefined ? props.previewState : 'shown';
  var variant = props.variant;

  return (
    <Toast
      autoCloseDuration={autoCloseDuration}
      className={className}
      closable={closable}
      closeLabel={closeLabel}
      onClose={onClose}
      placement={placement}
      previewState={previewState}
      variant={variant}
    >
      {message}
    </Toast>
  );
}
