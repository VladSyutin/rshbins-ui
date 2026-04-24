import { useEffect, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './AuthenticationEmailConfirmation.scss';
import { Button } from '../../../button/Button';
import { InputCodeItem, type InputCodeItemProps } from '../../../input-code-item/InputCodeItem';
import { Header } from '../../../header/Header';
import type { ThemeProps } from '../../../theme/Theme';
import { NewCodeHasBeenSent } from '../../../../dialogs/toasts/new-code-has-been-sent/NewCodeHasBeenSent';

export type AuthenticationEmailConfirmationDevice = 'auto' | 'desktop' | 'mobile';
export type AuthenticationEmailConfirmationEmailMode = 'visible' | 'hidden';

const RESEND_TIMEOUT_SECONDS = 60;

export interface AuthenticationEmailConfirmationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  codeInputProps?: Omit<InputCodeItemProps, 'className'>;
  device?: AuthenticationEmailConfirmationDevice;
  email: ReactNode;
  emailMode?: AuthenticationEmailConfirmationEmailMode;
  hiddenEmail?: ReactNode;
  resendButtonLabel?: ReactNode;
  resendButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  safetyLabel?: ReactNode;
  themeProps?: Omit<ThemeProps, 'className'>;
  title?: ReactNode;
  onChangeEmail?: () => void;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function renderViewportToast(toast: ReactNode) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(toast, document.body);
}

/**
 * Email code confirmation template for authentication scenarios with visible or masked email addresses.
 */
export function AuthenticationEmailConfirmation({
  brandButtonProps,
  className,
  codeInputProps,
  device = 'auto',
  email,
  emailMode = 'visible',
  hiddenEmail = 's******i@r*****s.ru',
  onChangeEmail,
  resendButtonLabel = 'Получить новый код',
  resendButtonProps,
  safetyLabel = 'Никому не сообщайте код.',
  themeProps,
  title = 'Введите код из письма',
  ...props
}: AuthenticationEmailConfirmationProps) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT_SECONDS - 1);
  const [toastKey, setToastKey] = useState(0);
  const resolvedEmail = emailMode === 'hidden' ? hiddenEmail : email;
  const isResendWaiting = secondsLeft > 0;
  const resolvedResendLabel = isResendWaiting
    ? `Получить новый код через ${secondsLeft} сек`
    : resendButtonLabel;

  useEffect(() => {
    if (!isResendWaiting) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isResendWaiting]);

  function restartResendTimer() {
    setSecondsLeft(RESEND_TIMEOUT_SECONDS - 1);
  }

  return (
    <section
      {...props}
      className={joinClassNames('rshb-authentication-email-confirmation', className)}
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
          showComplementaryText={codeInputProps?.showComplementaryText ?? false}
        />
        <p className="rshb-authentication-email-confirmation__safety">{safetyLabel}</p>
      </div>

      <Button
        {...resendButtonProps}
        className={joinClassNames(
          'rshb-authentication-email-confirmation__action',
          resendButtonProps?.className
        )}
        disabled={isResendWaiting || resendButtonProps?.disabled}
        onClick={(event) => {
          resendButtonProps?.onClick?.(event);

          if (event.defaultPrevented || isResendWaiting) {
            return;
          }

          setToastKey((currentKey) => currentKey + 1);
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
              onClose={() => setToastKey(0)}
              placement="top-center"
            />
          )
        : null}
    </section>
  );
}
