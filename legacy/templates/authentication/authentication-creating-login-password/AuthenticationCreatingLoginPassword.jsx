import React, { useState } from 'react';
import '../../../../src/templates/authentication/authentication-creating-login-password/AuthenticationCreatingLoginPassword.scss';
import Button from '../../../components/button/index.js';
import Header from '../../../components/header/index.js';
import InputLogin from '../../../components/input-login/index.js';
import InputPassword from '../../../components/input-password/index.js';

var PASSWORD_RULES = [
  {
    id: 'length-without-spaces',
    label: 'минимум 15 символов без пробелов',
    isMet: function (value) { return value.length >= 15 && !/\s/.test(value); }
  },
  {
    id: 'latin-cases',
    label: 'прописные и строчные латинские буквы (a-z)',
    isMet: function (value) { return /[a-z]/.test(value) && /[A-Z]/.test(value); }
  },
  {
    id: 'digit',
    label: 'хотя бы одна цифра',
    isMet: function (value) { return /\d/.test(value); }
  },
  {
    id: 'special',
    label: 'хотя бы один спецсимвол',
    isMet: function (value) { return /[^A-Za-z0-9\s]/.test(value); }
  }
];

function getDefaultTitle(mode) {
  if (mode === 'password') { return 'Создайте надёжный пароль'; }
  if (mode === 'login-and-password') { return 'Создайте надёжные логин и пароль'; }
  return 'Создайте надёжный логин';
}

function getDefaultDescription(mode) {
  if (mode === 'password') { return 'Создайте пароль, который будете использовать для входа в личный кабинет'; }
  if (mode === 'login-and-password') { return 'Создайте логин и пароль, которые будете использовать при входе в личный кабинет'; }
  return 'Создайте логин, который будете использовать для входа в личный кабинет';
}

function getDefaultSaveButtonLabel(mode) {
  if (mode === 'password') { return 'Сохранить пароль'; }
  if (mode === 'login-and-password') { return 'Сохранить логин и пароль'; }
  return 'Сохранить логин';
}

function getPasswordRuleStates(password) {
  return PASSWORD_RULES.map(function (rule) {
    return { id: rule.id, label: rule.label, met: rule.isMet(password) };
  });
}

function renderPasswordRules(password) {
  var ruleStates = getPasswordRuleStates(password);
  return (
    <ul className="rshb-authentication-creating-login-password__rules">
      {ruleStates.map(function (rule) {
        return (
          <li
            className="rshb-authentication-creating-login-password__rule"
            data-met={rule.met ? 'true' : 'false'}
            key={rule.id}
          >
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

export default function AuthenticationCreatingLoginPassword(props) {
  var brandButtonProps = props.brandButtonProps;
  var className = props.className;
  var defaultLogin = props.defaultLogin !== undefined ? props.defaultLogin : '';
  var defaultPassword = props.defaultPassword !== undefined ? props.defaultPassword : '';
  var defaultRepeatedPassword = props.defaultRepeatedPassword !== undefined ? props.defaultRepeatedPassword : '';
  var device = props.device !== undefined ? props.device : 'auto';
  var loginHint = props.loginHint !== undefined
    ? props.loginHint
    : 'Можно использовать латинские буквы (a-z), цифры и спецсимволы: ".", "-", "_".';
  var loginInputProps = props.loginInputProps;
  var mode = props.mode !== undefined ? props.mode : 'login';
  var onSubmit = props.onSubmit;
  var passwordInputProps = props.passwordInputProps;
  var repeatedPasswordInputProps = props.repeatedPasswordInputProps;
  var saveButtonProps = props.saveButtonProps;
  var saveButtonLabel = props.saveButtonLabel;
  var themeProps = props.themeProps;
  var title = props.title;

  var loginState = useState(defaultLogin);
  var login = loginState[0];
  var setLogin = loginState[1];
  var passwordState = useState(defaultPassword);
  var password = passwordState[0];
  var setPassword = passwordState[1];
  var repeatedPasswordState = useState(defaultRepeatedPassword);
  var repeatedPassword = repeatedPasswordState[0];
  var setRepeatedPassword = repeatedPasswordState[1];

  var showsLogin = mode === 'login' || mode === 'login-and-password';
  var showsPassword = mode === 'password' || mode === 'login-and-password';
  var resolvedTitle = title !== undefined ? title : getDefaultTitle(mode);
  var resolvedDescription = getDefaultDescription(mode);
  var resolvedSaveButtonLabel = saveButtonLabel !== undefined ? saveButtonLabel : getDefaultSaveButtonLabel(mode);
  var passwordRuleStates = getPasswordRuleStates(password);
  var isPasswordValid = passwordRuleStates.every(function (rule) { return rule.met; });
  var isPasswordRepeated = repeatedPassword.length > 0 && repeatedPassword === password;
  var canSubmit =
    (!showsLogin || login.trim().length > 0) &&
    (!showsPassword || (isPasswordValid && isPasswordRepeated));

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) { return; }
    if (onSubmit) {
      onSubmit({
        login: showsLogin ? login : undefined,
        password: showsPassword ? password : undefined,
        repeatedPassword: showsPassword ? repeatedPassword : undefined
      });
    }
  }

  return (
    <section
      className={['rshb-authentication-creating-login-password', className].filter(Boolean).join(' ')}
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
                className={['rshb-authentication-creating-login-password__field', loginInputProps && loginInputProps.className].filter(Boolean).join(' ')}
                label={mode === 'login-and-password' ? 'Логин' : 'Новый логин'}
                onValueChange={function (nextValue) {
                  setLogin(nextValue);
                  if (loginInputProps && loginInputProps.onValueChange) { loginInputProps.onValueChange(nextValue); }
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
                className={['rshb-authentication-creating-login-password__field', passwordInputProps && passwordInputProps.className].filter(Boolean).join(' ')}
                label={mode === 'login-and-password' ? 'Пароль' : 'Новый пароль'}
                onValueChange={function (nextValue) {
                  setPassword(nextValue);
                  if (passwordInputProps && passwordInputProps.onValueChange) { passwordInputProps.onValueChange(nextValue); }
                }}
                value={password}
              />

              <InputPassword
                {...repeatedPasswordInputProps}
                className={['rshb-authentication-creating-login-password__field', repeatedPasswordInputProps && repeatedPasswordInputProps.className].filter(Boolean).join(' ')}
                label="Повторите пароль"
                onValueChange={function (nextValue) {
                  setRepeatedPassword(nextValue);
                  if (repeatedPasswordInputProps && repeatedPasswordInputProps.onValueChange) {
                    repeatedPasswordInputProps.onValueChange(nextValue);
                  }
                }}
                value={repeatedPassword}
              />

              {renderPasswordRules(password)}
            </div>
          ) : null}
        </div>

        <Button
          {...saveButtonProps}
          className={['rshb-authentication-creating-login-password__action', saveButtonProps && saveButtonProps.className].filter(Boolean).join(' ')}
          disabled={!canSubmit || (saveButtonProps && saveButtonProps.disabled)}
          type="submit"
          variant="brand"
        >
          {resolvedSaveButtonLabel}
        </Button>
      </form>
    </section>
  );
}
