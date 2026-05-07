import React, { useEffect, useId, useState } from 'react';
import '../../../../src/templates/authentication/authentication-restoring-access/AuthenticationRestoringAccess.scss';
import Button from '../../../components/button/index.js';
import Checkbox from '../../../components/checkbox/index.js';
import Header from '../../../components/header/index.js';
import InputEmail, { isEmailValueValid } from '../../../components/input-email/index.js';
import InputInn from '../../../components/input-inn/index.js';
import InputLogin from '../../../components/input-login/index.js';
import InputPhone from '../../../components/input-phone/index.js';
import SegmentedControl from '../../../components/segmented-control/index.js';
import Tabs from '../../../components/tabs/index.js';
import arrowLeftIconUrl from '../../../../icons/arrow-left.svg';

var PERSONAL_DATA_POLICY_URL = 'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';
var MOBILE_BREAKPOINT_PX = 743;

function getDigitsOnly(value) {
  return value.replace(/\D/g, '');
}

function isInnValid(value) {
  var digits = getDigitsOnly(value);
  return digits.length === 10 || digits.length === 12;
}

function buildDefaultConsentLabel(onPersonalDataClick) {
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

function ArrowLeftIcon() {
  return (
    <span
      aria-hidden="true"
      className="rshb-authentication-restoring-access__back-icon"
      style={{ '--rshb-authentication-restoring-access-back-icon-url': 'url("' + arrowLeftIconUrl + '")' }}
    />
  );
}

function getRestoringFlowLabel(flow, isMobileLabels) {
  if (flow === 'password') {
    return isMobileLabels ? 'Восстан. пароля' : 'Восстанов. пароля';
  }
  return isMobileLabels ? 'Восстан. логина' : 'Восстанов. логина';
}

export default function AuthenticationRestoringAccess(props) {
  var backButtonProps = props.backButtonProps;
  var brandButtonProps = props.brandButtonProps;
  var className = props.className;
  var consentCheckboxProps = props.consentCheckboxProps;
  var consentLabel = props.consentLabel;
  var defaultConsentAccepted = props.defaultConsentAccepted !== undefined ? props.defaultConsentAccepted : false;
  var defaultInn = props.defaultInn !== undefined ? props.defaultInn : '';
  var defaultLogin = props.defaultLogin !== undefined ? props.defaultLogin : '';
  var defaultLoginMethod = props.defaultLoginMethod !== undefined ? props.defaultLoginMethod : 'email';
  var defaultRestoringFlow = props.defaultRestoringFlow !== undefined ? props.defaultRestoringFlow : 'password';
  var defaultRestoringValue = props.defaultRestoringValue !== undefined ? props.defaultRestoringValue : '';
  var device = props.device !== undefined ? props.device : 'auto';
  var emailInputProps = props.emailInputProps;
  var innInputProps = props.innInputProps;
  var loginInputProps = props.loginInputProps;
  var loginMethod = props.loginMethod;
  var onBack = props.onBack;
  var onConsentChange = props.onConsentChange;
  var onLoginMethodChange = props.onLoginMethodChange;
  var onPasswordSubmit = props.onPasswordSubmit;
  var onPersonalDataClick = props.onPersonalDataClick;
  var onRestoringFlowChange = props.onRestoringFlowChange;
  var onRestoringLoginSubmit = props.onRestoringLoginSubmit;
  var phoneInputProps = props.phoneInputProps;
  var restoringFlow = props.restoringFlow;
  var submitButtonProps = props.submitButtonProps;
  var themeProps = props.themeProps;

  var generatedName = useId().replace(/:/g, '');
  var isRestoringFlowControlled = restoringFlow !== undefined;
  var isLoginMethodControlled = loginMethod !== undefined;

  var internalRestoringFlowState = useState(defaultRestoringFlow);
  var internalRestoringFlow = internalRestoringFlowState[0];
  var setInternalRestoringFlow = internalRestoringFlowState[1];
  var internalLoginMethodState = useState(defaultLoginMethod);
  var internalLoginMethod = internalLoginMethodState[0];
  var setInternalLoginMethod = internalLoginMethodState[1];
  var loginState = useState(defaultLogin);
  var login = loginState[0];
  var setLogin = loginState[1];
  var innState = useState(defaultInn);
  var inn = innState[0];
  var setInn = innState[1];
  var restoringValueState = useState(defaultRestoringValue);
  var restoringValue = restoringValueState[0];
  var setRestoringValue = restoringValueState[1];
  var consentState = useState(defaultConsentAccepted);
  var consentAccepted = consentState[0];
  var setConsentAccepted = consentState[1];
  var isAutoMobileViewportState = useState(function () {
    return typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT_PX : false;
  });
  var isAutoMobileViewport = isAutoMobileViewportState[0];
  var setIsAutoMobileViewport = isAutoMobileViewportState[1];

  var resolvedRestoringFlow = restoringFlow !== undefined ? restoringFlow : internalRestoringFlow;
  var resolvedLoginMethod = loginMethod !== undefined ? loginMethod : internalLoginMethod;
  var usesMobileFlowLabels = device === 'mobile' || (device === 'auto' && isAutoMobileViewport);
  var resolvedConsentLabel = consentLabel !== undefined ? consentLabel : buildDefaultConsentLabel(onPersonalDataClick);
  var passwordButtonLabel = 'Восстановить пароль';
  var loginButtonLabel = 'Восстановить логин';
  var restoringDescription = resolvedRestoringFlow === 'password'
    ? 'Введите логин, который был создан при регистрации'
    : (resolvedLoginMethod === 'email'
      ? 'Введите ИНН и адрес электронной почты, которые были указаны при регистрации'
      : 'Введите ИНН и номер телефона, которые были указаны при регистрации');
  var canSubmitPassword = login.trim().length > 0;
  var canSubmitLogin = isInnValid(inn) &&
    (resolvedLoginMethod === 'phone'
      ? getDigitsOnly(restoringValue).length === 10
      : isEmailValueValid(restoringValue)) &&
    consentAccepted;

  useEffect(function () {
    if (device !== 'auto' || typeof window === 'undefined') { return undefined; }
    function handleResize() {
      setIsAutoMobileViewport(window.innerWidth <= MOBILE_BREAKPOINT_PX);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return function () { window.removeEventListener('resize', handleResize); };
  }, [device]);

  function handleRestoringFlowChange(nextValue) {
    var nextFlow = nextValue === 'login' ? 'login' : 'password';
    if (!isRestoringFlowControlled) { setInternalRestoringFlow(nextFlow); }
    if (onRestoringFlowChange) { onRestoringFlowChange(nextFlow); }
  }

  function handleLoginMethodChange(nextValue) {
    var nextMethod = nextValue === 'phone' ? 'phone' : 'email';
    if (!isLoginMethodControlled) { setInternalLoginMethod(nextMethod); }
    if (onLoginMethodChange) { onLoginMethodChange(nextMethod); }
  }

  function handleConsentChange(event) {
    var nextChecked = event.target.checked;
    setConsentAccepted(nextChecked);
    if (onConsentChange) { onConsentChange(nextChecked); }
    if (consentCheckboxProps && consentCheckboxProps.onChange) { consentCheckboxProps.onChange(event); }
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();
    if (!canSubmitPassword) { return; }
    if (onPasswordSubmit) { onPasswordSubmit({ login: login }); }
  }

  function handleRestoringLoginSubmit(event) {
    event.preventDefault();
    if (!canSubmitLogin) { return; }
    if (onRestoringLoginSubmit) {
      onRestoringLoginSubmit({
        consentAccepted: consentAccepted,
        inn: inn,
        method: resolvedLoginMethod,
        value: restoringValue
      });
    }
  }

  var flowSwitchOptions = [
    { label: getRestoringFlowLabel('password', usesMobileFlowLabels), value: 'password' },
    { label: getRestoringFlowLabel('login', usesMobileFlowLabels), value: 'login' }
  ];

  return (
    <section
      className={['rshb-authentication-restoring-access', className].filter(Boolean).join(' ')}
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
            aria-label={(backButtonProps && backButtonProps['aria-label']) || 'Вернуться назад'}
            className={['rshb-authentication-restoring-access__back', backButtonProps && backButtonProps.className].filter(Boolean).join(' ')}
            iconOnly
            leadingIcon={<ArrowLeftIcon />}
            onClick={function (event) {
              if (backButtonProps && backButtonProps.onClick) { backButtonProps.onClick(event); }
              if (!event.defaultPrevented && onBack) { onBack(); }
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
              name={'authentication-restoring-flow-' + generatedName}
              onChange={function (nextValue) { handleRestoringFlowChange(nextValue); }}
              options={flowSwitchOptions}
              value={resolvedRestoringFlow}
            />

            <div className="rshb-authentication-restoring-access__group">
              <p className="rshb-authentication-restoring-access__description">
                {restoringDescription}
              </p>

              <InputLogin
                {...loginInputProps}
                className={['rshb-authentication-restoring-access__field', loginInputProps && loginInputProps.className].filter(Boolean).join(' ')}
                label="Логин"
                onValueChange={setLogin}
                value={login}
              />
            </div>

            <Button
              {...submitButtonProps}
              className={['rshb-authentication-restoring-access__action', submitButtonProps && submitButtonProps.className].filter(Boolean).join(' ')}
              disabled={!canSubmitPassword || (submitButtonProps && submitButtonProps.disabled)}
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
                name={'authentication-restoring-flow-' + generatedName}
                onChange={function (nextValue) { handleRestoringFlowChange(nextValue); }}
                options={flowSwitchOptions}
                value={resolvedRestoringFlow}
              />

              <Tabs
                className="rshb-authentication-restoring-access__tabs"
                onChange={function (nextValue) { handleLoginMethodChange(nextValue); }}
                options={[
                  { label: 'Электронная почта', value: 'email' },
                  { label: 'Номер телефона', value: 'phone' }
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
                  className={['rshb-authentication-restoring-access__field', innInputProps && innInputProps.className].filter(Boolean).join(' ')}
                  label="ИНН"
                  onValueChange={setInn}
                  value={inn}
                />

                {resolvedLoginMethod === 'email' ? (
                  <InputEmail
                    {...emailInputProps}
                    className={['rshb-authentication-restoring-access__field', emailInputProps && emailInputProps.className].filter(Boolean).join(' ')}
                    label="Электронная почта"
                    onValueChange={setRestoringValue}
                    value={restoringValue}
                  />
                ) : (
                  <InputPhone
                    {...phoneInputProps}
                    className={['rshb-authentication-restoring-access__field', phoneInputProps && phoneInputProps.className].filter(Boolean).join(' ')}
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
                className={['rshb-authentication-restoring-access__consent', consentCheckboxProps && consentCheckboxProps.className].filter(Boolean).join(' ')}
                label={resolvedConsentLabel}
                onChange={handleConsentChange}
                size="s"
              />

              <Button
                {...submitButtonProps}
                className={['rshb-authentication-restoring-access__action', submitButtonProps && submitButtonProps.className].filter(Boolean).join(' ')}
                disabled={!canSubmitLogin || (submitButtonProps && submitButtonProps.disabled)}
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
