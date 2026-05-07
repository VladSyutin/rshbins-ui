import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import type { LegacyThemeProps } from '../theme/index.js';

export type LegacyHeaderSize = 'l' | 'm' | 's' | 'xs' | 'responsive';

export interface LegacyHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  brandLabel?: string;
  className?: string;
  size?: LegacyHeaderSize;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
}

export default function Header(props: LegacyHeaderProps): JSX.Element;
