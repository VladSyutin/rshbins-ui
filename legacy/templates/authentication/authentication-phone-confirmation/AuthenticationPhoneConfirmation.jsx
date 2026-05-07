import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../../../src/templates/authentication/authentication-phone-confirmation/AuthenticationPhoneConfirmation.scss';
import Button from '../../../components/button/index.js';
import InputCodeItem from '../../../components/input-code-item/index.js';
import Header from '../../../components/header/index.js';
import NewCodeHasBeenSent from '../../../dialogs/toasts/new-code-has-been-sent/index.js';

var RESEND_TIMEOUT_SECONDS = 60;

function renderViewportToast(toast) {
  if (typeof document === 'undefined') { return null; }
  return createPortal(toast, document.body);
}

export default function AuthenticationPhoneConfirmation(props) {
  var brandButtonProps = props.brandButtonProps;
  var className = props.className;
  var codeInputProps = props.codeInputProps;
  var device = props.device !== undefined ? props.device : 'auto';
  var emailButtonLabel = props.emailButtonLabel !== undefined ? props.emailButtonLabel : 'Получить код на эл. почту';
  var emailButtonProps = props.emailButtonProps;
  var hiddenPhoneNumber = props.hiddenPhoneNumber !== undefined ? props.hiddenPhoneNumber : '+7 (***) ***-99-99';
  var onChangePhone = props.onChangePhone;
  var onRequestEmailCode = props.onRequestEmailCode;
  var phoneMode = props.phoneMode !== undefined ? props.phoneMode : 'visible';
  var phoneNumber = props.phoneNumber;
  var resendButtonLabel = props.resendButtonLabel !== undefined ? props.resendButtonLabel : 'Получить новый код';
  var resendButtonProps = props.resendButtonProps;
  var safetyLabel = props.safetyLabel !== undefined ? props.safetyLabel : 'Никому не сообщайте код.';
  var showEmailButton = props.showEmailButton !== undefined ? props.showEmailButton : true;
  var themeProps = props.themeProps;
  var title = props.title !== undefined ? props.title : 'Введите код из смс';

  var secondsLeftState = useState(RESEND_TIMEOUT_SECONDS - 1);
  var secondsLeft = secondsLeftState[0];
  var setSecondsLeft = secondsLeftState[1];
  var toastKeyState = useState(0);
  var toastKey = toastKeyState[0];
  var setToastKey = toastKeyState[1];

  var resolvedPhoneNumber = phoneMode === 'hidden' ? hiddenPhoneNumber : phoneNumber;
  var shouldShowEmailButton = phoneMode === 'visible' && showEmailButton;
  var isResendWaiting = secondsLeft > 0;
  var resolvedResendLabel = isResendWaiting
    ? ('Получить новый код через ' + secondsLeft + ' сек')
    : resendButtonLabel;

  useEffect(function () {
    if (!isResendWaiting) { return undefined; }
    var timerId = window.setInterval(function () {
      setSecondsLeft(function (currentSeconds) { return Math.max(currentSeconds - 1, 0); });
    }, 1000);
    return function () { window.clearInterval(timerId); };
  }, [isResendWaiting]);

  function restartResendTimer() {
    setSecondsLeft(RESEND_TIMEOUT_SECONDS - 1);
  }

  return (
    <section
      className={['rshb-authentication-phone-confirmation', className].filter(Boolean).join(' ')}
      data-device={device}
      data-phone-mode={phoneMode}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-phone-confirmation__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-phone-confirmation__heading">
        <h1 className="rshb-authentication-phone-confirmation__title">{title}</h1>

        <p className="rshb-authentication-phone-confirmation__description">
          <span className="rshb-authentication-phone-confirmation__description-prefix rshb-authentication-phone-confirmation__description-prefix--desktop">
            Отправили на номер{' '}
          </span>
          <span className="rshb-authentication-phone-confirmation__description-prefix rshb-authentication-phone-confirmation__description-prefix--mobile">
            Отправили на{' '}
          </span>
          <span className="rshb-authentication-phone-confirmation__phone">
            {resolvedPhoneNumber}
          </span>
          {phoneMode === 'visible' ? (
            <>
              {' '}
              <button
                className="rshb-authentication-phone-confirmation__link-button"
                onClick={onChangePhone}
                type="button"
              >
                Изм.
              </button>
            </>
          ) : null}
        </p>
      </div>

      <div className="rshb-authentication-phone-confirmation__code-group">
        <InputCodeItem
          {...codeInputProps}
          className="rshb-authentication-phone-confirmation__code"
          showComplementaryText={(codeInputProps && codeInputProps.showComplementaryText !== undefined) ? codeInputProps.showComplementaryText : false}
        />
        <p className="rshb-authentication-phone-confirmation__safety">{safetyLabel}</p>
      </div>

      <div className="rshb-authentication-phone-confirmation__actions">
        <Button
          {...resendButtonProps}
          className={['rshb-authentication-phone-confirmation__action', resendButtonProps && resendButtonProps.className].filter(Boolean).join(' ')}
          disabled={isResendWaiting || (resendButtonProps && resendButtonProps.disabled)}
          onClick={function (event) {
            if (resendButtonProps && resendButtonProps.onClick) { resendButtonProps.onClick(event); }
            if (event.defaultPrevented || isResendWaiting) { return; }
            setToastKey(function (currentKey) { return currentKey + 1; });
            restartResendTimer();
          }}
          size="m"
          type="button"
          variant="normal"
        >
          {resolvedResendLabel}
        </Button>

        {shouldShowEmailButton ? (
          <Button
            {...emailButtonProps}
            className={['rshb-authentication-phone-confirmation__action', emailButtonProps && emailButtonProps.className].filter(Boolean).join(' ')}
            onClick={function (event) {
              if (emailButtonProps && emailButtonProps.onClick) { emailButtonProps.onClick(event); }
              if (!event.defaultPrevented && onRequestEmailCode) { onRequestEmailCode(); }
            }}
            size="m"
            type="button"
            variant="flat-secondary"
          >
            {emailButtonLabel}
          </Button>
        ) : null}
      </div>

      {toastKey > 0
        ? renderViewportToast(
            <NewCodeHasBeenSent
              key={toastKey}
              onClose={function () { setToastKey(0); }}
              placement="top-center"
            />
          )
        : null}
    </section>
  );
}
