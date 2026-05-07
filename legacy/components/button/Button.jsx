import React from 'react';
import './styles.css';
import Spin from '../spin/index.js';

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
          <Spin size={resolvedSize === 'm' ? 's' : 'xs'} />
        </span>
      ) : null}
    </button>
  );
}
