import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import './Header.scss';
import { Logo } from '../logo/Logo';
import { Theme, type ThemeProps } from '../theme/Theme';

export type HeaderSize = 'l' | 'm' | 's' | 'xs' | 'responsive';

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  brandLabel?: string;
  size?: HeaderSize;
  themeProps?: Omit<ThemeProps, 'className'>;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Responsive page header with the RSHB Insurance logo and the existing theme toggle.
 */
export function Header({
  brandButtonProps,
  brandLabel = 'РСХБ Страхование',
  className,
  size = 'responsive',
  themeProps,
  ...props
}: HeaderProps) {
  const {
    className: brandClassName,
    'aria-label': brandAriaLabel,
    ...brandRestProps
  } = brandButtonProps ?? {};

  return (
    <header
      {...props}
      className={joinClassNames('rshb-header', className)}
      data-size={size}
    >
      <button
        {...brandRestProps}
        aria-label={brandAriaLabel ?? brandLabel}
        className={joinClassNames('rshb-header__brand', brandClassName)}
        type="button"
      >
        <Logo className="rshb-header__brand-logo" />
      </button>
      <Theme
        applyToDocument={false}
        {...themeProps}
        className="rshb-header__theme"
      />
    </header>
  );
}
