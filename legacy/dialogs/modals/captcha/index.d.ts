import type { ReactNode } from 'react';
import type { LegacyModalPlacement, LegacyModalPreviewState } from '../../../components/modal/index.js';

export interface LegacyCaptchaProps {
  captchaLabel?: ReactNode;
  closeOnContinue?: boolean;
  continueLabel?: ReactNode;
  continueLoading?: boolean;
  defaultCodeValue?: string;
  description?: ReactNode;
  heading?: ReactNode;
  inputLabel?: ReactNode;
  inputValue?: string;
  onClose?: () => void;
  onContinue?: () => void;
  onInputValueChange?: (value: string) => void;
  onLogInThroughGosuslugi?: () => void;
  onRefreshCaptcha?: () => void;
  onVoiceCaptcha?: () => void;
  placement?: LegacyModalPlacement;
  previewState?: LegacyModalPreviewState;
}

export default function Captcha(props: LegacyCaptchaProps): JSX.Element;
