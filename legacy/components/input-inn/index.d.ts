import type { ReactNode } from 'react';
import type { LegacyInputTextProps } from '../input-text/index.js';

export interface LegacyInputInnProps
  extends Omit<
    LegacyInputTextProps,
    'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'
  > {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

export default function InputInn(props: LegacyInputInnProps): JSX.Element;
