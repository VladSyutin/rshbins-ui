import type { ReactNode } from 'react';

export type LegacyInputCodeItemPreviewState = 'default' | 'typing' | 'loading' | 'error';
export type LegacyInputCodeItemCompletionBehavior = 'error' | 'reset';

export interface LegacyInputCodeItemProps {
  autoFocus?: boolean;
  className?: string;
  completionBehavior?: LegacyInputCodeItemCompletionBehavior;
  complementaryIcon?: ReactNode;
  complementaryText?: ReactNode;
  loadingDuration?: number;
  onComplete?: (code: string) => void;
  onValueChange?: (code: string) => void;
  previewState?: LegacyInputCodeItemPreviewState;
  showComplementaryIcon?: boolean;
  showComplementaryText?: boolean;
}

export default function InputCodeItem(props: LegacyInputCodeItemProps): JSX.Element;
