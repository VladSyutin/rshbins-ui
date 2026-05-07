import type { ChangeEvent, HTMLAttributes, ReactNode } from 'react';

export type LegacyRadioGroupDirection = 'vertical' | 'horizontal';

export interface LegacyRadioGroupOption {
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  value: string;
}

export interface LegacyRadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  className?: string;
  defaultValue?: string;
  direction?: LegacyRadioGroupDirection;
  disabled?: boolean;
  name?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  options: LegacyRadioGroupOption[];
  required?: boolean;
  value?: string;
}

export default function RadioGroup(props: LegacyRadioGroupProps): JSX.Element;
