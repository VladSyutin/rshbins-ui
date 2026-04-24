import { useEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import './Toast.scss';
import checkIconUrl from '../../../icons/check.svg';
import triangleExclamationIconUrl from '../../../icons/triangle-exclamation-regular.svg';
import xmarkIconUrl from '../../../icons/xmark.svg';

export type ToastVariant = 'danger' | 'success';
export type ToastPreviewState = 'shown' | 'closing';
export type ToastPlacement = 'inline' | 'top-center';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  autoCloseDuration?: number | null;
  children?: ReactNode;
  closeLabel?: string;
  closable?: boolean;
  onClose?: () => void;
  placement?: ToastPlacement;
  previewState?: ToastPreviewState;
  variant?: ToastVariant;
}

type ToastIconStyle = CSSProperties & {
  '--rshb-toast-icon-url': string;
};

const TOAST_EXIT_DURATION = 150;

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Token-driven toast notification for short success and danger messages.
 */
export function Toast({
  autoCloseDuration = 5000,
  children = 'Контент',
  className,
  closeLabel = 'Закрыть уведомление',
  closable = true,
  onClose,
  placement = 'inline',
  previewState = 'shown',
  role,
  variant = 'danger',
  ...props
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const statusIconUrl = variant === 'success' ? checkIconUrl : triangleExclamationIconUrl;
  const resolvedPreviewState: ToastPreviewState = isClosing ? 'closing' : previewState;
  const statusIconStyle = useMemo<ToastIconStyle>(
    () => ({
      '--rshb-toast-icon-url': `url("${statusIconUrl}")`
    }),
    [statusIconUrl]
  );
  const closeIconStyle = useMemo<ToastIconStyle>(
    () => ({
      '--rshb-toast-icon-url': `url("${xmarkIconUrl}")`
    }),
    []
  );

  function clearCloseTimer() {
    if (closeTimerRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function requestClose() {
    if (isClosing || previewState === 'closing' || !isVisible) {
      return;
    }

    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setIsVisible(false);
      onClose?.();
    }, TOAST_EXIT_DURATION);
  }

  useEffect(() => {
    return clearCloseTimer;
  }, []);

  useEffect(() => {
    if (autoCloseDuration === null || resolvedPreviewState === 'closing' || !isVisible) {
      return undefined;
    }

    const timerId = window.setTimeout(requestClose, autoCloseDuration);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [autoCloseDuration, isVisible, resolvedPreviewState]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      {...props}
      className={joinClassNames('rshb-toast', className)}
      data-placement={placement}
      data-preview-state={resolvedPreviewState}
      data-variant={variant}
      role={role ?? (variant === 'danger' ? 'alert' : 'status')}
    >
      <span aria-hidden="true" className="rshb-toast__status-icon" style={statusIconStyle} />
      <span className="rshb-toast__content">{children}</span>
      {closable ? (
        <button
          aria-label={closeLabel}
          className="rshb-toast__close"
          onClick={requestClose}
          type="button"
        >
          <span aria-hidden="true" className="rshb-toast__close-icon" style={closeIconStyle} />
        </button>
      ) : null}
    </div>
  );
}
