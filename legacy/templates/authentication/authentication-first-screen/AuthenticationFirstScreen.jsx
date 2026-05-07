import React, { useId, useState } from 'react';
import '../../../../src/templates/authentication/authentication-first-screen/AuthenticationFirstScreen.scss';
import Button from '../../../components/button/index.js';
import Checkbox from '../../../components/checkbox/index.js';
import Divider from '../../../components/divider/index.js';
import Header from '../../../components/header/index.js';
import InputLogin from '../../../components/input-login/index.js';
import InputPassword from '../../../components/input-password/index.js';
import InputPhone from '../../../components/input-phone/index.js';
import SegmentedControl from '../../../components/segmented-control/index.js';
import gosuslugiIconUrl from '../../../../icons/gosuslugi.svg';

var PERSONAL_DATA_POLICY_URL = 'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

function getDigitsOnly(value) {
  return value.replace(/\D/g, '');
}

function buildDefaultConsentLabel(onPersonalDataClick) {
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

export default function AuthenticationFirstScreen(props) {
  var brandButtonProps = props.brandButtonProps;
  var className = props.className;
  var clientType = props.clientType;
  var consentCheckboxProps = props.consentCheckboxProps;
  var consentLabel = props.consentLabel;
  var defaultClientType = props.defaultClientType !== undefined ? props.defaultClientType : 'individual';
  var defaultConsentAccepted = props.defaultConsentAccepted !== undefined ? props.defaultConsentAccepted : false;
  var defaultLogin = props.defaultLogin !== undefined ? props.defaultLogin : '';
  var defaultPassword = props.defaultPassword !== undefined ? props.defaultPassword : '';
  var defaultPhone = props.defaultPhone !== undefined ? props.defaultPhone : '';
  var device = props.device !== undefined ? props.device : 'auto';
  var forgotCredentialsLabel = props.forgotCredentialsLabel !== undefined ? props.forgotCredentialsLabel : 'Забыли логин или пароль?';
  var gosuslugiButtonLabel = props.gosuslugiButtonLabel !== undefined ? props.gosuslugiButtonLabel : 'Войти через Госуслуги';
  var loginButtonLabel = props.loginButtonLabel;
  var loginButtonProps = props.loginButtonProps;
  var loginInputProps = props.loginInputProps;
  var onClientTypeChange = props.onClientTypeChange;
  var onCorporateSubmit = props.onCorporateSubmit;
  var onForgotCredentials = props.onForgotCredentials;
  var onGosuslugiLogin = props.onGosuslugiLogin;
  var onIndividualSubmit = props.onIndividualSubmit;
  var onPersonalDataClick = props.onPersonalDataClick;
  var onRegister = props.onRegister;
  var passwordInputProps = props.passwordInputProps;
  var phoneInputProps = props.phoneInputProps;
  var registerButtonLabel = props.registerButtonLabel !== undefined ? props.registerButtonLabel : 'Зарегистрироваться';
  var themeProps = props.themeProps;

  var generatedName = useId().replace(/:/g, '');
  var isControlled = clientType !== undefined;
  var clientTypeState = useState(defaultClientType);
  var internalClientType = clientTypeState[0];
  var setInternalClientType = clientTypeState[1];
  var phoneState = useState(defaultPhone);
  var phone = phoneState[0];
  var setPhone = phoneState[1];
  var loginState = useState(defaultLogin);
  var login = loginState[0];
  var setLogin = loginState[1];
  var passwordState = useState(defaultPassword);
  var password = passwordState[0];
  var setPassword = passwordState[1];
  var consentState = useState(defaultConsentAccepted);
  var consentAccepted = consentState[0];
  var setConsentAccepted = consentState[1];

  var resolvedClientType = clientType !== undefined ? clientType : internalClientType;
  var phoneDigits = getDigitsOnly(phone);
  var canSubmitIndividual = phoneDigits.length === 10 && consentAccepted;
  var canSubmitCorporate = login.trim().length > 0 && password.trim().length > 0;
  var resolvedLoginButtonLabel = loginButtonLabel !== undefined
    ? loginButtonLabel
    : (resolvedClientType === 'individual' ? 'Войти по номеру телефона' : 'Войти в личный кабинет');
  var resolvedConsentLabel = consentLabel !== undefined
    ? consentLabel
    : buildDefaultConsentLabel(onPersonalDataClick);

  function handleClientTypeChange(nextClientType) {
    var resolvedValue = nextClientType === 'corporate' ? 'corporate' : 'individual';
    if (!isControlled) { setInternalClientType(resolvedValue); }
    if (onClientTypeChange) { onClientTypeChange(resolvedValue); }
  }

  function handleConsentChange(event) {
    setConsentAccepted(event.target.checked);
    if (consentCheckboxProps && consentCheckboxProps.onChange) { consentCheckboxProps.onChange(event); }
  }

  function handleIndividualSubmit(event) {
    event.preventDefault();
    if (!canSubmitIndividual) { return; }
    if (onIndividualSubmit) { onIndividualSubmit({ consentAccepted: consentAccepted, phone: phone }); }
  }

  function handleCorporateSubmit(event) {
    event.preventDefault();
    if (!canSubmitCorporate) { return; }
    if (onCorporateSubmit) { onCorporateSubmit({ login: login, password: password }); }
  }

  return (
    <section
      className={['rshb-authentication-first-screen', className].filter(Boolean).join(' ')}
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
          name={'authentication-first-screen-' + generatedName}
          onChange={function (nextValue) { handleClientTypeChange(nextValue); }}
          options={[
            {
              label: (
                <>
                  <span className="rshb-authentication-first-screen__label-desktop">Физическое лицо</span>
                  <span className="rshb-authentication-first-screen__label-mobile">Физ. лицо</span>
                </>
              ),
              value: 'individual'
            },
            {
              label: (
                <>
                  <span className="rshb-authentication-first-screen__label-desktop">Корпорат. клиент</span>
                  <span className="rshb-authentication-first-screen__label-mobile">Корпорат. клиент</span>
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
                    style={{ '--rshb-authentication-first-screen-icon-url': 'url("' + gosuslugiIconUrl + '")' }}
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
                className={['rshb-authentication-first-screen__consent', consentCheckboxProps && consentCheckboxProps.className].filter(Boolean).join(' ')}
                label={resolvedConsentLabel}
                onChange={handleConsentChange}
                size="s"
              />

              <Button
                {...loginButtonProps}
                className={['rshb-authentication-first-screen__action', loginButtonProps && loginButtonProps.className].filter(Boolean).join(' ')}
                disabled={!canSubmitIndividual || (loginButtonProps && loginButtonProps.disabled)}
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
                className={['rshb-authentication-first-screen__action', loginButtonProps && loginButtonProps.className].filter(Boolean).join(' ')}
                disabled={!canSubmitCorporate || (loginButtonProps && loginButtonProps.disabled)}
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
