import type { ReactNode } from 'react';
import type { LegacyToastPlacement, LegacyToastPreviewState, LegacyToastVariant } from '../../../components/toast/index.js';

export interface LegacyDialogToastTemplateProps {
  autoCloseDuration?: number | null;
  className?: string;
  closable?: boolean;
  closeLabel?: string;
  message: ReactNode;
  onClose?: () => void;
  placement?: LegacyToastPlacement;
  previewState?: LegacyToastPreviewState;
  variant: LegacyToastVariant;
}

export default function DialogToastTemplate(props: LegacyDialogToastTemplateProps): JSX.Element;
