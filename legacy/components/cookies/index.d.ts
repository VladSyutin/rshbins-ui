import type { HTMLAttributes, ReactNode } from 'react';

export type LegacyCookiesSize = 's' | 'xs';
export type LegacyCookiesPlacement = 'inline' | 'bottom-center';
export type LegacyCookiesPreviewState = 'shown' | 'closing';

export interface LegacyCookiesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  className?: string;
  closeOnPrimaryAction?: boolean;
  description?: ReactNode;
  heading?: ReactNode;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  placement?: LegacyCookiesPlacement;
  previewState?: LegacyCookiesPreviewState;
  primaryActionLabel?: string | null;
  secondaryActionLabel?: string | null;
  size?: LegacyCookiesSize;
}

export default function Cookies(props: LegacyCookiesProps): JSX.Element;
