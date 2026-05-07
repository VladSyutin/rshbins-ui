import type { ChangeEvent, HTMLAttributes, ReactNode } from 'react';

export interface LegacySegmentedControlOption {
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  value: string;
}

export interface LegacySegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  options: LegacySegmentedControlOption[];
  required?: boolean;
  value?: string;
}

export default function SegmentedControl(props: LegacySegmentedControlProps): JSX.Element;
