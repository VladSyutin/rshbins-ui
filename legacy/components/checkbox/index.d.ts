import type { InputHTMLAttributes, ReactNode } from 'react';

export type LegacyCheckboxSize = 'm' | 's';
export type LegacyCheckboxPreviewState = 'default' | 'hover' | 'focused';

export interface LegacyCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  className?: string;
  invalid?: boolean;
  label?: ReactNode;
  previewState?: LegacyCheckboxPreviewState;
  size?: LegacyCheckboxSize;
}

export default function Checkbox(props: LegacyCheckboxProps): JSX.Element;
