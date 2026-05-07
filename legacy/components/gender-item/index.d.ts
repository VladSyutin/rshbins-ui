import type { InputHTMLAttributes, ReactNode } from 'react';

export type LegacyGenderItemPosition = 'left' | 'right';
export type LegacyGenderItemPreviewState = 'default' | 'hover' | 'focused';

export interface LegacyGenderItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  className?: string;
  grouped?: boolean;
  invalid?: boolean;
  label: ReactNode;
  position?: LegacyGenderItemPosition;
  previewState?: LegacyGenderItemPreviewState;
}

export default function GenderItem(props: LegacyGenderItemProps): JSX.Element;
