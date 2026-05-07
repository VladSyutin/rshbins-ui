export { default } from './AuthenticationFirstScreen.jsx';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type LegacyAuthenticationClientType = 'individual' | 'corporate';
export type LegacyAuthenticationFirstScreenDevice = 'auto' | 'desktop' | 'mobile';

export interface LegacyIndividualSubmitPayload {
  consentAccepted: boolean;
  phone: string;
}

export interface LegacyCorporateSubmitPayload {
  login: string;
  password: string;
}

export interface LegacyAuthenticationFirstScreenProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  clientType?: LegacyAuthenticationClientType;
  consentCheckboxProps?: Record<string, unknown>;
  consentLabel?: ReactNode;
  defaultClientType?: LegacyAuthenticationClientType;
  defaultConsentAccepted?: boolean;
  defaultLogin?: string;
  defaultPassword?: string;
  defaultPhone?: string;
  device?: LegacyAuthenticationFirstScreenDevice;
  forgotCredentialsLabel?: ReactNode;
  gosuslugiButtonLabel?: ReactNode;
  loginButtonLabel?: ReactNode;
  loginButtonProps?: Record<string, unknown>;
  loginInputProps?: Record<string, unknown>;
  onClientTypeChange?: (clientType: LegacyAuthenticationClientType) => void;
  onCorporateSubmit?: (payload: LegacyCorporateSubmitPayload) => void;
  onForgotCredentials?: () => void;
  onGosuslugiLogin?: () => void;
  onIndividualSubmit?: (payload: LegacyIndividualSubmitPayload) => void;
  onPersonalDataClick?: () => void;
  onRegister?: () => void;
  passwordInputProps?: Record<string, unknown>;
  phoneInputProps?: Record<string, unknown>;
  registerButtonLabel?: ReactNode;
  themeProps?: Record<string, unknown>;
}

export default function AuthenticationFirstScreen(
  props: LegacyAuthenticationFirstScreenProps
): JSX.Element;
