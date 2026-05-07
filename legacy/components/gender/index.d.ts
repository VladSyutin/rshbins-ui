import type { ChangeEvent, HTMLAttributes, ReactNode } from 'react';

export type LegacyGenderValue = 'male' | 'female';

export interface LegacyGenderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  className?: string;
  defaultValue?: LegacyGenderValue;
  disabled?: boolean;
  femaleLabel?: ReactNode;
  invalid?: boolean;
  maleLabel?: ReactNode;
  name?: string;
  onChange?: (value: LegacyGenderValue, event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: LegacyGenderValue;
}

export default function Gender(props: LegacyGenderProps): JSX.Element;
