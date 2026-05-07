import type { HTMLAttributes, ReactNode } from 'react';
import type { LegacyInputTextProps } from '../input-text/index.js';

export type LegacyModalVariant = 'default' | 'captcha' | 'text-input';
export type LegacyModalPlacement = 'inline' | 'top-center';
export type LegacyModalPreviewState = 'shown' | 'closing';

export interface LegacyModalActionsRenderContext {
  requestClose: () => void;
}

export interface LegacyModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  actions?: ReactNode | ((context: LegacyModalActionsRenderContext) => ReactNode);
  captchaLabel?: ReactNode;
  closeOnPrimaryAction?: boolean;
  closeOnTertiaryAction?: boolean;
  children?: ReactNode;
  description?: ReactNode;
  heading?: ReactNode;
  inputPlaceholder?: string;
  inputProps?: Omit<LegacyInputTextProps, 'className' | 'label'>;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onRefreshCaptcha?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onVoiceCaptcha?: () => void;
  placement?: LegacyModalPlacement;
  previewState?: LegacyModalPreviewState;
  primaryActionLabel?: string | null;
  secondaryActionLabel?: string | null;
  tertiaryActionLabel?: string | null;
  variant?: LegacyModalVariant;
}

export default function Modal(props: LegacyModalProps): JSX.Element;
