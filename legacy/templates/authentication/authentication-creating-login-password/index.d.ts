export { default } from './AuthenticationCreatingLoginPassword.jsx';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type LegacyAuthenticationCreatingLoginPasswordDevice = 'auto' | 'desktop' | 'mobile';
export type LegacyAuthenticationCreatingLoginPasswordMode = 'login' | 'password' | 'login-and-password';

export interface LegacyAuthenticationCreatingLoginPasswordSubmitPayload {
  login?: string;
  password?: string;
  repeatedPassword?: string;
}

export interface LegacyAuthenticationCreatingLoginPasswordProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit' | 'title'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  defaultLogin?: string;
  defaultPassword?: string;
  defaultRepeatedPassword?: string;
  device?: LegacyAuthenticationCreatingLoginPasswordDevice;
  loginHint?: ReactNode;
  loginInputProps?: Record<string, unknown>;
  mode?: LegacyAuthenticationCreatingLoginPasswordMode;
  onSubmit?: (payload: LegacyAuthenticationCreatingLoginPasswordSubmitPayload) => void;
  passwordInputProps?: Record<string, unknown>;
  repeatedPasswordInputProps?: Record<string, unknown>;
  saveButtonProps?: Record<string, unknown>;
  saveButtonLabel?: ReactNode;
  themeProps?: Record<string, unknown>;
  title?: ReactNode;
}

export default function AuthenticationCreatingLoginPassword(
  props: LegacyAuthenticationCreatingLoginPasswordProps
): JSX.Element;
