import type { InputHTMLAttributes, ReactNode } from 'react';

export type LegacyInputTextPreviewState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'typing'
  | 'entered'
  | 'entered-hover'
  | 'error'
  | 'error-hover'
  | 'error-entered'
  | 'error-entered-hover'
  | 'disabled'
  | 'disabled-entered'
  | 'keyboard-focused';

export interface LegacyInputTextProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'defaultValue' | 'prefix' | 'size' | 'value'
  > {
  className?: string;
  clearable?: boolean;
  defaultValue?: string;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  invalid?: boolean;
  label?: ReactNode;
  onValueChange?: (value: string) => void;
  previewState?: LegacyInputTextPreviewState;
  showHelperIcon?: boolean;
  startIcon?: ReactNode;
  value?: string;
}

export default function InputText(props: LegacyInputTextProps): JSX.Element;
