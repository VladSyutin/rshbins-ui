import type { ReactNode } from 'react';
import type { LegacyInputTextProps } from '../input-text/index.js';

export interface LegacyInputMiddleNameProps
  extends Omit<
    LegacyInputTextProps,
    'disabled' | 'helperText' | 'inputMode' | 'label' | 'type'
  > {
  defaultWithoutMiddleName?: boolean;
  disabled?: boolean;
  helperText?: ReactNode;
  onWithoutMiddleNameChange?: (checked: boolean) => void;
  switchLabel?: string;
  withoutMiddleName?: boolean;
}

export function isMiddleNameValueValid(value: string): boolean;
export default function InputMiddleName(props: LegacyInputMiddleNameProps): JSX.Element;
