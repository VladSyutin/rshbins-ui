export { default } from './AuthenticationRestoringAccess.jsx';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type LegacyAuthenticationRestoringAccessDevice = 'auto' | 'desktop' | 'mobile';
export type LegacyAuthenticationRestoringAccessFlow = 'password' | 'login';
export type LegacyAuthenticationRestoringAccessMethod = 'email' | 'phone';

export interface LegacyAuthenticationRestoringPasswordSubmitPayload {
  login: string;
}

export interface LegacyAuthenticationRestoringLoginSubmitPayload {
  consentAccepted: boolean;
  inn: string;
  method: LegacyAuthenticationRestoringAccessMethod;
  value: string;
}

export interface LegacyAuthenticationRestoringAccessProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit'> {
  backButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  consentCheckboxProps?: Record<string, unknown>;
  consentLabel?: ReactNode;
  defaultConsentAccepted?: boolean;
  defaultInn?: string;
  defaultLogin?: string;
  defaultLoginMethod?: LegacyAuthenticationRestoringAccessMethod;
  defaultRestoringFlow?: LegacyAuthenticationRestoringAccessFlow;
  defaultRestoringValue?: string;
  device?: LegacyAuthenticationRestoringAccessDevice;
  emailInputProps?: Record<string, unknown>;
  innInputProps?: Record<string, unknown>;
  loginInputProps?: Record<string, unknown>;
  loginMethod?: LegacyAuthenticationRestoringAccessMethod;
  onBack?: () => void;
  onConsentChange?: (checked: boolean) => void;
  onLoginMethodChange?: (method: LegacyAuthenticationRestoringAccessMethod) => void;
  onPasswordSubmit?: (payload: LegacyAuthenticationRestoringPasswordSubmitPayload) => void;
  onPersonalDataClick?: () => void;
  onRestoringFlowChange?: (flow: LegacyAuthenticationRestoringAccessFlow) => void;
  onRestoringLoginSubmit?: (payload: LegacyAuthenticationRestoringLoginSubmitPayload) => void;
  phoneInputProps?: Record<string, unknown>;
  restoringFlow?: LegacyAuthenticationRestoringAccessFlow;
  submitButtonProps?: Record<string, unknown>;
  themeProps?: Record<string, unknown>;
}

export default function AuthenticationRestoringAccess(
  props: LegacyAuthenticationRestoringAccessProps
): JSX.Element;
