import { useEffect, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './AuthenticationPhoneConfirmation.scss';
import { Button } from '../../../components/button/Button';
import { InputCodeItem, type InputCodeItemProps } from '../../../components/input-code-item/InputCodeItem';
import { Header } from '../../../components/header/Header';
import type { ThemeProps } from '../../../components/theme/Theme';
import { NewCodeHasBeenSent } from '../../../dialogs/toasts/new-code-has-been-sent/NewCodeHasBeenSent';

export type AuthenticationPhoneConfirmationDevice = 'auto' | 'desktop' | 'mobile';
export type AuthenticationPhoneConfirmationPhoneMode = 'visible' | 'hidden';

const RESEND_TIMEOUT_SECONDS = 60;

export interface AuthenticationPhoneConfirmationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  codeInputProps?: Omit<InputCodeItemProps, 'className'>;
  device?: AuthenticationPhoneConfirmationDevice;
  emailButtonLabel?: ReactNode;
  phoneMode?: AuthenticationPhoneConfirmationPhoneMode;
  phoneNumber: ReactNode;
  hiddenPhoneNumber?: ReactNode;
  resendButtonLabel?: ReactNode;
  safetyLabel?: ReactNode;
  showEmailButton?: boolean;
  title?: ReactNode;
  onChangePhone?: () => void;
  onRequestEmailCode?: () => void;
  resendButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  emailButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  themeProps?: Omit<ThemeProps, 'className'>;
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
 * SMS code confirmation template for authentication scenarios with visible or masked phone numbers.
 */
export function AuthenticationPhoneConfirmation({
  brandButtonProps,
  className,
  codeInputProps,
  device = 'auto',
  emailButtonLabel = 'Получить код на эл. почту',
  emailButtonProps,
  hiddenPhoneNumber = '+7 (***) ***-99-99',
  onChangePhone,
  onRequestEmailCode,
  phoneMode = 'visible',
  phoneNumber,
  resendButtonLabel = 'Получить новый код',
  resendButtonProps,
  safetyLabel = 'Никому не сообщайте код.',
  showEmailButton = true,
  themeProps,
  title = 'Введите код из смс',
  ...props
}: AuthenticationPhoneConfirmationProps) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT_SECONDS - 1);
  const [toastKey, setToastKey] = useState(0);
  const resolvedPhoneNumber = phoneMode === 'hidden' ? hiddenPhoneNumber : phoneNumber;
  const shouldShowEmailButton = phoneMode === 'visible' && showEmailButton;
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
      className={joinClassNames('rshb-authentication-phone-confirmation', className)}
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
          showComplementaryText={codeInputProps?.showComplementaryText ?? false}
        />
        <p className="rshb-authentication-phone-confirmation__safety">{safetyLabel}</p>
      </div>

      <div className="rshb-authentication-phone-confirmation__actions">
        <Button
          {...resendButtonProps}
          className={joinClassNames(
            'rshb-authentication-phone-confirmation__action',
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

        {shouldShowEmailButton ? (
          <Button
            {...emailButtonProps}
            className={joinClassNames(
              'rshb-authentication-phone-confirmation__action',
              emailButtonProps?.className
            )}
            onClick={(event) => {
              emailButtonProps?.onClick?.(event);

              if (!event.defaultPrevented) {
                onRequestEmailCode?.();
              }
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
              onClose={() => setToastKey(0)}
              placement="top-center"
            />
          )
        : null}
    </section>
  );
}
