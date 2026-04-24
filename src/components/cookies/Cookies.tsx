import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import './Cookies.scss';
import { Button } from '../button/Button';

export type CookiesSize = 's' | 'xs';
export type CookiesPlacement = 'inline' | 'bottom-center';
export type CookiesPreviewState = 'shown' | 'closing';

export interface CookiesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  closeOnPrimaryAction?: boolean;
  description?: ReactNode;
  heading?: ReactNode;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  placement?: CookiesPlacement;
  previewState?: CookiesPreviewState;
  primaryActionLabel?: string | null;
  secondaryActionLabel?: string | null;
  size?: CookiesSize;
}

const COOKIES_EXIT_DURATION = 150;

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Cookie consent banner with responsive size variants and bottom-overlay placement.
 */
export function Cookies({
  className,
  closeOnPrimaryAction = true,
  description = 'Описание',
  heading = 'Заголовок',
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  placement = 'inline',
  previewState = 'shown',
  primaryActionLabel = 'Принять',
  secondaryActionLabel = 'Настройки',
  size = 's',
  ...props
}: CookiesProps) {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const resolvedPreviewState: CookiesPreviewState = isClosing ? 'closing' : previewState;

  function clearCloseTimer() {
    if (closeTimerRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function requestClose() {
    if (!onClose || isClosing || previewState === 'closing') {
      return;
    }

    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onClose();
    }, COOKIES_EXIT_DURATION);
  }

  function handlePrimaryAction() {
    onPrimaryAction?.();

    if (closeOnPrimaryAction) {
      requestClose();
    }
  }

  useEffect(() => clearCloseTimer, []);

  return (
    <div
      {...props}
      className={joinClassNames('rshb-cookies', className)}
      data-placement={placement}
      data-preview-state={resolvedPreviewState}
      data-size={size}
    >
      <div className="rshb-cookies__content">
        {heading ? <p className="rshb-cookies__title">{heading}</p> : null}
        <p className="rshb-cookies__description">{description}</p>
      </div>
      {primaryActionLabel || secondaryActionLabel ? (
        <div className="rshb-cookies__actions">
          {primaryActionLabel ? (
            <Button onClick={handlePrimaryAction} size="s" variant="brand">
              {primaryActionLabel}
            </Button>
          ) : null}
          {secondaryActionLabel ? (
            <Button onClick={onSecondaryAction} size="s" variant="normal">
              {secondaryActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
