import type { ReactNode } from 'react';
import type { LegacyCookiesPlacement, LegacyCookiesPreviewState, LegacyCookiesSize } from '../../../components/cookies/index.js';

export interface LegacyFilledCookiesProps {
  className?: string;
  closeOnPrimaryAction?: boolean;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  placement?: LegacyCookiesPlacement;
  policyHref?: string;
  policyLabel?: ReactNode;
  previewState?: LegacyCookiesPreviewState;
  primaryActionLabel?: string | null;
  size?: LegacyCookiesSize;
  textPrefix?: ReactNode;
  textSuffix?: ReactNode;
}

export default function FilledCookies(props: LegacyFilledCookiesProps): JSX.Element;
