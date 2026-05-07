import type { ReactNode } from 'react';
import type { LegacyModalPlacement, LegacyModalPreviewState } from '../../../components/modal/index.js';

export interface LegacyProofOfIdentityProps {
  closeOnContinue?: boolean;
  continueLabel?: ReactNode;
  continueLoading?: boolean;
  continueLoadingDuration?: number;
  defaultLastNameValue?: string;
  description?: ReactNode;
  heading?: ReactNode;
  lastNameLabel?: ReactNode;
  lastNameValue?: string;
  onClose?: () => void;
  onContinue?: () => void;
  onLastNameValueChange?: (value: string) => void;
  onLogInThroughGosuslugi?: () => void;
  placement?: LegacyModalPlacement;
  previewState?: LegacyModalPreviewState;
}

export default function ProofOfIdentity(props: LegacyProofOfIdentityProps): JSX.Element;
