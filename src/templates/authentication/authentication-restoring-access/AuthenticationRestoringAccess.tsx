import {
  useEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import './AuthenticationRestoringAccess.scss';
import { Button, type ButtonProps } from '../../../components/button/Button';
import { Checkbox, type CheckboxProps } from '../../../components/checkbox/Checkbox';
import { Header } from '../../../components/header/Header';
import { InputEmail, isEmailValueValid, type InputEmailProps } from '../../../components/input-email/InputEmail';
import { InputInn, type InputInnProps } from '../../../components/input-inn/InputInn';
import { InputLogin, type InputLoginProps } from '../../../components/input-login/InputLogin';
import { InputPhone, type InputPhoneProps } from '../../../components/input-phone/InputPhone';
import { SegmentedControl } from '../../../components/segmented-control/SegmentedControl';
import { Tabs } from '../../../components/tabs/Tabs';
import type { ThemeProps } from '../../../components/theme/Theme';
import arrowLeftIconUrl from '../../../../icons/arrow-left.svg';

const PERSONAL_DATA_POLICY_URL =
  'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';
const MOBILE_BREAKPOINT_PX = 743;

export type AuthenticationRestoringAccessDevice = 'auto' | 'desktop' | 'mobile';
export type AuthenticationRestoringAccessFlow = 'password' | 'login';
export type AuthenticationRestoringAccessMethod = 'email' | 'phone';

export interface AuthenticationRestoringPasswordSubmitPayload {
  login: string;
}

export interface AuthenticationRestoringLoginSubmitPayload {
  consentAccepted: boolean;
  inn: string;
  method: AuthenticationRestoringAccessMethod;
  value: string;
}

export interface AuthenticationRestoringAccessProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit'> {
  backButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  consentCheckboxProps?: Omit<CheckboxProps, 'checked' | 'label'>;
  consentLabel?: ReactNode;
  defaultConsentAccepted?: boolean;
  defaultInn?: string;
  defaultLogin?: string;
  defaultLoginMethod?: AuthenticationRestoringAccessMethod;
  defaultRestoringFlow?: AuthenticationRestoringAccessFlow;
  defaultRestoringValue?: string;
  device?: AuthenticationRestoringAccessDevice;
  emailInputProps?: Omit<InputEmailProps, 'label' | 'onValueChange' | 'value'>;
  innInputProps?: Omit<InputInnProps, 'label' | 'onValueChange' | 'value'>;
  loginInputProps?: Omit<InputLoginProps, 'label' | 'onValueChange' | 'value'>;
  loginMethod?: AuthenticationRestoringAccessMethod;
  onBack?: () => void;
  onConsentChange?: (checked: boolean) => void;
  onLoginMethodChange?: (method: AuthenticationRestoringAccessMethod) => void;
  onPasswordSubmit?: (payload: AuthenticationRestoringPasswordSubmitPayload) => void;
  onPersonalDataClick?: () => void;
  onRestoringFlowChange?: (flow: AuthenticationRestoringAccessFlow) => void;
  onRestoringLoginSubmit?: (payload: AuthenticationRestoringLoginSubmitPayload) => void;
  phoneInputProps?: Omit<InputPhoneProps, 'label' | 'onValueChange' | 'value'>;
  restoringFlow?: AuthenticationRestoringAccessFlow;
  submitButtonProps?: Omit<ButtonProps, 'children' | 'type'>;
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
        className="rshb-authentication-restoring-access__link-button"
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
  '--rshb-authentication-restoring-access-back-icon-url': string;
};

function ArrowLeftIcon() {
  return (
    <span
      aria-hidden="true"
      className="rshb-authentication-restoring-access__back-icon"
      style={{
        '--rshb-authentication-restoring-access-back-icon-url': `url("${arrowLeftIconUrl}")`
      } as ArrowLeftIconStyle}
    />
  );
}

function getRestoringFlowLabel(
  flow: AuthenticationRestoringAccessFlow,
  isMobileLabels: boolean
): string {
  if (flow === 'password') {
    return isMobileLabels ? 'Восстан. пароля' : 'Восстанов. пароля';
  }

  return isMobileLabels ? 'Восстан. логина' : 'Восстанов. логина';
}

/**
 * Authentication recovery template matching the Figma restoring-access flows for password and login recovery.
 */
export function AuthenticationRestoringAccess({
  backButtonProps,
  brandButtonProps,
  className,
  consentCheckboxProps,
  consentLabel,
  defaultConsentAccepted = false,
  defaultInn = '',
  defaultLogin = '',
  defaultLoginMethod = 'email',
  defaultRestoringFlow = 'password',
  defaultRestoringValue = '',
  device = 'auto',
  emailInputProps,
  innInputProps,
  loginInputProps,
  loginMethod,
  onBack,
  onConsentChange,
  onLoginMethodChange,
  onPasswordSubmit,
  onPersonalDataClick,
  onRestoringFlowChange,
  onRestoringLoginSubmit,
  phoneInputProps,
  restoringFlow,
  submitButtonProps,
  themeProps,
  ...props
}: AuthenticationRestoringAccessProps) {
  const generatedName = useId().replace(/:/g, '');
  const isRestoringFlowControlled = restoringFlow !== undefined;
  const isLoginMethodControlled = loginMethod !== undefined;
  const [internalRestoringFlow, setInternalRestoringFlow] =
    useState<AuthenticationRestoringAccessFlow>(defaultRestoringFlow);
  const [internalLoginMethod, setInternalLoginMethod] =
    useState<AuthenticationRestoringAccessMethod>(defaultLoginMethod);
  const [login, setLogin] = useState(defaultLogin);
  const [inn, setInn] = useState(defaultInn);
  const [restoringValue, setRestoringValue] = useState(defaultRestoringValue);
  const [consentAccepted, setConsentAccepted] = useState(defaultConsentAccepted);
  const [isAutoMobileViewport, setIsAutoMobileViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT_PX : false
  );

  const resolvedRestoringFlow = restoringFlow ?? internalRestoringFlow;
  const resolvedLoginMethod = loginMethod ?? internalLoginMethod;
  const usesMobileFlowLabels =
    device === 'mobile' || (device === 'auto' && isAutoMobileViewport);
  const resolvedConsentLabel = consentLabel ?? buildDefaultConsentLabel(onPersonalDataClick);
  const passwordButtonLabel = 'Восстановить пароль';
  const loginButtonLabel = 'Восстановить логин';
  const restoringDescription =
    resolvedRestoringFlow === 'password'
      ? 'Введите логин, который был создан при регистрации'
      : resolvedLoginMethod === 'email'
        ? 'Введите ИНН и адрес электронной почты, которые были указаны при регистрации'
        : 'Введите ИНН и номер телефона, которые были указаны при регистрации';
  const canSubmitPassword = login.trim().length > 0;
  const canSubmitLogin =
    isInnValid(inn) &&
    (resolvedLoginMethod === 'phone'
      ? getDigitsOnly(restoringValue).length === 10
      : isEmailValueValid(restoringValue)) &&
    consentAccepted;

  useEffect(() => {
    if (device !== 'auto' || typeof window === 'undefined') {
      return undefined;
    }

    function handleResize() {
      setIsAutoMobileViewport(window.innerWidth <= MOBILE_BREAKPOINT_PX);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [device]);

  function handleRestoringFlowChange(nextValue: string) {
    const nextFlow = nextValue === 'login' ? 'login' : 'password';

    if (!isRestoringFlowControlled) {
      setInternalRestoringFlow(nextFlow);
    }

    onRestoringFlowChange?.(nextFlow);
  }

  function handleLoginMethodChange(nextValue: string) {
    const nextMethod = nextValue === 'phone' ? 'phone' : 'email';

    if (!isLoginMethodControlled) {
      setInternalLoginMethod(nextMethod);
    }

    onLoginMethodChange?.(nextMethod);
  }

  function handleConsentChange(event: ChangeEvent<HTMLInputElement>) {
    const nextChecked = event.target.checked;

    setConsentAccepted(nextChecked);
    onConsentChange?.(nextChecked);
    consentCheckboxProps?.onChange?.(event);
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmitPassword) {
      return;
    }

    onPasswordSubmit?.({
      login
    });
  }

  function handleRestoringLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmitLogin) {
      return;
    }

    onRestoringLoginSubmit?.({
      consentAccepted,
      inn,
      method: resolvedLoginMethod,
      value: restoringValue
    });
  }

  return (
    <section
      {...props}
      className={joinClassNames('rshb-authentication-restoring-access', className)}
      data-device={device}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-restoring-access__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-restoring-access__content">
        <div className="rshb-authentication-restoring-access__heading">
          <Button
            {...backButtonProps}
            aria-label={backButtonProps?.['aria-label'] ?? 'Вернуться назад'}
            className={joinClassNames(
              'rshb-authentication-restoring-access__back',
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

          <h1 className="rshb-authentication-restoring-access__title">
            Восстановление доступа
          </h1>
        </div>

        {resolvedRestoringFlow === 'password' ? (
          <form
            className="rshb-authentication-restoring-access__panel"
            onSubmit={handlePasswordSubmit}
          >
            <SegmentedControl
              className="rshb-authentication-restoring-access__switch"
              name={`authentication-restoring-flow-${generatedName}`}
              onChange={(nextValue) => handleRestoringFlowChange(nextValue)}
              options={[
                {
                  label: getRestoringFlowLabel('password', usesMobileFlowLabels),
                  value: 'password'
                },
                {
                  label: getRestoringFlowLabel('login', usesMobileFlowLabels),
                  value: 'login'
                }
              ]}
              value={resolvedRestoringFlow}
            />

            <div className="rshb-authentication-restoring-access__group">
              <p className="rshb-authentication-restoring-access__description">
                {restoringDescription}
              </p>

              <InputLogin
                {...loginInputProps}
                className={joinClassNames(
                  'rshb-authentication-restoring-access__field',
                  loginInputProps?.className
                )}
                label="Логин"
                onValueChange={setLogin}
                value={login}
              />
            </div>

            <Button
              {...submitButtonProps}
              className={joinClassNames(
                'rshb-authentication-restoring-access__action',
                submitButtonProps?.className
              )}
              disabled={!canSubmitPassword || submitButtonProps?.disabled}
              type="submit"
              variant="brand"
            >
              {passwordButtonLabel}
            </Button>
          </form>
        ) : (
          <form
            className="rshb-authentication-restoring-access__panel"
            onSubmit={handleRestoringLoginSubmit}
          >
            <div className="rshb-authentication-restoring-access__switch-group">
              <SegmentedControl
                className="rshb-authentication-restoring-access__switch"
                name={`authentication-restoring-flow-${generatedName}`}
                onChange={(nextValue) => handleRestoringFlowChange(nextValue)}
                options={[
                  {
                    label: getRestoringFlowLabel('password', usesMobileFlowLabels),
                    value: 'password'
                  },
                  {
                    label: getRestoringFlowLabel('login', usesMobileFlowLabels),
                    value: 'login'
                  }
                ]}
                value={resolvedRestoringFlow}
              />

              <Tabs
                className="rshb-authentication-restoring-access__tabs"
                onChange={(nextValue) => handleLoginMethodChange(nextValue)}
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
                value={resolvedLoginMethod}
              />
            </div>

            <div className="rshb-authentication-restoring-access__group">
              <p className="rshb-authentication-restoring-access__description">
                {restoringDescription}
              </p>

              <div className="rshb-authentication-restoring-access__fields">
                <InputInn
                  {...innInputProps}
                  className={joinClassNames(
                    'rshb-authentication-restoring-access__field',
                    innInputProps?.className
                  )}
                  label="ИНН"
                  onValueChange={setInn}
                  value={inn}
                />

                {resolvedLoginMethod === 'email' ? (
                  <InputEmail
                    {...emailInputProps}
                    className={joinClassNames(
                      'rshb-authentication-restoring-access__field',
                      emailInputProps?.className
                    )}
                    label="Электронная почта"
                    onValueChange={setRestoringValue}
                    value={restoringValue}
                  />
                ) : (
                  <InputPhone
                    {...phoneInputProps}
                    className={joinClassNames(
                      'rshb-authentication-restoring-access__field',
                      phoneInputProps?.className
                    )}
                    label="Номер телефона"
                    onValueChange={setRestoringValue}
                    value={restoringValue}
                  />
                )}
              </div>
            </div>

            <div className="rshb-authentication-restoring-access__actions">
              <Checkbox
                {...consentCheckboxProps}
                checked={consentAccepted}
                className={joinClassNames(
                  'rshb-authentication-restoring-access__consent',
                  consentCheckboxProps?.className
                )}
                label={resolvedConsentLabel}
                onChange={handleConsentChange}
                size="s"
              />

              <Button
                {...submitButtonProps}
                className={joinClassNames(
                  'rshb-authentication-restoring-access__action',
                  submitButtonProps?.className
                )}
                disabled={!canSubmitLogin || submitButtonProps?.disabled}
                type="submit"
                variant="brand"
              >
                {loginButtonLabel}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
