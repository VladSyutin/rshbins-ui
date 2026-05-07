import type { InputHTMLAttributes, ReactNode } from 'react';

export type LegacyInputBirthDatePreviewState =
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

export type LegacyInputBirthDatePickerMode = 'auto' | 'desktop' | 'native';

export interface LegacyInputBirthDateProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'defaultValue' | 'max' | 'min' | 'onChange' | 'prefix' | 'size' | 'type' | 'value'
  > {
  className?: string;
  clearable?: boolean;
  defaultValue?: Date;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  invalid?: boolean;
  label?: ReactNode;
  max?: Date | string;
  min?: Date | string;
  onValueChange?: (value: Date | undefined) => void;
  pickerMode?: LegacyInputBirthDatePickerMode;
  previewState?: LegacyInputBirthDatePreviewState;
  showHelperIcon?: boolean;
  value?: Date;
}

export function isBirthDateValueValid(value: Date | undefined): boolean;
export default function InputBirthDate(props: LegacyInputBirthDateProps): JSX.Element;
