import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type LegacyButtonVariant = 'brand' | 'normal' | 'flat-primary' | 'flat-secondary';
export type LegacyButtonSize = 'm' | 's';
export type LegacyButtonPreviewState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'pressed'
  | 'disabled'
  | 'loading'
  | 'selection';

export interface LegacyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  loading?: boolean;
  previewState?: LegacyButtonPreviewState;
  selected?: boolean;
  size?: LegacyButtonSize;
  trailingIcon?: ReactNode;
  variant?: LegacyButtonVariant;
}

export default function Button(props: LegacyButtonProps): JSX.Element;
