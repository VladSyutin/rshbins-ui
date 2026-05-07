import type { ReactNode } from 'react';
import type { LegacyInputTextProps } from '../input-text/index.js';

export interface LegacyInputLoginProps
  extends Omit<
    LegacyInputTextProps,
    'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'
  > {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

export default function InputLogin(props: LegacyInputLoginProps): JSX.Element;
