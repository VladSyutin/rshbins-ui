import type { ReactNode } from 'react';
import type { LegacyInputTextProps } from '../input-text/index.js';

export interface LegacyInputCaptchaProps
  extends Omit<
    LegacyInputTextProps,
    'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'
  > {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

export function isCaptchaValueValid(value: string): boolean;
export default function InputCaptcha(props: LegacyInputCaptchaProps): JSX.Element;
