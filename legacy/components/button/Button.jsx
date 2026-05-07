import React from 'react';
import './styles.css';

const SPINNER_PATH =
  'M24 12C24 14.5342 23.1977 17.0033 21.7082 19.0534C20.2187 21.1036 18.1183 22.6296 15.7082 23.4127C13.2981 24.1958 10.7019 24.1958 8.2918 23.4127C5.88167 22.6296 3.78133 21.1036 2.2918 19.0534C0.802259 17.0033 0 14.5342 0 12C0 9.46585 0.80226 6.99675 2.2918 4.94658C3.78133 2.8964 5.88168 1.37042 8.2918 0.587321C10.7019 -0.195774 13.2981 -0.195774 15.7082 0.587322L15.0778 2.52748C13.0774 1.87751 10.9226 1.87751 8.92219 2.52748C6.92179 3.17745 5.17851 4.44402 3.94219 6.14566C2.70588 7.8473 2.04 9.89665 2.04 12C2.04 14.1033 2.70587 16.1527 3.94219 17.8543C5.17851 19.556 6.92179 20.8226 8.92219 21.4725C10.9226 22.1225 13.0774 22.1225 15.0778 21.4725C17.0782 20.8226 18.8215 19.556 20.0578 17.8543C21.2941 16.1527 21.96 14.1033 21.96 12H24Z';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function resolveState(_ref) {
  const disabled = _ref.disabled;
  const loading = _ref.loading;
  const previewState = _ref.previewState;
  const selected = _ref.selected;

  if (loading) {
    return 'loading';
  }

  if (disabled) {
    return 'disabled';
  }

  if (selected) {
    return 'selection';
  }

  return previewState || 'default';
}

export default function Button(props) {
  const {
    children,
    className,
    disabled,
    iconOnly,
    leadingIcon,
    loading,
    previewState,
    selected,
    size,
    trailingIcon,
    type,
    variant
  } = props;

  const buttonProps = Object.assign({}, props);
  delete buttonProps.children;
  delete buttonProps.className;
  delete buttonProps.disabled;
  delete buttonProps.iconOnly;
  delete buttonProps.leadingIcon;
  delete buttonProps.loading;
  delete buttonProps.previewState;
  delete buttonProps.selected;
  delete buttonProps.size;
  delete buttonProps.trailingIcon;
  delete buttonProps.variant;

  const resolvedState = resolveState({
    disabled: Boolean(disabled),
    loading: Boolean(loading),
    previewState: previewState,
    selected: Boolean(selected)
  });
  const resolvedSize = size || 'm';
  const resolvedType = type || 'button';
  const resolvedVariant = variant || 'brand';
  const isIconOnly = Boolean(iconOnly);
  const iconOnlyIcon = leadingIcon || trailingIcon;
  const isDisabledLike = resolvedState === 'disabled' || resolvedState === 'loading';
  const implicitAriaLabel = typeof children === 'string' ? children : undefined;
  const ariaLabel = buttonProps['aria-label'] || (isIconOnly ? implicitAriaLabel : undefined);

  return (
    <button
      {...buttonProps}
      aria-busy={resolvedState === 'loading' ? true : undefined}
      aria-label={ariaLabel}
      className={joinClassNames(
        'rshb-legacy-button',
        resolvedState === 'loading' && 'rshb-legacy-button--loading',
        className
      )}
      data-icon-only={isIconOnly ? 'true' : 'false'}
      data-size={resolvedSize}
      data-state={resolvedState}
      data-variant={resolvedVariant}
      disabled={isDisabledLike}
      type={resolvedType}
    >
      <span
        className={joinClassNames(
          'rshb-legacy-button__content',
          resolvedState === 'loading' && 'rshb-legacy-button__content--ghost'
        )}
      >
        {isIconOnly ? (
          iconOnlyIcon ? (
            <span aria-hidden="true" className="rshb-legacy-button__icon">
              {iconOnlyIcon}
            </span>
          ) : null
        ) : (
          <>
            {leadingIcon ? (
              <span aria-hidden="true" className="rshb-legacy-button__icon">
                {leadingIcon}
              </span>
            ) : null}
            <span className="rshb-legacy-button__label">{children}</span>
            {trailingIcon ? (
              <span aria-hidden="true" className="rshb-legacy-button__icon">
                {trailingIcon}
              </span>
            ) : null}
          </>
        )}
      </span>

      {resolvedState === 'loading' ? (
        <span aria-hidden="true" className="rshb-legacy-button__spinner">
          <svg
            aria-hidden="true"
            className="rshb-legacy-button__spinner-svg"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={SPINNER_PATH} />
          </svg>
        </span>
      ) : null}
    </button>
  );
}
