import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import Button from '../button/index.js';

var COOKIES_EXIT_DURATION = 150;

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

export default function Cookies(props) {
  var className = props.className;
  var closeOnPrimaryAction = props.closeOnPrimaryAction !== undefined ? props.closeOnPrimaryAction : true;
  var description = props.description !== undefined ? props.description : 'Описание';
  var heading = props.heading !== undefined ? props.heading : 'Заголовок';
  var onClose = props.onClose;
  var onPrimaryAction = props.onPrimaryAction;
  var onSecondaryAction = props.onSecondaryAction;
  var placement = props.placement !== undefined ? props.placement : 'inline';
  var previewState = props.previewState !== undefined ? props.previewState : 'shown';
  var primaryActionLabel = props.primaryActionLabel !== undefined ? props.primaryActionLabel : 'Принять';
  var secondaryActionLabel = props.secondaryActionLabel !== undefined ? props.secondaryActionLabel : 'Настройки';
  var size = props.size !== undefined ? props.size : 's';

  var restProps = Object.assign({}, props);
  delete restProps.className;
  delete restProps.closeOnPrimaryAction;
  delete restProps.description;
  delete restProps.heading;
  delete restProps.onClose;
  delete restProps.onPrimaryAction;
  delete restProps.onSecondaryAction;
  delete restProps.placement;
  delete restProps.previewState;
  delete restProps.primaryActionLabel;
  delete restProps.secondaryActionLabel;
  delete restProps.size;

  var isClosingState = useState(false);
  var isClosing = isClosingState[0];
  var setIsClosing = isClosingState[1];

  var closeTimerRef = useRef(null);

  var resolvedPreviewState = isClosing ? 'closing' : previewState;

  function clearCloseTimer() {
    if (closeTimerRef.current === null) {
      return;
    }
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function requestClose() {
    if (!onClose || isClosing || previewState === 'closing') {
      return;
    }
    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(function () {
      closeTimerRef.current = null;
      onClose();
    }, COOKIES_EXIT_DURATION);
  }

  function handlePrimaryAction() {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
    if (closeOnPrimaryAction) {
      requestClose();
    }
  }

  useEffect(function () {
    return clearCloseTimer;
  }, []);

  var hasActions = primaryActionLabel || secondaryActionLabel;

  return (
    <div
      {...restProps}
      className={joinClassNames('rshb-legacy-cookies', className)}
      data-placement={placement}
      data-preview-state={resolvedPreviewState}
      data-size={size}
    >
      <div className="rshb-legacy-cookies__content">
        {heading ? <p className="rshb-legacy-cookies__title">{heading}</p> : null}
        <p className="rshb-legacy-cookies__description">{description}</p>
      </div>
      {hasActions ? (
        <div className="rshb-legacy-cookies__actions">
          {primaryActionLabel ? (
            <Button onClick={handlePrimaryAction} size="s" variant="brand">
              {primaryActionLabel}
            </Button>
          ) : null}
          {secondaryActionLabel ? (
            <Button onClick={onSecondaryAction} size="s" variant="normal">
              {secondaryActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
