import type { ReactNode } from 'react';
import type { LegacyModalPlacement, LegacyModalPreviewState } from '../../../components/modal/index.js';

export interface LegacyTimeoutProps {
  countdownDurationSeconds?: number;
  description?: ReactNode;
  heading?: ReactNode;
  onClose?: () => void;
  onLogInThroughGosuslugi?: () => void;
  placement?: LegacyModalPlacement;
  previewState?: LegacyModalPreviewState;
}

export default function Timeout(props: LegacyTimeoutProps): JSX.Element;
