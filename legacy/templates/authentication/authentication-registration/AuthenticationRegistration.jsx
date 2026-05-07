import React, { useState } from 'react';
import '../../../../src/templates/authentication/authentication-registration/AuthenticationRegistration.scss';
import Button from '../../../components/button/index.js';
import Checkbox from '../../../components/checkbox/index.js';
import Header from '../../../components/header/index.js';
import InputEmail, { isEmailValueValid } from '../../../components/input-email/index.js';
import InputInn from '../../../components/input-inn/index.js';
import InputPhone from '../../../components/input-phone/index.js';
import Tabs from '../../../components/tabs/index.js';
import arrowLeftIconUrl from '../../../../icons/arrow-left.svg';

var PERSONAL_DATA_POLICY_URL = 'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

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

function ArrowLeftIcon() {
  return (
    <span
      aria-hidden="true"
      className="rshb-authentication-registration__back-icon"
      style={{ '--rshb-authentication-registration-back-icon-url': 'url("' + arrowLeftIconUrl + '")' }}
    />
  );
}

export default function AuthenticationRegistration(props) {
  var backButtonProps = props.backButtonProps;
  var brandButtonProps = props.brandButtonProps;
  var className = props.className;
  var consentCheckboxProps = props.consentCheckboxProps;
  var consentLabel = props.consentLabel;
  var defaultConsentAccepted = props.defaultConsentAccepted !== undefined ? props.defaultConsentAccepted : false;
  var defaultInn = props.defaultInn !== undefined ? props.defaultInn : '';
  var defaultMethod = props.defaultMethod !== undefined ? props.defaultMethod : 'email';
  var defaultValue = props.defaultValue !== undefined ? props.defaultValue : '';
  var device = props.device !== undefined ? props.device : 'auto';
  var emailInputProps = props.emailInputProps;
  var innInputProps = props.innInputProps;
  var method = props.method;
  var onBack = props.onBack;
  var onConsentChange = props.onConsentChange;
  var onMethodChange = props.onMethodChange;
  var onPersonalDataClick = props.onPersonalDataClick;
  var onSubmit = props.onSubmit;
  var phoneInputProps = props.phoneInputProps;
  var registerButtonProps = props.registerButtonProps;
  var registerButtonLabel = props.registerButtonLabel !== undefined ? props.registerButtonLabel : 'Зарегистрироваться';
  var themeProps = props.themeProps;

  var isMethodControlled = method !== undefined;
  var methodState = useState(defaultMethod);
  var internalMethod = methodState[0];
  var setInternalMethod = methodState[1];
  var innState = useState(defaultInn);
  var inn = innState[0];
  var setInn = innState[1];
  var registrationValueState = useState(defaultValue);
  var registrationValue = registrationValueState[0];
  var setRegistrationValue = registrationValueState[1];
  var consentState = useState(defaultConsentAccepted);
  var consentAccepted = consentState[0];
  var setConsentAccepted = consentState[1];

  var resolvedMethod = method !== undefined ? method : internalMethod;
  var resolvedConsentLabel = consentLabel !== undefined ? consentLabel : buildDefaultConsentLabel(onPersonalDataClick);
  var description = resolvedMethod === 'phone'
    ? 'Введите ИНН и номер телефона, которые были указаны при оформлении полиса'
    : 'Введите ИНН и адрес электронной почты, которые были указаны при оформлении полиса';
  var canSubmit = isInnValid(inn) &&
    (resolvedMethod === 'phone'
      ? getDigitsOnly(registrationValue).length === 10
      : isEmailValueValid(registrationValue)) &&
    consentAccepted;

  function handleMethodChange(nextValue) {
    var nextMethod = nextValue === 'phone' ? 'phone' : 'email';
    if (!isMethodControlled) { setInternalMethod(nextMethod); }
    setRegistrationValue('');
    if (onMethodChange) { onMethodChange(nextMethod); }
  }

  function handleConsentChange(event) {
    var nextChecked = event.target.checked;
    setConsentAccepted(nextChecked);
    if (onConsentChange) { onConsentChange(nextChecked); }
    if (consentCheckboxProps && consentCheckboxProps.onChange) { consentCheckboxProps.onChange(event); }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) { return; }
    if (onSubmit) {
      onSubmit({
        consentAccepted: consentAccepted,
        inn: inn,
        method: resolvedMethod,
        value: registrationValue
      });
    }
  }

  return (
    <section
      className={['rshb-authentication-registration', className].filter(Boolean).join(' ')}
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
            aria-label={(backButtonProps && backButtonProps['aria-label']) || 'Вернуться назад'}
            className={['rshb-authentication-registration__back', backButtonProps && backButtonProps.className].filter(Boolean).join(' ')}
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

          <h1 className="rshb-authentication-registration__title">Регистрация</h1>

          <Tabs
            className="rshb-authentication-registration__tabs"
            onChange={function (nextValue) { handleMethodChange(nextValue); }}
            options={[
              { label: 'Электронная почта', value: 'email' },
              { label: 'Номер телефона', value: 'phone' }
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
                className={['rshb-authentication-registration__field', innInputProps && innInputProps.className].filter(Boolean).join(' ')}
                label="ИНН"
                onValueChange={function (nextValue) {
                  setInn(nextValue);
                  if (innInputProps && innInputProps.onValueChange) { innInputProps.onValueChange(nextValue); }
                }}
                value={inn}
              />

              {resolvedMethod === 'phone' ? (
                <InputPhone
                  {...phoneInputProps}
                  className={['rshb-authentication-registration__field', phoneInputProps && phoneInputProps.className].filter(Boolean).join(' ')}
                  label="Номер телефона"
                  onValueChange={function (nextValue) {
                    setRegistrationValue(nextValue);
                    if (phoneInputProps && phoneInputProps.onValueChange) { phoneInputProps.onValueChange(nextValue); }
                  }}
                  value={registrationValue}
                />
              ) : (
                <InputEmail
                  {...emailInputProps}
                  className={['rshb-authentication-registration__field', emailInputProps && emailInputProps.className].filter(Boolean).join(' ')}
                  label="Электронная почта"
                  onValueChange={function (nextValue) {
                    setRegistrationValue(nextValue);
                    if (emailInputProps && emailInputProps.onValueChange) { emailInputProps.onValueChange(nextValue); }
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
              className={['rshb-authentication-registration__consent', consentCheckboxProps && consentCheckboxProps.className].filter(Boolean).join(' ')}
              label={resolvedConsentLabel}
              onChange={handleConsentChange}
              size="s"
            />

            <Button
              {...registerButtonProps}
              className={['rshb-authentication-registration__action', registerButtonProps && registerButtonProps.className].filter(Boolean).join(' ')}
              disabled={!canSubmit || (registerButtonProps && registerButtonProps.disabled)}
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
