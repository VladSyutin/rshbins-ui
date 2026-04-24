import {
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import './AuthenticationCreatingLoginPassword.scss';
import { Button, type ButtonProps } from '../../../button/Button';
import { Header } from '../../../header/Header';
import { InputLogin, type InputLoginProps } from '../../../input-login/InputLogin';
import { InputPassword, type InputPasswordProps } from '../../../input-password/InputPassword';
import type { ThemeProps } from '../../../theme/Theme';

export type AuthenticationCreatingLoginPasswordDevice = 'auto' | 'desktop' | 'mobile';
export type AuthenticationCreatingLoginPasswordMode = 'login' | 'password' | 'login-and-password';

type PasswordRule = {
  id: string;
  label: ReactNode;
  isMet: (value: string) => boolean;
};

export interface AuthenticationCreatingLoginPasswordSubmitPayload {
  login?: string;
  password?: string;
  repeatedPassword?: string;
}

export interface AuthenticationCreatingLoginPasswordProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit' | 'title'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  defaultLogin?: string;
  defaultPassword?: string;
  defaultRepeatedPassword?: string;
  device?: AuthenticationCreatingLoginPasswordDevice;
  loginHint?: ReactNode;
  loginInputProps?: Omit<InputLoginProps, 'label' | 'value'>;
  mode?: AuthenticationCreatingLoginPasswordMode;
  saveButtonProps?: Omit<ButtonProps, 'children' | 'type'>;
  passwordInputProps?: Omit<InputPasswordProps, 'label' | 'value'>;
  repeatedPasswordInputProps?: Omit<InputPasswordProps, 'label' | 'value'>;
  saveButtonLabel?: ReactNode;
  themeProps?: Omit<ThemeProps, 'className'>;
  title?: ReactNode;
  onSubmit?: (payload: AuthenticationCreatingLoginPasswordSubmitPayload) => void;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function getDefaultTitle(mode: AuthenticationCreatingLoginPasswordMode): string {
  if (mode === 'password') {
    return 'Создайте надёжный пароль';
  }

  if (mode === 'login-and-password') {
    return 'Создайте надёжные логин и пароль';
  }

  return 'Создайте надёжный логин';
}

function getDefaultDescription(mode: AuthenticationCreatingLoginPasswordMode): string {
  if (mode === 'password') {
    return 'Создайте пароль, который будете использовать для входа в личный кабинет';
  }

  if (mode === 'login-and-password') {
    return 'Создайте логин и пароль, которые будете использовать при входе в личный кабинет';
  }

  return 'Создайте логин, который будете использовать для входа в личный кабинет';
}

function getDefaultSaveButtonLabel(mode: AuthenticationCreatingLoginPasswordMode): string {
  if (mode === 'password') {
    return 'Сохранить пароль';
  }

  if (mode === 'login-and-password') {
    return 'Сохранить логин и пароль';
  }

  return 'Сохранить логин';
}

const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length-without-spaces',
    label: 'минимум 15 символов без пробелов',
    isMet: (value) => value.length >= 15 && !/\s/.test(value)
  },
  {
    id: 'latin-cases',
    label: 'прописные и строчные латинские буквы (a-z)',
    isMet: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value)
  },
  {
    id: 'digit',
    label: 'хотя бы одна цифра',
    isMet: (value) => /\d/.test(value)
  },
  {
    id: 'special',
    label: 'хотя бы один спецсимвол',
    isMet: (value) => /[^A-Za-z0-9\s]/.test(value)
  }
];

function getPasswordRuleStates(password: string) {
  return PASSWORD_RULES.map((rule) => ({
    ...rule,
    met: rule.isMet(password)
  }));
}

function renderPasswordRules(password: string): ReactNode {
  const ruleStates = getPasswordRuleStates(password);

  return (
    <ul className="rshb-authentication-creating-login-password__rules">
      {ruleStates.map((rule) => (
        <li
          className="rshb-authentication-creating-login-password__rule"
          data-met={rule.met ? 'true' : 'false'}
          key={rule.id}
        >
          {rule.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Authentication template for creating login, password, or both credentials.
 */
export function AuthenticationCreatingLoginPassword({
  brandButtonProps,
  className,
  defaultLogin = '',
  defaultPassword = '',
  defaultRepeatedPassword = '',
  device = 'auto',
  loginHint = 'Можно использовать латинские буквы (a-z), цифры и спецсимволы: ".", "-", "_".',
  loginInputProps,
  mode = 'login',
  onSubmit,
  passwordInputProps,
  repeatedPasswordInputProps,
  saveButtonProps,
  saveButtonLabel,
  themeProps,
  title,
  ...props
}: AuthenticationCreatingLoginPasswordProps) {
  const [login, setLogin] = useState(defaultLogin);
  const [password, setPassword] = useState(defaultPassword);
  const [repeatedPassword, setRepeatedPassword] = useState(defaultRepeatedPassword);
  const showsLogin = mode === 'login' || mode === 'login-and-password';
  const showsPassword = mode === 'password' || mode === 'login-and-password';
  const resolvedTitle = title ?? getDefaultTitle(mode);
  const resolvedDescription = getDefaultDescription(mode);
  const resolvedSaveButtonLabel = saveButtonLabel ?? getDefaultSaveButtonLabel(mode);
  const passwordRuleStates = getPasswordRuleStates(password);
  const isPasswordValid = passwordRuleStates.every((rule) => rule.met);
  const isPasswordRepeated = repeatedPassword.length > 0 && repeatedPassword === password;
  const canSubmit =
    (!showsLogin || login.trim().length > 0) &&
    (!showsPassword || (isPasswordValid && isPasswordRepeated));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit?.({
      login: showsLogin ? login : undefined,
      password: showsPassword ? password : undefined,
      repeatedPassword: showsPassword ? repeatedPassword : undefined
    });
  }

  return (
    <section
      {...props}
      className={joinClassNames('rshb-authentication-creating-login-password', className)}
      data-device={device}
      data-mode={mode}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-creating-login-password__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <h1 className="rshb-authentication-creating-login-password__title">{resolvedTitle}</h1>

      <form className="rshb-authentication-creating-login-password__form" onSubmit={handleSubmit}>
        <div className="rshb-authentication-creating-login-password__fields">
          <p className="rshb-authentication-creating-login-password__description">
            {resolvedDescription}
          </p>

          {showsLogin ? (
            <div className="rshb-authentication-creating-login-password__field-group">
              <InputLogin
                {...loginInputProps}
                className={joinClassNames(
                  'rshb-authentication-creating-login-password__field',
                  loginInputProps?.className
                )}
                label={mode === 'login-and-password' ? 'Логин' : 'Новый логин'}
                onValueChange={(nextValue) => {
                  setLogin(nextValue);
                  loginInputProps?.onValueChange?.(nextValue);
                }}
                value={login}
              />
              <p className="rshb-authentication-creating-login-password__hint">{loginHint}</p>
            </div>
          ) : null}

          {showsPassword ? (
            <div className="rshb-authentication-creating-login-password__field-group">
              <InputPassword
                {...passwordInputProps}
                className={joinClassNames(
                  'rshb-authentication-creating-login-password__field',
                  passwordInputProps?.className
                )}
                label={mode === 'login-and-password' ? 'Пароль' : 'Новый пароль'}
                onValueChange={(nextValue) => {
                  setPassword(nextValue);
                  passwordInputProps?.onValueChange?.(nextValue);
                }}
                value={password}
              />

              <InputPassword
                {...repeatedPasswordInputProps}
                className={joinClassNames(
                  'rshb-authentication-creating-login-password__field',
                  repeatedPasswordInputProps?.className
                )}
                label="Повторите пароль"
                onValueChange={(nextValue) => {
                  setRepeatedPassword(nextValue);
                  repeatedPasswordInputProps?.onValueChange?.(nextValue);
                }}
                value={repeatedPassword}
              />

              {renderPasswordRules(password)}
            </div>
          ) : null}
        </div>

        <Button
          {...saveButtonProps}
          className={joinClassNames(
            'rshb-authentication-creating-login-password__action',
            saveButtonProps?.className
          )}
          disabled={!canSubmit || saveButtonProps?.disabled}
          type="submit"
          variant="brand"
        >
          {resolvedSaveButtonLabel}
        </Button>
      </form>
    </section>
  );
}
