import {
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import './AuthenticationRegistrationData.scss';
import { Button, type ButtonProps } from '../../../components/button/Button';
import { Checkbox, type CheckboxProps } from '../../../components/checkbox/Checkbox';
import { InputBirthDate, isBirthDateValueValid, type InputBirthDateProps } from '../../../components/input-birth-date/InputBirthDate';
import { Gender, type GenderProps, type GenderValue } from '../../../components/gender/Gender';
import { Header } from '../../../components/header/Header';
import { InputEmail, isEmailValueValid, type InputEmailProps } from '../../../components/input-email/InputEmail';
import { InputMiddleName, isMiddleNameValueValid, type InputMiddleNameProps } from '../../../components/input-middle-name/InputMiddleName';
import { InputName, isNameValueValid, type InputNameProps } from '../../../components/input-name/InputName';
import { InputSurname, isSurnameValueValid, type InputSurnameProps } from '../../../components/input-surname/InputSurname';
import { InputText, type InputTextProps } from '../../../components/input-text/InputText';
import type { ThemeProps } from '../../../components/theme/Theme';

const PERSONAL_DATA_POLICY_URL =
  'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

export type AuthenticationRegistrationDataDevice = 'auto' | 'desktop' | 'mobile';

export interface AuthenticationRegistrationDataSubmitPayload {
  birthDate?: Date;
  consentAccepted: boolean;
  email: string;
  gender?: GenderValue;
  middleName: string;
  name: string;
  surname: string;
  withoutMiddleName: boolean;
}

export interface AuthenticationRegistrationDataProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit'> {
  birthDateInputProps?: Omit<InputBirthDateProps, 'label' | 'value'>;
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  consentCheckboxProps?: Omit<CheckboxProps, 'checked' | 'label' | 'size'>;
  consentLabel?: ReactNode;
  defaultBirthDate?: Date;
  defaultConsentAccepted?: boolean;
  defaultEmail?: string;
  defaultGender?: GenderValue;
  defaultMiddleName?: string;
  defaultName?: string;
  defaultSurname?: string;
  defaultWithoutMiddleName?: boolean;
  device?: AuthenticationRegistrationDataDevice;
  emailInputProps?: Omit<InputEmailProps, 'label' | 'value'>;
  genderProps?: Omit<GenderProps, 'value'>;
  middleNameInputProps?: Omit<
    InputMiddleNameProps,
    'defaultWithoutMiddleName' | 'label' | 'value' | 'withoutMiddleName'
  >;
  nameInputProps?: Omit<InputNameProps, 'label' | 'value'>;
  onConsentChange?: (checked: boolean) => void;
  onPersonalDataClick?: () => void;
  onSubmit?: (payload: AuthenticationRegistrationDataSubmitPayload) => void;
  saveButtonProps?: Omit<ButtonProps, 'children' | 'type'>;
  saveButtonLabel?: ReactNode;
  surnameInputProps?: Omit<InputSurnameProps, 'label' | 'value'>;
  themeProps?: Omit<ThemeProps, 'className'>;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function buildDefaultConsentLabel(onPersonalDataClick?: () => void): ReactNode {
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

/**
 * Personal-information registration step matching the Figma profile details form.
 */
export function AuthenticationRegistrationData({
  birthDateInputProps,
  brandButtonProps,
  className,
  consentCheckboxProps,
  consentLabel,
  defaultBirthDate,
  defaultConsentAccepted = false,
  defaultEmail = '',
  defaultGender,
  defaultMiddleName = '',
  defaultName = '',
  defaultSurname = '',
  defaultWithoutMiddleName = false,
  device = 'auto',
  emailInputProps,
  genderProps,
  middleNameInputProps,
  nameInputProps,
  onConsentChange,
  onPersonalDataClick,
  onSubmit,
  saveButtonProps,
  saveButtonLabel = 'Сохранить данные',
  surnameInputProps,
  themeProps,
  ...props
}: AuthenticationRegistrationDataProps) {
  const [surname, setSurname] = useState(defaultSurname);
  const [name, setName] = useState(defaultName);
  const [middleName, setMiddleName] = useState(defaultMiddleName);
  const [withoutMiddleName, setWithoutMiddleName] = useState(defaultWithoutMiddleName);
  const [birthDate, setBirthDate] = useState<Date | undefined>(defaultBirthDate);
  const [gender, setGender] = useState<GenderValue | undefined>(defaultGender);
  const [email, setEmail] = useState(defaultEmail);
  const [consentAccepted, setConsentAccepted] = useState(defaultConsentAccepted);

  const resolvedConsentLabel = consentLabel ?? buildDefaultConsentLabel(onPersonalDataClick);
  const canSubmit =
    isSurnameValueValid(surname) &&
    isNameValueValid(name) &&
    (withoutMiddleName || isMiddleNameValueValid(middleName)) &&
    isBirthDateValueValid(birthDate) &&
    gender !== undefined &&
    isEmailValueValid(email) &&
    consentAccepted;

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
      birthDate,
      consentAccepted,
      email,
      gender,
      middleName,
      name,
      surname,
      withoutMiddleName
    });
  }

  return (
    <section
      {...props}
      className={joinClassNames('rshb-authentication-registration-data', className)}
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
            className={joinClassNames(
              'rshb-authentication-registration-data__field',
              surnameInputProps?.className
            )}
            label="Фамилия"
            onValueChange={(nextValue) => {
              setSurname(nextValue);
              surnameInputProps?.onValueChange?.(nextValue);
            }}
            value={surname}
          />

          <InputName
            {...nameInputProps}
            className={joinClassNames(
              'rshb-authentication-registration-data__field',
              nameInputProps?.className
            )}
            label="Имя"
            onValueChange={(nextValue) => {
              setName(nextValue);
              nameInputProps?.onValueChange?.(nextValue);
            }}
            value={name}
          />

          <InputMiddleName
            {...middleNameInputProps}
            className={joinClassNames(
              'rshb-authentication-registration-data__field',
              middleNameInputProps?.className
            )}
            defaultWithoutMiddleName={defaultWithoutMiddleName}
            onValueChange={(nextValue) => {
              setMiddleName(nextValue);
              middleNameInputProps?.onValueChange?.(nextValue);
            }}
            onWithoutMiddleNameChange={(checked) => {
              setWithoutMiddleName(checked);

              if (checked) {
                setMiddleName('');
              }

              middleNameInputProps?.onWithoutMiddleNameChange?.(checked);
            }}
            value={middleName}
            withoutMiddleName={withoutMiddleName}
          />

          <div className="rshb-authentication-registration-data__compound-row">
            <InputBirthDate
              {...birthDateInputProps}
              className={joinClassNames(
                'rshb-authentication-registration-data__field',
                'rshb-authentication-registration-data__field--birth-date',
                birthDateInputProps?.className
              )}
              label="Дата рождения"
              onValueChange={(nextValue) => {
                setBirthDate(nextValue);
                birthDateInputProps?.onValueChange?.(nextValue);
              }}
              value={birthDate}
            />

            <Gender
              {...genderProps}
              className={joinClassNames(
                'rshb-authentication-registration-data__gender',
                genderProps?.className
              )}
              onChange={(nextValue, event) => {
                setGender(nextValue);
                genderProps?.onChange?.(nextValue, event);
              }}
              value={gender}
            />
          </div>

          <InputEmail
            {...emailInputProps}
            className={joinClassNames(
              'rshb-authentication-registration-data__field',
              emailInputProps?.className
            )}
            label="Электронная почта"
            onValueChange={(nextValue) => {
              setEmail(nextValue);
              emailInputProps?.onValueChange?.(nextValue);
            }}
            value={email}
          />
        </div>

        <div className="rshb-authentication-registration-data__actions">
          <Checkbox
            {...consentCheckboxProps}
            checked={consentAccepted}
            className={joinClassNames(
              'rshb-authentication-registration-data__consent',
              consentCheckboxProps?.className
            )}
            label={resolvedConsentLabel}
            onChange={handleConsentChange}
            size="s"
          />

          <Button
            {...saveButtonProps}
            className={joinClassNames(
              'rshb-authentication-registration-data__action',
              saveButtonProps?.className
            )}
            disabled={!canSubmit || saveButtonProps?.disabled}
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
