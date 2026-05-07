import React, { useEffect, useRef, useState } from 'react';
import '../../tokens/legacy-theme.css';
import './styles.css';
import Button from '../button/index.js';

var idCounter = 0;

function generateId() {
  return 'rshb-legacy-modal-' + (++idCounter);
}

var MODAL_EXIT_DURATION = 150;

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function ArrowRotateLeftIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.69743 14.5 1.97116 12.0377 1.55495 8.8484C1.50135 8.43767 1.79086 8.06126 2.20159 8.00766C2.61232 7.95405 2.98874 8.24357 3.04234 8.6543C3.36233 11.1063 5.46061 13 8 13C10.7614 13 13 10.7614 13 8C13 5.23858 10.7614 3 8 3C6.60162 3 5.33742 3.57344 4.42924 4.5H5.75C6.16421 4.5 6.5 4.83579 6.5 5.25C6.5 5.66421 6.16421 6 5.75 6H2.75C2.33579 6 2 5.66421 2 5.25V2.25C2 1.83579 2.33579 1.5 2.75 1.5C3.16421 1.5 3.5 1.83579 3.5 2.25V3.30964C4.66728 2.1896 6.25322 1.5 8 1.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M5.06066 9.93934C4.77936 9.65804 4.39782 9.5 4 9.5H2C1.72386 9.5 1.5 9.27614 1.5 9V7C1.5 6.72386 1.72386 6.5 2 6.5H4C4.39782 6.5 4.77936 6.34196 5.06066 6.06066L7.54289 3.57843C7.59311 3.52821 7.66122 3.5 7.73223 3.5C7.88012 3.5 8 3.61988 8 3.76777V12.2322C8 12.3801 7.88012 12.5 7.73223 12.5C7.66122 12.5 7.59311 12.4718 7.54289 12.4216L5.06066 9.93934ZM2 5H4L6.48223 2.51777C6.81375 2.18625 7.26339 2 7.73223 2C8.70854 2 9.5 2.79146 9.5 3.76777V12.2322C9.5 13.2085 8.70854 14 7.73223 14C7.26339 14 6.81375 13.8138 6.48223 13.4822L4 11H2C0.89543 11 0 10.1046 0 9V7C0 5.89543 0.895431 5 2 5ZM14.1617 13.1026C13.8974 13.4215 13.4194 13.4195 13.1265 13.1266C12.8336 12.8337 12.8376 12.3612 13.095 12.0367C13.9746 10.9279 14.5 9.52533 14.5 8.00005C14.5 6.47477 13.9746 5.0722 13.095 3.96341C12.8376 3.63892 12.8336 3.16642 13.1265 2.87353C13.4194 2.58063 13.8974 2.57858 14.1617 2.89746C15.3099 4.28234 16 6.0606 16 8.00005C16 9.93951 15.3099 11.7178 14.1617 13.1026ZM12.0244 10.9677C11.7783 11.3009 11.2981 11.2981 11.0052 11.0053C10.7123 10.7124 10.7207 10.2406 10.9449 9.89229C11.2962 9.3467 11.5 8.69718 11.5 8.00005C11.5 7.30292 11.2962 6.6534 10.9449 6.10782C10.7207 5.75955 10.7123 5.28774 11.0052 4.99485C11.2981 4.70195 11.7783 4.69919 12.0244 5.03236C12.6376 5.86242 13 6.88891 13 8.00005C13 9.11119 12.6376 10.1377 12.0244 10.9677Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function Modal(props) {
  var actions = props.actions;
  var captchaLabel = props.captchaLabel;
  var className = props.className;
  var children = props.children;
  var closeOnPrimaryAction = props.closeOnPrimaryAction !== undefined ? props.closeOnPrimaryAction : true;
  var closeOnTertiaryAction = props.closeOnTertiaryAction !== undefined ? props.closeOnTertiaryAction : true;
  var description = props.description !== undefined ? props.description : 'Что-то пошло не так. Пожалуйста, повторите попытку позже.';
  var heading = props.heading !== undefined ? props.heading : 'Ошибка';
  var inputPlaceholder = props.inputPlaceholder !== undefined ? props.inputPlaceholder : 'Название';
  var inputProps = props.inputProps;
  var onClose = props.onClose;
  var onPrimaryAction = props.onPrimaryAction;
  var onRefreshCaptcha = props.onRefreshCaptcha;
  var onSecondaryAction = props.onSecondaryAction;
  var onTertiaryAction = props.onTertiaryAction;
  var onVoiceCaptcha = props.onVoiceCaptcha;
  var placement = props.placement !== undefined ? props.placement : 'inline';
  var previewState = props.previewState !== undefined ? props.previewState : 'shown';
  var primaryActionLabel = props.primaryActionLabel;
  var role = props.role;
  var secondaryActionLabel = props.secondaryActionLabel;
  var tertiaryActionLabel = props.tertiaryActionLabel;
  var variant = props.variant !== undefined ? props.variant : 'default';

  var restProps = Object.assign({}, props);
  delete restProps.actions;
  delete restProps.captchaLabel;
  delete restProps.className;
  delete restProps.children;
  delete restProps.closeOnPrimaryAction;
  delete restProps.closeOnTertiaryAction;
  delete restProps.description;
  delete restProps.heading;
  delete restProps.inputPlaceholder;
  delete restProps.inputProps;
  delete restProps.onClose;
  delete restProps.onPrimaryAction;
  delete restProps.onRefreshCaptcha;
  delete restProps.onSecondaryAction;
  delete restProps.onTertiaryAction;
  delete restProps.onVoiceCaptcha;
  delete restProps.placement;
  delete restProps.previewState;
  delete restProps.primaryActionLabel;
  delete restProps.role;
  delete restProps.secondaryActionLabel;
  delete restProps.tertiaryActionLabel;
  delete restProps.variant;

  var isClosingState = useState(false);
  var isClosing = isClosingState[0];
  var setIsClosing = isClosingState[1];

  var closeTimerRef = useRef(null);

  var headingIdState = useState(function () { return generateId() + '-heading'; });
  var headingId = headingIdState[0];

  var descriptionIdState = useState(function () { return generateId() + '-description'; });
  var descriptionId = descriptionIdState[0];

  var resolvedPreviewState = isClosing ? 'closing' : previewState;
  var resolvedPrimaryActionLabel = primaryActionLabel != null
    ? primaryActionLabel
    : (variant === 'default' ? 'Закрыть' : 'Продолжить');
  var resolvedTertiaryActionLabel = tertiaryActionLabel != null
    ? tertiaryActionLabel
    : (variant === 'default' ? null : 'Закрыть');

  var shouldRenderInput = variant === 'captcha' || variant === 'text-input';
  var shouldRenderCaptcha = variant === 'captcha';

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
    }, MODAL_EXIT_DURATION);
  }

  function handlePrimaryAction() {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
    if (closeOnPrimaryAction) {
      requestClose();
    }
  }

  function handleTertiaryAction() {
    if (onTertiaryAction) {
      onTertiaryAction();
    }
    if (closeOnTertiaryAction) {
      requestClose();
    }
  }

  useEffect(function () {
    return clearCloseTimer;
  }, []);

  var resolvedActions = typeof actions === 'function'
    ? actions({ requestClose: requestClose })
    : actions;

  var modalContent = React.createElement(
    'div',
    Object.assign({}, restProps, {
      'aria-describedby': description ? descriptionId : undefined,
      'aria-labelledby': heading ? headingId : undefined,
      'aria-modal': placement === 'top-center' ? 'true' : undefined,
      className: joinClassNames('rshb-legacy-modal', className),
      'data-placement': placement,
      'data-preview-state': resolvedPreviewState,
      'data-variant': variant,
      role: role != null ? role : 'dialog'
    }),

    React.createElement(
      'div',
      { className: 'rshb-legacy-modal__copy' },
      heading
        ? React.createElement('p', { className: 'rshb-legacy-modal__title', id: headingId }, heading)
        : null,
      description
        ? React.createElement('p', { className: 'rshb-legacy-modal__description', id: descriptionId }, description)
        : null
    ),

    children != null ? children : React.createElement(
      React.Fragment,
      null,
      shouldRenderCaptcha
        ? React.createElement(
            'div',
            { className: 'rshb-legacy-modal__captcha' },
            React.createElement(
              'div',
              { 'aria-hidden': 'true', className: 'rshb-legacy-modal__captcha-symbols' },
              captchaLabel
                ? React.createElement('span', { className: 'rshb-legacy-modal__captcha-text' }, captchaLabel)
                : null
            ),
            React.createElement(Button, {
              'aria-label': 'Обновить капчу',
              className: 'rshb-legacy-modal__icon-action',
              iconOnly: true,
              leadingIcon: React.createElement(ArrowRotateLeftIcon),
              onClick: onRefreshCaptcha,
              variant: 'flat-primary'
            }),
            React.createElement(Button, {
              'aria-label': 'Озвучить капчу',
              className: 'rshb-legacy-modal__icon-action',
              iconOnly: true,
              leadingIcon: React.createElement(VolumeIcon),
              onClick: onVoiceCaptcha,
              variant: 'flat-primary'
            })
          )
        : null,
      shouldRenderInput
        ? React.createElement(
            'label',
            { className: 'rshb-legacy-modal__field' },
            React.createElement(
              'input',
              Object.assign({}, inputProps, {
                className: 'rshb-legacy-modal__input',
                placeholder: inputPlaceholder
              })
            )
          )
        : null
    ),

    resolvedActions != null ? resolvedActions : React.createElement(
      'div',
      { className: 'rshb-legacy-modal__actions' },
      resolvedPrimaryActionLabel
        ? React.createElement(
            Button,
            { className: 'rshb-legacy-modal__action-button', onClick: handlePrimaryAction, variant: 'brand' },
            resolvedPrimaryActionLabel
          )
        : null,
      secondaryActionLabel
        ? React.createElement(
            Button,
            { className: 'rshb-legacy-modal__action-button', onClick: onSecondaryAction, variant: 'normal' },
            secondaryActionLabel
          )
        : null,
      resolvedTertiaryActionLabel
        ? React.createElement(
            Button,
            { className: 'rshb-legacy-modal__action-button', onClick: handleTertiaryAction, variant: 'flat-primary' },
            resolvedTertiaryActionLabel
          )
        : null
    )
  );

  if (placement === 'top-center') {
    return React.createElement(
      'div',
      { className: 'rshb-legacy-modal-layer', 'data-preview-state': resolvedPreviewState },
      modalContent
    );
  }

  return modalContent;
}
