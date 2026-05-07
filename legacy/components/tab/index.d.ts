import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type LegacyTabPreviewState = 'default' | 'hover' | 'focused';

export interface LegacyTabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: ReactNode;
  leadingIcon?: ReactNode;
  previewState?: LegacyTabPreviewState;
  selected?: boolean;
  trailingIcon?: ReactNode;
}

export default function Tab(props: LegacyTabProps): JSX.Element;
