export { default } from './AuthenticationEmailConfirmation.jsx';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type LegacyAuthenticationEmailConfirmationDevice = 'auto' | 'desktop' | 'mobile';
export type LegacyAuthenticationEmailConfirmationEmailMode = 'visible' | 'hidden';

export interface LegacyAuthenticationEmailConfirmationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  codeInputProps?: Record<string, unknown>;
  device?: LegacyAuthenticationEmailConfirmationDevice;
  email: ReactNode;
  emailMode?: LegacyAuthenticationEmailConfirmationEmailMode;
  hiddenEmail?: ReactNode;
  onChangeEmail?: () => void;
  resendButtonLabel?: ReactNode;
  resendButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  safetyLabel?: ReactNode;
  themeProps?: Record<string, unknown>;
  title?: ReactNode;
}

export default function AuthenticationEmailConfirmation(
  props: LegacyAuthenticationEmailConfirmationProps
): JSX.Element;
