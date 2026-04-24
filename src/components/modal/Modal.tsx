import { useEffect, useId, useRef, useState, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import './Modal.scss';
import arrowRotateLeftIconUrl from '../../../icons/arrow-rotate-left.svg';
import volumeRegularIconUrl from '../../../icons/volume-regular.svg';
import { Button } from '../button/Button';

export type ModalVariant = 'default' | 'captcha' | 'text-input';
export type ModalPlacement = 'inline' | 'top-center';
export type ModalPreviewState = 'shown' | 'closing';

export interface ModalActionsRenderContext {
  requestClose: () => void;
}

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  actions?: ReactNode | ((context: ModalActionsRenderContext) => ReactNode);
  captchaLabel?: ReactNode;
  closeOnPrimaryAction?: boolean;
  closeOnTertiaryAction?: boolean;
  children?: ReactNode;
  description?: ReactNode;
  heading?: ReactNode;
  inputPlaceholder?: string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'placeholder'>;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onRefreshCaptcha?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onVoiceCaptcha?: () => void;
  placement?: ModalPlacement;
  previewState?: ModalPreviewState;
  primaryActionLabel?: string | null;
  secondaryActionLabel?: string | null;
  tertiaryActionLabel?: string | null;
  variant?: ModalVariant;
}

const MODAL_EXIT_DURATION = 150;

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Token-driven modal translated from the Figma variants with reusable action slots.
 */
export function Modal({
  actions,
  captchaLabel,
  className,
  children,
  closeOnPrimaryAction = true,
  closeOnTertiaryAction = true,
  description = 'Что-то пошло не так. Пожалуйста, повторите попытку позже.',
  heading = 'Ошибка',
  inputPlaceholder = 'Название',
  inputProps,
  onClose,
  onPrimaryAction,
  onRefreshCaptcha,
  onSecondaryAction,
  onTertiaryAction,
  onVoiceCaptcha,
  placement = 'inline',
  previewState = 'shown',
  primaryActionLabel,
  role,
  secondaryActionLabel,
  tertiaryActionLabel,
  variant = 'default',
  ...props
}: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const headingId = useId();
  const descriptionId = useId();
  const resolvedPreviewState: ModalPreviewState = isClosing ? 'closing' : previewState;
  const resolvedPrimaryActionLabel = primaryActionLabel ?? (variant === 'default' ? 'Закрыть' : 'Продолжить');
  const resolvedTertiaryActionLabel = tertiaryActionLabel ?? (variant === 'default' ? null : 'Закрыть');
  const shouldRenderInput = variant === 'captcha' || variant === 'text-input';
  const shouldRenderCaptcha = variant === 'captcha';

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
    }, MODAL_EXIT_DURATION);
  }

  function handlePrimaryAction() {
    onPrimaryAction?.();

    if (closeOnPrimaryAction) {
      requestClose();
    }
  }

  function handleTertiaryAction() {
    onTertiaryAction?.();

    if (closeOnTertiaryAction) {
      requestClose();
    }
  }

  useEffect(() => clearCloseTimer, []);

  const resolvedActions = typeof actions === 'function' ? actions({ requestClose }) : actions;

  const modalContent = (
    <div
      {...props}
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={heading ? headingId : undefined}
      aria-modal={placement === 'top-center' ? 'true' : undefined}
      className={joinClassNames('rshb-modal', className)}
      data-placement={placement}
      data-preview-state={resolvedPreviewState}
      data-variant={variant}
      role={role ?? 'dialog'}
    >
      <div className="rshb-modal__copy">
        {heading ? (
          <p className="rshb-modal__title" id={headingId}>
            {heading}
          </p>
        ) : null}
        {description ? (
          <p className="rshb-modal__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>

      {children ?? (
        <>
          {shouldRenderCaptcha ? (
            <div className="rshb-modal__captcha">
              <div aria-hidden="true" className="rshb-modal__captcha-symbols">
                {captchaLabel ? <span className="rshb-modal__captcha-text">{captchaLabel}</span> : null}
              </div>
              <Button
                aria-label="Обновить капчу"
                className="rshb-modal__icon-action"
                iconOnly
                leadingIcon={<img alt="" src={arrowRotateLeftIconUrl} />}
                onClick={onRefreshCaptcha}
                variant="flat-primary"
              />
              <Button
                aria-label="Озвучить капчу"
                className="rshb-modal__icon-action"
                iconOnly
                leadingIcon={<img alt="" src={volumeRegularIconUrl} />}
                onClick={onVoiceCaptcha}
                variant="flat-primary"
              />
            </div>
          ) : null}

          {shouldRenderInput ? (
            <label className="rshb-modal__field">
              <input {...inputProps} className="rshb-modal__input" placeholder={inputPlaceholder} />
            </label>
          ) : null}
        </>
      )}

      {resolvedActions ?? (
        <div className="rshb-modal__actions">
          {resolvedPrimaryActionLabel ? (
            <Button className="rshb-modal__action-button" onClick={handlePrimaryAction} variant="brand">
              {resolvedPrimaryActionLabel}
            </Button>
          ) : null}
          {secondaryActionLabel ? (
            <Button className="rshb-modal__action-button" onClick={onSecondaryAction} variant="normal">
              {secondaryActionLabel}
            </Button>
          ) : null}
          {resolvedTertiaryActionLabel ? (
            <Button className="rshb-modal__action-button" onClick={handleTertiaryAction} variant="flat-primary">
              {resolvedTertiaryActionLabel}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );

  if (placement === 'top-center') {
    return (
      <div className="rshb-modal-layer" data-preview-state={resolvedPreviewState}>
        {modalContent}
      </div>
    );
  }

  return modalContent;
}
