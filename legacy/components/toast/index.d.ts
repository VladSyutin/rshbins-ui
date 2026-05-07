import type { HTMLAttributes, ReactNode } from 'react';

export type LegacyToastVariant = 'danger' | 'success';
export type LegacyToastPreviewState = 'shown' | 'closing';
export type LegacyToastPlacement = 'inline' | 'top-center';

export interface LegacyToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  autoCloseDuration?: number | null;
  children?: ReactNode;
  closeLabel?: string;
  closable?: boolean;
  onClose?: () => void;
  placement?: LegacyToastPlacement;
  previewState?: LegacyToastPreviewState;
  variant?: LegacyToastVariant;
}

export default function Toast(props: LegacyToastProps): JSX.Element | null;
