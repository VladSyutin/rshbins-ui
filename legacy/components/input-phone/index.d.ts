import type { InputHTMLAttributes, ReactNode } from 'react';
import type { LegacyInputTextPreviewState } from '../input-text/index.js';

export interface LegacyInputPhoneProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'defaultValue' | 'prefix' | 'size' | 'type' | 'value'
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
  value?: string;
}

export default function InputPhone(props: LegacyInputPhoneProps): JSX.Element;
