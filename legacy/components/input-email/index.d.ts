import type { ReactNode } from 'react';
import type { LegacyInputTextProps } from '../input-text/index.js';

export interface LegacyInputEmailProps
  extends Omit<
    LegacyInputTextProps,
    'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'
  > {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

export function isEmailValueValid(value: string): boolean;
export default function InputEmail(props: LegacyInputEmailProps): JSX.Element;
