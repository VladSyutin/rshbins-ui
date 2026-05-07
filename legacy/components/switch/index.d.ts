import type { InputHTMLAttributes, ReactNode } from 'react';

export type LegacySwitchPreviewState = 'default' | 'hover' | 'focused';

export interface LegacySwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> {
  label?: ReactNode;
  previewState?: LegacySwitchPreviewState;
}

export default function Switch(props: LegacySwitchProps): JSX.Element;
