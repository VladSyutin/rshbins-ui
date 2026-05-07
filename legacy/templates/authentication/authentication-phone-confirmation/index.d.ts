import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { LegacyThemeProps } from '../../../components/theme/index.js';

export type LegacyAuthenticationPhoneConfirmationDevice = 'auto' | 'desktop' | 'mobile';
export type LegacyAuthenticationPhoneConfirmationPhoneMode = 'visible' | 'hidden';

export interface LegacyAuthenticationPhoneConfirmationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  codeInputProps?: Record<string, unknown>;
  device?: LegacyAuthenticationPhoneConfirmationDevice;
  emailButtonLabel?: ReactNode;
  emailButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  hiddenPhoneNumber?: ReactNode;
  onChangePhone?: () => void;
  onRequestEmailCode?: () => void;
  phoneMode?: LegacyAuthenticationPhoneConfirmationPhoneMode;
  phoneNumber: ReactNode;
  resendButtonLabel?: ReactNode;
  resendButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  safetyLabel?: ReactNode;
  showEmailButton?: boolean;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
  title?: ReactNode;
}

export default function AuthenticationPhoneConfirmation(
  props: LegacyAuthenticationPhoneConfirmationProps
): JSX.Element;
