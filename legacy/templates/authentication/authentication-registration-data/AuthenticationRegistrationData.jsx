import React, { useState } from 'react';
import '../../../../src/templates/authentication/authentication-registration-data/AuthenticationRegistrationData.scss';
import Button from '../../../components/button/index.js';
import Checkbox from '../../../components/checkbox/index.js';
import InputBirthDate, { isBirthDateValueValid } from '../../../components/input-birth-date/index.js';
import Gender from '../../../components/gender/index.js';
import Header from '../../../components/header/index.js';
import InputEmail, { isEmailValueValid } from '../../../components/input-email/index.js';
import InputMiddleName, { isMiddleNameValueValid } from '../../../components/input-middle-name/index.js';
import InputName, { isNameValueValid } from '../../../components/input-name/index.js';
import InputSurname, { isSurnameValueValid } from '../../../components/input-surname/index.js';

var PERSONAL_DATA_POLICY_URL = 'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

function buildDefaultConsentLabel(onPersonalDataClick) {
  return (
    <>
      Соглашаюсь на{' '}
      <a
        className="rshb-authentication-registration-data__link-button"
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

export default function AuthenticationRegistrationData(props) {
  var birthDateInputProps = props.birthDateInputProps;
  var brandButtonProps = props.brandButtonProps;
  var className = props.className;
  var consentCheckboxProps = props.consentCheckboxProps;
  var consentLabel = props.consentLabel;
  var defaultBirthDate = props.defaultBirthDate;
  var defaultConsentAccepted = props.defaultConsentAccepted !== undefined ? props.defaultConsentAccepted : false;
  var defaultEmail = props.defaultEmail !== undefined ? props.defaultEmail : '';
  var defaultGender = props.defaultGender;
  var defaultMiddleName = props.defaultMiddleName !== undefined ? props.defaultMiddleName : '';
  var defaultName = props.defaultName !== undefined ? props.defaultName : '';
  var defaultSurname = props.defaultSurname !== undefined ? props.defaultSurname : '';
  var defaultWithoutMiddleName = props.defaultWithoutMiddleName !== undefined ? props.defaultWithoutMiddleName : false;
  var device = props.device !== undefined ? props.device : 'auto';
  var emailInputProps = props.emailInputProps;
  var genderProps = props.genderProps;
  var middleNameInputProps = props.middleNameInputProps;
  var nameInputProps = props.nameInputProps;
  var onConsentChange = props.onConsentChange;
  var onPersonalDataClick = props.onPersonalDataClick;
  var onSubmit = props.onSubmit;
  var saveButtonProps = props.saveButtonProps;
  var saveButtonLabel = props.saveButtonLabel !== undefined ? props.saveButtonLabel : 'Сохранить данные';
  var surnameInputProps = props.surnameInputProps;
  var themeProps = props.themeProps;

  var surnameState = useState(defaultSurname);
  var surname = surnameState[0];
  var setSurname = surnameState[1];
  var nameState = useState(defaultName);
  var name = nameState[0];
  var setName = nameState[1];
  var middleNameState = useState(defaultMiddleName);
  var middleName = middleNameState[0];
  var setMiddleName = middleNameState[1];
  var withoutMiddleNameState = useState(defaultWithoutMiddleName);
  var withoutMiddleName = withoutMiddleNameState[0];
  var setWithoutMiddleName = withoutMiddleNameState[1];
  var birthDateState = useState(defaultBirthDate);
  var birthDate = birthDateState[0];
  var setBirthDate = birthDateState[1];
  var genderState = useState(defaultGender);
  var gender = genderState[0];
  var setGender = genderState[1];
  var emailState = useState(defaultEmail);
  var email = emailState[0];
  var setEmail = emailState[1];
  var consentState = useState(defaultConsentAccepted);
  var consentAccepted = consentState[0];
  var setConsentAccepted = consentState[1];

  var resolvedConsentLabel = consentLabel !== undefined ? consentLabel : buildDefaultConsentLabel(onPersonalDataClick);
  var canSubmit =
    isSurnameValueValid(surname) &&
    isNameValueValid(name) &&
    (withoutMiddleName || isMiddleNameValueValid(middleName)) &&
    isBirthDateValueValid(birthDate) &&
    gender !== undefined &&
    isEmailValueValid(email) &&
    consentAccepted;

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
        birthDate: birthDate,
        consentAccepted: consentAccepted,
        email: email,
        gender: gender,
        middleName: middleName,
        name: name,
        surname: surname,
        withoutMiddleName: withoutMiddleName
      });
    }
  }

  return (
    <section
      className={['rshb-authentication-registration-data', className].filter(Boolean).join(' ')}
      data-device={device}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-registration-data__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <h1 className="rshb-authentication-registration-data__title">
        Заполните информацию о себе
      </h1>

      <form
        className="rshb-authentication-registration-data__panel"
        onSubmit={handleSubmit}
      >
        <div className="rshb-authentication-registration-data__fields">
          <InputSurname
            {...surnameInputProps}
            className={['rshb-authentication-registration-data__field', surnameInputProps && surnameInputProps.className].filter(Boolean).join(' ')}
            label="Фамилия"
            onValueChange={function (nextValue) {
              setSurname(nextValue);
              if (surnameInputProps && surnameInputProps.onValueChange) { surnameInputProps.onValueChange(nextValue); }
            }}
            value={surname}
          />

          <InputName
            {...nameInputProps}
            className={['rshb-authentication-registration-data__field', nameInputProps && nameInputProps.className].filter(Boolean).join(' ')}
            label="Имя"
            onValueChange={function (nextValue) {
              setName(nextValue);
              if (nameInputProps && nameInputProps.onValueChange) { nameInputProps.onValueChange(nextValue); }
            }}
            value={name}
          />

          <InputMiddleName
            {...middleNameInputProps}
            className={['rshb-authentication-registration-data__field', middleNameInputProps && middleNameInputProps.className].filter(Boolean).join(' ')}
            defaultWithoutMiddleName={defaultWithoutMiddleName}
            onValueChange={function (nextValue) {
              setMiddleName(nextValue);
              if (middleNameInputProps && middleNameInputProps.onValueChange) { middleNameInputProps.onValueChange(nextValue); }
            }}
            onWithoutMiddleNameChange={function (checked) {
              setWithoutMiddleName(checked);
              if (checked) { setMiddleName(''); }
              if (middleNameInputProps && middleNameInputProps.onWithoutMiddleNameChange) {
                middleNameInputProps.onWithoutMiddleNameChange(checked);
              }
            }}
            value={middleName}
            withoutMiddleName={withoutMiddleName}
          />

          <div className="rshb-authentication-registration-data__compound-row">
            <InputBirthDate
              {...birthDateInputProps}
              className={['rshb-authentication-registration-data__field', 'rshb-authentication-registration-data__field--birth-date', birthDateInputProps && birthDateInputProps.className].filter(Boolean).join(' ')}
              label="Дата рождения"
              onValueChange={function (nextValue) {
                setBirthDate(nextValue);
                if (birthDateInputProps && birthDateInputProps.onValueChange) { birthDateInputProps.onValueChange(nextValue); }
              }}
              value={birthDate}
            />

            <Gender
              {...genderProps}
              className={['rshb-authentication-registration-data__gender', genderProps && genderProps.className].filter(Boolean).join(' ')}
              onChange={function (nextValue, event) {
                setGender(nextValue);
                if (genderProps && genderProps.onChange) { genderProps.onChange(nextValue, event); }
              }}
              value={gender}
            />
          </div>

          <InputEmail
            {...emailInputProps}
            className={['rshb-authentication-registration-data__field', emailInputProps && emailInputProps.className].filter(Boolean).join(' ')}
            label="Электронная почта"
            onValueChange={function (nextValue) {
              setEmail(nextValue);
              if (emailInputProps && emailInputProps.onValueChange) { emailInputProps.onValueChange(nextValue); }
            }}
            value={email}
          />
        </div>

        <div className="rshb-authentication-registration-data__actions">
          <Checkbox
            {...consentCheckboxProps}
            checked={consentAccepted}
            className={['rshb-authentication-registration-data__consent', consentCheckboxProps && consentCheckboxProps.className].filter(Boolean).join(' ')}
            label={resolvedConsentLabel}
            onChange={handleConsentChange}
            size="s"
          />

          <Button
            {...saveButtonProps}
            className={['rshb-authentication-registration-data__action', saveButtonProps && saveButtonProps.className].filter(Boolean).join(' ')}
            disabled={!canSubmit || (saveButtonProps && saveButtonProps.disabled)}
            type="submit"
            variant="brand"
          >
            {saveButtonLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}
