import React from 'react';
import './styles.css';
import Logo from '../logo/index.js';
import Theme from '../theme/index.js';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

export default function Header(props) {
  const {
    brandButtonProps,
    brandLabel,
    className,
    size,
    themeProps,
    ...rest
  } = props;

  const resolvedBrandLabel = brandLabel !== undefined ? brandLabel : 'РСХБ Страхование';
  const resolvedSize = size || 'responsive';

  const brandClassName = brandButtonProps && brandButtonProps.className;
  const brandAriaLabel = brandButtonProps && brandButtonProps['aria-label'];
  const brandRestProps = Object.assign({}, brandButtonProps);
  delete brandRestProps.className;
  delete brandRestProps['aria-label'];

  const themeClassName = 'rshb-legacy-header__theme';
  const resolvedThemeProps = Object.assign({ applyToDocument: false }, themeProps, {
    className: themeClassName
  });

  return (
    <header
      {...rest}
      className={joinClassNames('rshb-legacy-header', className)}
      data-size={resolvedSize}
    >
      <button
        {...brandRestProps}
        aria-label={brandAriaLabel || resolvedBrandLabel}
        className={joinClassNames('rshb-legacy-header__brand', brandClassName)}
        type="button"
      >
        <Logo className="rshb-legacy-header__brand-logo" />
      </button>
      <Theme {...resolvedThemeProps} />
    </header>
  );
}
