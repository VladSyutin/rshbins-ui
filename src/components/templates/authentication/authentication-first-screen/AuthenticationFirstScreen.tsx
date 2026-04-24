import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import './AuthenticationFirstScreen.scss';
import { Button, type ButtonProps } from '../../../button/Button';
import { Checkbox, type CheckboxProps } from '../../../checkbox/Checkbox';
import { Divider } from '../../../divider/Divider';
import { Header } from '../../../header/Header';
import { InputLogin, type InputLoginProps } from '../../../input-login/InputLogin';
import { InputPassword, type InputPasswordProps } from '../../../input-password/InputPassword';
import { InputPhone, type InputPhoneProps } from '../../../input-phone/InputPhone';
import { SegmentedControl } from '../../../segmented-control/SegmentedControl';
import type { ThemeProps } from '../../../theme/Theme';
import gosuslugiIconUrl from '../../../../../icons/gosuslugi.svg';

const PERSONAL_DATA_POLICY_URL =
  'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

export type AuthenticationClientType = 'individual' | 'corporate';
export type AuthenticationFirstScreenDevice = 'auto' | 'desktop' | 'mobile';

export interface IndividualSubmitPayload {
  consentAccepted: boolean;
  phone: string;
}

export interface CorporateSubmitPayload {
  login: string;
  password: string;
}

export interface AuthenticationFirstScreenProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  clientType?: AuthenticationClientType;
  consentCheckboxProps?: Omit<CheckboxProps, 'checked' | 'label'>;
  consentLabel?: ReactNode;
  defaultClientType?: AuthenticationClientType;
  defaultConsentAccepted?: boolean;
  defaultLogin?: string;
  defaultPassword?: string;
  defaultPhone?: string;
  device?: AuthenticationFirstScreenDevice;
  forgotCredentialsLabel?: ReactNode;
  gosuslugiButtonLabel?: ReactNode;
  loginButtonLabel?: ReactNode;
  loginButtonProps?: Omit<ButtonProps, 'children' | 'type'>;
  loginInputProps?: Omit<InputLoginProps, 'label' | 'onValueChange' | 'value'>;
  onClientTypeChange?: (clientType: AuthenticationClientType) => void;
  onCorporateSubmit?: (payload: CorporateSubmitPayload) => void;
  onForgotCredentials?: () => void;
  onGosuslugiLogin?: () => void;
  onIndividualSubmit?: (payload: IndividualSubmitPayload) => void;
  onPersonalDataClick?: () => void;
  onRegister?: () => void;
  passwordInputProps?: Omit<InputPasswordProps, 'label' | 'onValueChange' | 'value'>;
  phoneInputProps?: Omit<InputPhoneProps, 'label' | 'onValueChange' | 'value'>;
  registerButtonLabel?: ReactNode;
  themeProps?: Omit<ThemeProps, 'className'>;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function getDigitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function buildDefaultConsentLabel(onPersonalDataClick?: () => void): ReactNode {
  return (
    <>
      Соглашаюсь на{' '}
      <a
        className="rshb-authentication-first-screen__link-button rshb-authentication-first-screen__link-button--inline"
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

/**
 * Responsive authentication template with a built-in switch between individual and corporate sign-in flows.
 */
export function AuthenticationFirstScreen({
  brandButtonProps,
  className,
  clientType,
  consentCheckboxProps,
  consentLabel,
  defaultClientType = 'individual',
  defaultConsentAccepted = false,
  defaultLogin = '',
  defaultPassword = '',
  defaultPhone = '',
  device = 'auto',
  forgotCredentialsLabel = 'Забыли логин или пароль?',
  gosuslugiButtonLabel = 'Войти через Госуслуги',
  loginButtonLabel,
  loginButtonProps,
  loginInputProps,
  onClientTypeChange,
  onCorporateSubmit,
  onForgotCredentials,
  onGosuslugiLogin,
  onIndividualSubmit,
  onPersonalDataClick,
  onRegister,
  passwordInputProps,
  phoneInputProps,
  registerButtonLabel = 'Зарегистрироваться',
  themeProps,
  ...props
}: AuthenticationFirstScreenProps) {
  const generatedName = useId().replace(/:/g, '');
  const isControlled = clientType !== undefined;
  const [internalClientType, setInternalClientType] = useState<AuthenticationClientType>(
    defaultClientType
  );
  const [phone, setPhone] = useState(defaultPhone);
  const [login, setLogin] = useState(defaultLogin);
  const [password, setPassword] = useState(defaultPassword);
  const [consentAccepted, setConsentAccepted] = useState(defaultConsentAccepted);

  const resolvedClientType = clientType ?? internalClientType;
  const phoneDigits = getDigitsOnly(phone);
  const canSubmitIndividual = phoneDigits.length === 10 && consentAccepted;
  const canSubmitCorporate = login.trim().length > 0 && password.trim().length > 0;
  const resolvedLoginButtonLabel =
    loginButtonLabel ??
    (resolvedClientType === 'individual'
      ? 'Войти по номеру телефона'
      : 'Войти в личный кабинет');
  const gosuslugiIconStyle = {
    '--rshb-authentication-first-screen-icon-url': `url("${gosuslugiIconUrl}")`
  } as CSSProperties;

  function handleClientTypeChange(nextClientType: string) {
    const resolvedValue =
      nextClientType === 'corporate' ? 'corporate' : 'individual';

    if (!isControlled) {
      setInternalClientType(resolvedValue);
    }

    onClientTypeChange?.(resolvedValue);
  }

  function handleConsentChange(event: ChangeEvent<HTMLInputElement>) {
    setConsentAccepted(event.target.checked);
    consentCheckboxProps?.onChange?.(event);
  }

  function handleIndividualSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmitIndividual) {
      return;
    }

    onIndividualSubmit?.({
      consentAccepted,
      phone
    });
  }

  function handleCorporateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmitCorporate) {
      return;
    }

    onCorporateSubmit?.({
      login,
      password
    });
  }

  return (
    <section
      {...props}
      className={joinClassNames('rshb-authentication-first-screen', className)}
      data-device={device}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-first-screen__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-first-screen__content">
        <h1 className="rshb-authentication-first-screen__title">
          Вход в личный кабинет
        </h1>

        <SegmentedControl
          className="rshb-authentication-first-screen__type-switch"
          name={`authentication-first-screen-${generatedName}`}
          onChange={(nextValue) => handleClientTypeChange(nextValue)}
          options={[
            {
              label: (
                <>
                  <span className="rshb-authentication-first-screen__label-desktop">
                    Физическое лицо
                  </span>
                  <span className="rshb-authentication-first-screen__label-mobile">
                    Физ. лицо
                  </span>
                </>
              ),
              value: 'individual'
            },
            {
              label: (
                <>
                  <span className="rshb-authentication-first-screen__label-desktop">
                    Корпорат. клиент
                  </span>
                  <span className="rshb-authentication-first-screen__label-mobile">
                    Корпорат. клиент
                  </span>
                </>
              ),
              value: 'corporate'
            }
          ]}
          value={resolvedClientType}
        />

        {resolvedClientType === 'individual' ? (
          <form
            className="rshb-authentication-first-screen__panel"
            onSubmit={handleIndividualSubmit}
          >
            <div className="rshb-authentication-first-screen__group rshb-authentication-first-screen__group--tight">
              <Button
                className="rshb-authentication-first-screen__action"
                leadingIcon={
                  <span
                    aria-hidden="true"
                    className="rshb-authentication-first-screen__gosuslugi-icon"
                    style={gosuslugiIconStyle}
                  />
                }
                onClick={onGosuslugiLogin}
                variant="brand"
              >
                {gosuslugiButtonLabel}
              </Button>

              <Divider className="rshb-authentication-first-screen__divider" />

              <InputPhone
                {...phoneInputProps}
                className="rshb-authentication-first-screen__field"
                label="Номер телефона"
                onValueChange={setPhone}
                value={phone}
              />
            </div>

            <div className="rshb-authentication-first-screen__group">
              <Checkbox
                {...consentCheckboxProps}
                checked={consentAccepted}
                className={joinClassNames(
                  'rshb-authentication-first-screen__consent',
                  consentCheckboxProps?.className
                )}
                label={
                  consentLabel ?? buildDefaultConsentLabel(onPersonalDataClick)
                }
                onChange={handleConsentChange}
                size="s"
              />

              <Button
                {...loginButtonProps}
                className={joinClassNames(
                  'rshb-authentication-first-screen__action',
                  loginButtonProps?.className
                )}
                disabled={!canSubmitIndividual || loginButtonProps?.disabled}
                type="submit"
                variant="brand"
              >
                {resolvedLoginButtonLabel}
              </Button>
            </div>
          </form>
        ) : (
          <form
            className="rshb-authentication-first-screen__panel"
            onSubmit={handleCorporateSubmit}
          >
            <div className="rshb-authentication-first-screen__group rshb-authentication-first-screen__group--tight">
              <InputLogin
                {...loginInputProps}
                className="rshb-authentication-first-screen__field"
                label="Логин"
                onValueChange={setLogin}
                value={login}
              />
              <InputPassword
                {...passwordInputProps}
                className="rshb-authentication-first-screen__field"
                label="Пароль"
                onValueChange={setPassword}
                value={password}
              />

              <button
                className="rshb-authentication-first-screen__link-button"
                onClick={onForgotCredentials}
                type="button"
              >
                {forgotCredentialsLabel}
              </button>
            </div>

            <div className="rshb-authentication-first-screen__group rshb-authentication-first-screen__group--tight">
              <Button
                {...loginButtonProps}
                className={joinClassNames(
                  'rshb-authentication-first-screen__action',
                  loginButtonProps?.className
                )}
                disabled={!canSubmitCorporate || loginButtonProps?.disabled}
                type="submit"
                variant="brand"
              >
                {resolvedLoginButtonLabel}
              </Button>
              <Button
                className="rshb-authentication-first-screen__action"
                onClick={onRegister}
                type="button"
                variant="normal"
              >
                {registerButtonLabel}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
