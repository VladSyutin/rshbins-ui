import type { ReactNode } from 'react';
import {
  Toast,
  type ToastPlacement,
  type ToastPreviewState,
  type ToastVariant
} from '../../../components/toast/Toast';

export interface DialogToastTemplateProps {
  autoCloseDuration?: number | null;
  className?: string;
  closable?: boolean;
  closeLabel?: string;
  message: ReactNode;
  onClose?: () => void;
  placement?: ToastPlacement;
  previewState?: ToastPreviewState;
  variant: ToastVariant;
}

/**
 * Shared dialog-toast template composed from the base Toast component.
 */
export function DialogToastTemplate({
  autoCloseDuration = 5000,
  className,
  closable = true,
  closeLabel = 'Закрыть уведомление',
  message,
  onClose,
  placement = 'inline',
  previewState = 'shown',
  variant
}: DialogToastTemplateProps) {
  return (
    <Toast
      autoCloseDuration={autoCloseDuration}
      className={className}
      closable={closable}
      closeLabel={closeLabel}
      onClose={onClose}
      placement={placement}
      previewState={previewState}
      variant={variant}
    >
      {message}
    </Toast>
  );
}
