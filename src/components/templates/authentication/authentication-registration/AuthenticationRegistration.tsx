import {
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import './AuthenticationRegistration.scss';
import { Button, type ButtonProps } from '../../../button/Button';
import { Checkbox, type CheckboxProps } from '../../../checkbox/Checkbox';
import { Header } from '../../../header/Header';
import { InputEmail, isEmailValueValid, type InputEmailProps } from '../../../input-email/InputEmail';
import { InputInn, type InputInnProps } from '../../../input-inn/InputInn';
import { InputPhone, type InputPhoneProps } from '../../../input-phone/InputPhone';
import { Tabs } from '../../../tabs/Tabs';
import type { ThemeProps } from '../../../theme/Theme';
import arrowLeftIconUrl from '../../../../../icons/arrow-left.svg';

const PERSONAL_DATA_POLICY_URL =
  'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

export type AuthenticationRegistrationDevice = 'auto' | 'desktop' | 'mobile';
export type AuthenticationRegistrationMethod = 'email' | 'phone';

export interface AuthenticationRegistrationSubmitPayload {
  consentAccepted: boolean;
  inn: string;
  method: AuthenticationRegistrationMethod;
  value: string;
}

export interface AuthenticationRegistrationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit'> {
  backButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  consentCheckboxProps?: Omit<CheckboxProps, 'checked' | 'label'>;
  consentLabel?: ReactNode;
  defaultConsentAccepted?: boolean;
  defaultInn?: string;
  defaultMethod?: AuthenticationRegistrationMethod;
  defaultValue?: string;
  device?: AuthenticationRegistrationDevice;
  emailInputProps?: Omit<InputEmailProps, 'label' | 'value'>;
  innInputProps?: Omit<InputInnProps, 'label' | 'value'>;
  method?: AuthenticationRegistrationMethod;
  onBack?: () => void;
  onConsentChange?: (checked: boolean) => void;
  onMethodChange?: (method: AuthenticationRegistrationMethod) => void;
  onPersonalDataClick?: () => void;
  onSubmit?: (payload: AuthenticationRegistrationSubmitPayload) => void;
  phoneInputProps?: Omit<InputPhoneProps, 'label' | 'value'>;
  registerButtonProps?: Omit<ButtonProps, 'children' | 'type'>;
  registerButtonLabel?: ReactNode;
  themeProps?: Omit<ThemeProps, 'className'>;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function getDigitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function isInnValid(value: string): boolean {
  const digits = getDigitsOnly(value);

  return digits.length === 10 || digits.length === 12;
}

function buildDefaultConsentLabel(onPersonalDataClick?: () => void): ReactNode {
  return (
    <>
      Соглашаюсь на{' '}
      <a
        className="rshb-authentication-registration__link-button"
        href={PERSONAL_DATA_POLICY_URL}
        onClick={onPersonalDataClick}
        rel="noreferrer"
        target="_blank"
      >
        передачу и обработку
      </a>{' '}
      персональных данных.
    </>
  );
}

type ArrowLeftIconStyle = CSSProperties & {
  '--rshb-authentication-registration-back-icon-url': string;
};

function ArrowLeftIcon() {
  return (
    <span
      aria-hidden="true"
      className="rshb-authentication-registration__back-icon"
      style={{
        '--rshb-authentication-registration-back-icon-url': `url("${arrowLeftIconUrl}")`
      } as ArrowLeftIconStyle}
    />
  );
}

/**
 * Registration template translated from the Figma authentication flow for email and phone sign-up.
 */
export function AuthenticationRegistration({
  backButtonProps,
  brandButtonProps,
  className,
  consentCheckboxProps,
  consentLabel,
  defaultConsentAccepted = false,
  defaultInn = '',
  defaultMethod = 'email',
  defaultValue = '',
  device = 'auto',
  emailInputProps,
  innInputProps,
  method,
  onBack,
  onConsentChange,
  onMethodChange,
  onPersonalDataClick,
  onSubmit,
  phoneInputProps,
  registerButtonProps,
  registerButtonLabel = 'Зарегистрироваться',
  themeProps,
  ...props
}: AuthenticationRegistrationProps) {
  const isMethodControlled = method !== undefined;
  const [internalMethod, setInternalMethod] =
    useState<AuthenticationRegistrationMethod>(defaultMethod);
  const [inn, setInn] = useState(defaultInn);
  const [registrationValue, setRegistrationValue] = useState(defaultValue);
  const [consentAccepted, setConsentAccepted] = useState(defaultConsentAccepted);

  const resolvedMethod = method ?? internalMethod;
  const resolvedConsentLabel = consentLabel ?? buildDefaultConsentLabel(onPersonalDataClick);
  const description =
    resolvedMethod === 'phone'
      ? 'Введите ИНН и номер телефона, которые были указаны при оформлении полиса'
      : 'Введите ИНН и адрес электронной почты, которые были указаны при оформлении полиса';
  const canSubmit =
    isInnValid(inn) &&
    (resolvedMethod === 'phone'
      ? getDigitsOnly(registrationValue).length === 10
      : isEmailValueValid(registrationValue)) &&
    consentAccepted;

  function handleMethodChange(nextValue: string) {
    const nextMethod = nextValue === 'phone' ? 'phone' : 'email';

    if (!isMethodControlled) {
      setInternalMethod(nextMethod);
    }

    setRegistrationValue('');
    onMethodChange?.(nextMethod);
  }

  function handleConsentChange(event: ChangeEvent<HTMLInputElement>) {
    const nextChecked = event.target.checked;

    setConsentAccepted(nextChecked);
    onConsentChange?.(nextChecked);
    consentCheckboxProps?.onChange?.(event);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit?.({
      consentAccepted,
      inn,
      method: resolvedMethod,
      value: registrationValue
    });
  }

  return (
    <section
      {...props}
      className={joinClassNames('rshb-authentication-registration', className)}
      data-device={device}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-registration__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-registration__content">
        <div className="rshb-authentication-registration__heading">
          <Button
            {...backButtonProps}
            aria-label={backButtonProps?.['aria-label'] ?? 'Вернуться назад'}
            className={joinClassNames(
              'rshb-authentication-registration__back',
              backButtonProps?.className
            )}
            iconOnly
            leadingIcon={<ArrowLeftIcon />}
            onClick={(event) => {
              backButtonProps?.onClick?.(event);

              if (!event.defaultPrevented) {
                onBack?.();
              }
            }}
            size="s"
            type="button"
            variant="flat-primary"
          />

          <h1 className="rshb-authentication-registration__title">Регистрация</h1>

          <Tabs
            className="rshb-authentication-registration__tabs"
            onChange={(nextValue) => handleMethodChange(nextValue)}
            options={[
              {
                label: 'Электронная почта',
                value: 'email'
              },
              {
                label: 'Номер телефона',
                value: 'phone'
              }
            ]}
            value={resolvedMethod}
          />
        </div>

        <form
          className="rshb-authentication-registration__panel"
          onSubmit={handleSubmit}
        >
          <div className="rshb-authentication-registration__group">
            <p className="rshb-authentication-registration__description">{description}</p>

            <div className="rshb-authentication-registration__fields">
              <InputInn
                {...innInputProps}
                className={joinClassNames(
                  'rshb-authentication-registration__field',
                  innInputProps?.className
                )}
                label="ИНН"
                onValueChange={(nextValue) => {
                  setInn(nextValue);
                  innInputProps?.onValueChange?.(nextValue);
                }}
                value={inn}
              />

              {resolvedMethod === 'phone' ? (
                <InputPhone
                  {...phoneInputProps}
                  className={joinClassNames(
                    'rshb-authentication-registration__field',
                    phoneInputProps?.className
                  )}
                  label="Номер телефона"
                  onValueChange={(nextValue) => {
                    setRegistrationValue(nextValue);
                    phoneInputProps?.onValueChange?.(nextValue);
                  }}
                  value={registrationValue}
                />
              ) : (
                <InputEmail
                  {...emailInputProps}
                  className={joinClassNames(
                    'rshb-authentication-registration__field',
                    emailInputProps?.className
                  )}
                  label="Электронная почта"
                  onValueChange={(nextValue) => {
                    setRegistrationValue(nextValue);
                    emailInputProps?.onValueChange?.(nextValue);
                  }}
                  value={registrationValue}
                />
              )}
            </div>
          </div>

          <div className="rshb-authentication-registration__actions">
            <Checkbox
              {...consentCheckboxProps}
              checked={consentAccepted}
              className={joinClassNames(
                'rshb-authentication-registration__consent',
                consentCheckboxProps?.className
              )}
              label={resolvedConsentLabel}
              onChange={handleConsentChange}
              size="s"
            />

            <Button
              {...registerButtonProps}
              className={joinClassNames(
                'rshb-authentication-registration__action',
                registerButtonProps?.className
              )}
              disabled={!canSubmit || registerButtonProps?.disabled}
              type="submit"
              variant="brand"
            >
              {registerButtonLabel}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
