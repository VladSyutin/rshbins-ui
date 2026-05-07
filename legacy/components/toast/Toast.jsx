import React, { useEffect, useRef, useState } from 'react';
import '../../tokens/legacy-theme.css';
import './styles.css';

var TOAST_EXIT_DURATION = 150;

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 15.125 11.6875" width="14" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M14.7649 0.248285C15.1973 0.618939 15.2474 1.26997 14.8767 1.7024L6.62673 11.3274C6.43979 11.5455 6.17036 11.6757 5.88333 11.6868C5.59629 11.6978 5.31766 11.5886 5.11455 11.3855L0.302046 6.57297C-0.100682 6.17024 -0.100682 5.51729 0.302046 5.11456C0.704774 4.71184 1.35773 4.71184 1.76045 5.11456L5.7855 9.13961L13.3108 0.36014C13.6814 -0.0722897 14.3324 -0.122369 14.7649 0.248285Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function TriangleExclamationIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M7.13413 2.99449L2.21716 11.4995C1.83174 12.1662 2.31284 13 3.0829 13L12.9168 13C13.6869 13 14.168 12.1662 13.7826 11.4995L8.8656 2.99449C8.48057 2.32849 7.51915 2.3285 7.13413 2.99449ZM10.1642 2.24374C9.20163 0.578749 6.7981 0.578747 5.83552 2.24374L0.91856 10.7488C-0.0449811 12.4154 1.15775 14.5 3.0829 14.5L12.9168 14.5C14.842 14.5 16.0447 12.4154 15.0812 10.7488L10.1642 2.24374ZM7.99988 5.00003C8.41409 5.00003 8.74988 5.33582 8.74988 5.75003V7.75003C8.74988 8.16424 8.41409 8.50003 7.99988 8.50003C7.58566 8.50003 7.24988 8.16424 7.24988 7.75003V5.75003C7.24988 5.33582 7.58566 5.00003 7.99988 5.00003ZM8.99988 10.75C8.99988 11.3023 8.55216 11.75 7.99988 11.75C7.44759 11.75 6.99988 11.3023 6.99988 10.75C6.99988 10.1977 7.44759 9.75003 7.99988 9.75003C8.55216 9.75003 8.99988 10.1977 8.99988 10.75Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function XmarkIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M3.46967 3.46967C3.76256 3.17678 4.23744 3.17678 4.53033 3.46967L8 6.93934L11.4697 3.46967C11.7626 3.17678 12.2374 3.17678 12.5303 3.46967C12.8232 3.76256 12.8232 4.23744 12.5303 4.53033L9.06066 8L12.5303 11.4697C12.8232 11.7626 12.8232 12.2374 12.5303 12.5303C12.2374 12.8232 11.7626 12.8232 11.4697 12.5303L8 9.06066L4.53033 12.5303C4.23744 12.8232 3.76256 12.8232 3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L6.93934 8L3.46967 4.53033C3.17678 4.23744 3.17678 3.76256 3.46967 3.46967Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function Toast(props) {
  var autoCloseDuration = props.autoCloseDuration !== undefined ? props.autoCloseDuration : 5000;
  var children = props.children !== undefined ? props.children : 'Контент';
  var className = props.className;
  var closeLabel = props.closeLabel !== undefined ? props.closeLabel : 'Закрыть уведомление';
  var closable = props.closable !== undefined ? props.closable : true;
  var onClose = props.onClose;
  var placement = props.placement !== undefined ? props.placement : 'inline';
  var previewState = props.previewState !== undefined ? props.previewState : 'shown';
  var role = props.role;
  var variant = props.variant !== undefined ? props.variant : 'danger';

  var restProps = Object.assign({}, props);
  delete restProps.autoCloseDuration;
  delete restProps.children;
  delete restProps.className;
  delete restProps.closeLabel;
  delete restProps.closable;
  delete restProps.onClose;
  delete restProps.placement;
  delete restProps.previewState;
  delete restProps.role;
  delete restProps.variant;

  var isVisibleState = useState(true);
  var isVisible = isVisibleState[0];
  var setIsVisible = isVisibleState[1];

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
    if (isClosing || previewState === 'closing' || !isVisible) {
      return;
    }
    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(function () {
      closeTimerRef.current = null;
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, TOAST_EXIT_DURATION);
  }

  useEffect(function () {
    return clearCloseTimer;
  }, []);

  useEffect(function () {
    if (autoCloseDuration === null || resolvedPreviewState === 'closing' || !isVisible) {
      return undefined;
    }
    var timerId = window.setTimeout(requestClose, autoCloseDuration);
    return function () {
      window.clearTimeout(timerId);
    };
  }, [autoCloseDuration, isVisible, resolvedPreviewState]);

  if (!isVisible) {
    return null;
  }

  var resolvedRole = role != null ? role : (variant === 'danger' ? 'alert' : 'status');
  var StatusIcon = variant === 'success' ? CheckIcon : TriangleExclamationIcon;

  return (
    <div
      {...restProps}
      className={joinClassNames('rshb-legacy-toast', className)}
      data-placement={placement}
      data-preview-state={resolvedPreviewState}
      data-variant={variant}
      role={resolvedRole}
    >
      <span aria-hidden="true" className="rshb-legacy-toast__status-icon">
        <StatusIcon />
      </span>
      <span className="rshb-legacy-toast__content">{children}</span>
      {closable ? (
        <button
          aria-label={closeLabel}
          className="rshb-legacy-toast__close"
          onClick={requestClose}
          type="button"
        >
          <span aria-hidden="true" className="rshb-legacy-toast__close-icon">
            <XmarkIcon />
          </span>
        </button>
      ) : null}
    </div>
  );
}
