import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.scss';
import { Spin } from '../spin/Spin';

export type ButtonVariant = 'brand' | 'normal' | 'flat-primary' | 'flat-secondary';
export type ButtonSize = 'm' | 's';
export type ButtonPreviewState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'pressed'
  | 'disabled'
  | 'loading'
  | 'selection';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  loading?: boolean;
  previewState?: ButtonPreviewState;
  selected?: boolean;
  size?: ButtonSize;
  trailingIcon?: ReactNode;
  variant?: ButtonVariant;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function resolveState({
  disabled,
  loading,
  previewState,
  selected
}: Pick<ButtonProps, 'disabled' | 'loading' | 'previewState' | 'selected'>): ButtonPreviewState {
  if (loading) {
    return 'loading';
  }

  if (disabled) {
    return 'disabled';
  }

  if (selected) {
    return 'selection';
  }

  return previewState ?? 'default';
}

/**
 * Token-driven button component translated from the Figma UI kit matrix.
 */
export function Button({
  children,
  className,
  disabled = false,
  iconOnly = false,
  leadingIcon,
  loading = false,
  previewState,
  selected = false,
  size = 'm',
  trailingIcon,
  type = 'button',
  variant = 'brand',
  ...props
}: ButtonProps) {
  const resolvedState = resolveState({
    disabled,
    loading,
    previewState,
    selected
  });
  const iconOnlyIcon = leadingIcon ?? trailingIcon;
  const isDisabledLike = resolvedState === 'disabled' || resolvedState === 'loading';
  const implicitAriaLabel = typeof children === 'string' ? children : undefined;
  const ariaLabel = props['aria-label'] ?? (iconOnly ? implicitAriaLabel : undefined);

  const content = (
    <span
      className={joinClassNames(
        'rshb-button__content',
        resolvedState === 'loading' && 'rshb-button__content--ghost'
      )}
    >
      {iconOnly ? (
        iconOnlyIcon ? (
          <span aria-hidden="true" className="rshb-button__icon">
            {iconOnlyIcon}
          </span>
        ) : null
      ) : (
        <>
          {leadingIcon ? (
            <span aria-hidden="true" className="rshb-button__icon">
              {leadingIcon}
            </span>
          ) : null}
          <span className="rshb-button__label">{children}</span>
          {trailingIcon ? (
            <span aria-hidden="true" className="rshb-button__icon">
              {trailingIcon}
            </span>
          ) : null}
        </>
      )}
    </span>
  );

  return (
    <button
      {...props}
      aria-busy={resolvedState === 'loading' || undefined}
      aria-label={ariaLabel}
      className={joinClassNames(
        'rshb-button',
        resolvedState === 'loading' && 'rshb-button--loading',
        className
      )}
      data-icon-only={iconOnly ? 'true' : 'false'}
      data-size={size}
      data-state={resolvedState}
      data-variant={variant}
      disabled={isDisabledLike}
      type={type}
    >
      {content}
      {resolvedState === 'loading' ? (
        <span aria-hidden="true" className="rshb-button__spinner">
          <Spin size={size === 'm' ? 's' : 'xs'} />
        </span>
      ) : null}
    </button>
  );
}
