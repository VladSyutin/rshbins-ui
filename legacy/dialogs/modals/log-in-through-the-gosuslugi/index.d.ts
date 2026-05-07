import type { ReactNode } from 'react';
import type { LegacyModalPlacement, LegacyModalPreviewState } from '../../../components/modal/index.js';

export interface LegacyLogInThroughTheGosuslugiProps {
  description?: ReactNode;
  heading?: ReactNode;
  onClose?: () => void;
  onLogInThroughGosuslugi?: () => void;
  placement?: LegacyModalPlacement;
  previewState?: LegacyModalPreviewState;
}

export default function LogInThroughTheGosuslugi(props: LegacyLogInThroughTheGosuslugiProps): JSX.Element;
