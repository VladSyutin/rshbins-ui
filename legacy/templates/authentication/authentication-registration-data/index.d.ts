import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { LegacyThemeProps } from '../../../components/theme/index.js';

export type LegacyAuthenticationRegistrationDataDevice = 'auto' | 'desktop' | 'mobile';
export type LegacyGenderValue = 'male' | 'female';

export interface LegacyAuthenticationRegistrationDataSubmitPayload {
  birthDate: Date | undefined;
  consent: boolean;
  email: string;
  gender: LegacyGenderValue | undefined;
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
  saveButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  saveButtonLabel?: ReactNode;
  surnameInputProps?: Record<string, unknown>;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
}

export default function AuthenticationRegistrationData(
  props: LegacyAuthenticationRegistrationDataProps
): JSX.Element;
