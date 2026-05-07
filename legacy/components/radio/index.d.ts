import type { InputHTMLAttributes, ReactNode } from 'react';

export type LegacyRadioPreviewState = 'default' | 'hover' | 'focused';

export interface LegacyRadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  className?: string;
  label?: ReactNode;
  previewState?: LegacyRadioPreviewState;
}

export default function Radio(props: LegacyRadioProps): JSX.Element;
