import type { ReactNode } from 'react';
import type { LegacyInputTextProps } from '../input-text/index.js';

export interface LegacyInputSurnameProps
  extends Omit<
    LegacyInputTextProps,
    'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'
  > {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

export function isSurnameValueValid(value: string): boolean;
export default function InputSurname(props: LegacyInputSurnameProps): JSX.Element;
