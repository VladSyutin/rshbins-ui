export { default } from './AuthenticationRegistration.jsx';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type LegacyAuthenticationRegistrationDevice = 'auto' | 'desktop' | 'mobile';
export type LegacyAuthenticationRegistrationMethod = 'email' | 'phone';

export interface LegacyAuthenticationRegistrationSubmitPayload {
  consentAccepted: boolean;
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
  registerButtonProps?: Record<string, unknown>;
  registerButtonLabel?: ReactNode;
  themeProps?: Record<string, unknown>;
}

export default function AuthenticationRegistration(
  props: LegacyAuthenticationRegistrationProps
): JSX.Element;
