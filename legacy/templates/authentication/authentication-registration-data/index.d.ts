export { default } from './AuthenticationRegistrationData.jsx';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { LegacyGenderValue } from '../../../components/gender/index.js';

export type LegacyAuthenticationRegistrationDataDevice = 'auto' | 'desktop' | 'mobile';

export interface LegacyAuthenticationRegistrationDataSubmitPayload {
  birthDate?: Date;
  consentAccepted: boolean;
  email: string;
  gender?: LegacyGenderValue;
  middleName: string;
  name: string;
  surname: string;
  withoutMiddleName: boolean;
}

export interface LegacyAuthenticationRegistrationDataProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit'> {
  birthDateInputProps?: Record<string, unknown>;
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  consentCheckboxProps?: Record<string, unknown>;
  consentLabel?: ReactNode;
  defaultBirthDate?: Date;
  defaultConsentAccepted?: boolean;
  defaultEmail?: string;
  defaultGender?: LegacyGenderValue;
  defaultMiddleName?: string;
  defaultName?: string;
  defaultSurname?: string;
  defaultWithoutMiddleName?: boolean;
  device?: LegacyAuthenticationRegistrationDataDevice;
  emailInputProps?: Record<string, unknown>;
  genderProps?: Record<string, unknown>;
  middleNameInputProps?: Record<string, unknown>;
  nameInputProps?: Record<string, unknown>;
  onConsentChange?: (checked: boolean) => void;
  onPersonalDataClick?: () => void;
  onSubmit?: (payload: LegacyAuthenticationRegistrationDataSubmitPayload) => void;
  saveButtonProps?: Record<string, unknown>;
  saveButtonLabel?: ReactNode;
  surnameInputProps?: Record<string, unknown>;
  themeProps?: Record<string, unknown>;
}

export default function AuthenticationRegistrationData(
  props: LegacyAuthenticationRegistrationDataProps
): JSX.Element;
