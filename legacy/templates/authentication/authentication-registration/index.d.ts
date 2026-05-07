import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { LegacyThemeProps } from '../../../components/theme/index.js';

export type LegacyAuthenticationRegistrationMethod = 'email' | 'phone';
export type LegacyAuthenticationRegistrationDevice = 'auto' | 'desktop' | 'mobile';

export interface LegacyAuthenticationRegistrationSubmitPayload {
  consent: boolean;
  inn: string;
  method: LegacyAuthenticationRegistrationMethod;
  value: string;
}

export interface LegacyAuthenticationRegistrationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit'> {
  backButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  consentCheckboxProps?: Record<string, unknown>;
  consentLabel?: ReactNode;
  defaultConsentAccepted?: boolean;
  defaultInn?: string;
  defaultMethod?: LegacyAuthenticationRegistrationMethod;
  defaultValue?: string;
  device?: LegacyAuthenticationRegistrationDevice;
  emailInputProps?: Record<string, unknown>;
  innInputProps?: Record<string, unknown>;
  method?: LegacyAuthenticationRegistrationMethod;
  onBack?: () => void;
  onConsentChange?: (checked: boolean) => void;
  onMethodChange?: (method: LegacyAuthenticationRegistrationMethod) => void;
  onPersonalDataClick?: () => void;
  onSubmit?: (payload: LegacyAuthenticationRegistrationSubmitPayload) => void;
  phoneInputProps?: Record<string, unknown>;
  registerButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  registerButtonLabel?: ReactNode;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
}

export default function AuthenticationRegistration(
  props: LegacyAuthenticationRegistrationProps
): JSX.Element;
