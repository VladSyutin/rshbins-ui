import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../../../src/templates/authentication/authentication-email-confirmation/AuthenticationEmailConfirmation.scss';
import Button from '../../../components/button/index.js';
import InputCodeItem from '../../../components/input-code-item/index.js';
import Header from '../../../components/header/index.js';
import NewCodeHasBeenSent from '../../../dialogs/toasts/new-code-has-been-sent/index.js';

var RESEND_TIMEOUT_SECONDS = 60;

function renderViewportToast(toast) {
  if (typeof document === 'undefined') { return null; }
  return createPortal(toast, document.body);
}

export default function AuthenticationEmailConfirmation(props) {
  var brandButtonProps = props.brandButtonProps;
  var className = props.className;
  var codeInputProps = props.codeInputProps;
  var device = props.device !== undefined ? props.device : 'auto';
  var email = props.email;
  var emailMode = props.emailMode !== undefined ? props.emailMode : 'visible';
  var hiddenEmail = props.hiddenEmail !== undefined ? props.hiddenEmail : 's******i@r*****s.ru';
  var onChangeEmail = props.onChangeEmail;
  var resendButtonLabel = props.resendButtonLabel !== undefined ? props.resendButtonLabel : 'Получить новый код';
  var resendButtonProps = props.resendButtonProps;
  var safetyLabel = props.safetyLabel !== undefined ? props.safetyLabel : 'Никому не сообщайте код.';
  var themeProps = props.themeProps;
  var title = props.title !== undefined ? props.title : 'Введите код из письма';

  var secondsLeftState = useState(RESEND_TIMEOUT_SECONDS - 1);
  var secondsLeft = secondsLeftState[0];
  var setSecondsLeft = secondsLeftState[1];
  var toastKeyState = useState(0);
  var toastKey = toastKeyState[0];
  var setToastKey = toastKeyState[1];

  var resolvedEmail = emailMode === 'hidden' ? hiddenEmail : email;
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
      className={['rshb-authentication-email-confirmation', className].filter(Boolean).join(' ')}
      data-device={device}
      data-email-mode={emailMode}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-email-confirmation__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-email-confirmation__heading">
        <h1 className="rshb-authentication-email-confirmation__title">{title}</h1>

        <p className="rshb-authentication-email-confirmation__description">
          <span>Отправили по адресу </span>
          <span className="rshb-authentication-email-confirmation__email">{resolvedEmail}</span>
          {emailMode === 'visible' ? (
            <>
              {' '}
              <button
                className="rshb-authentication-email-confirmation__link-button"
                onClick={onChangeEmail}
                type="button"
              >
                Изм.
              </button>
            </>
          ) : null}
        </p>
      </div>

      <div className="rshb-authentication-email-confirmation__code-group">
        <InputCodeItem
          {...codeInputProps}
          className="rshb-authentication-email-confirmation__code"
          showComplementaryText={(codeInputProps && codeInputProps.showComplementaryText !== undefined) ? codeInputProps.showComplementaryText : false}
        />
        <p className="rshb-authentication-email-confirmation__safety">{safetyLabel}</p>
      </div>

      <Button
        {...resendButtonProps}
        className={['rshb-authentication-email-confirmation__action', resendButtonProps && resendButtonProps.className].filter(Boolean).join(' ')}
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
