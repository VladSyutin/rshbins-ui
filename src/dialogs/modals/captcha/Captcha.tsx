import { useState, type ReactNode } from 'react';
import './Captcha.scss';
import arrowRotateLeftIconUrl from '../../../../icons/arrow-rotate-left.svg';
import gosuslugiIconUrl from '../../../../icons/gosuslugi.svg';
import volumeRegularIconUrl from '../../../../icons/volume-regular.svg';
import { Button } from '../../../components/button/Button';
import { InputCaptcha, isCaptchaValueValid, type InputCaptchaProps } from '../../../components/input-captcha/InputCaptcha';
import { Modal, type ModalPlacement, type ModalPreviewState } from '../../../components/modal/Modal';

export interface CaptchaProps {
  captchaLabel?: ReactNode;
  closeOnContinue?: boolean;
  continueLabel?: ReactNode;
  continueLoading?: boolean;
  defaultCodeValue?: string;
  description?: ReactNode;
  heading?: ReactNode;
  inputProps?: Omit<InputCaptchaProps, 'className' | 'defaultValue' | 'label' | 'onValueChange' | 'value'>;
  inputLabel?: ReactNode;
  inputValue?: string;
  onClose?: () => void;
  onContinue?: () => void;
  onInputValueChange?: (value: string) => void;
  onLogInThroughGosuslugi?: () => void;
  onRefreshCaptcha?: () => void;
  onVoiceCaptcha?: () => void;
  placement?: ModalPlacement;
  previewState?: ModalPreviewState;
}

/**
 * Captcha dialog template composed from the shared modal, input and button components.
 */
export function Captcha({
  captchaLabel = '        ',
  closeOnContinue = false,
  continueLabel = 'Продолжить',
  continueLoading = false,
  defaultCodeValue = '',
  description = 'Обнаружена подозрительная активность. Пожалуйста, введите код с картинки',
  heading = 'Подозрительная активность',
  inputLabel = 'Код с картинки',
  inputProps,
  inputValue,
  onClose,
  onContinue,
  onInputValueChange,
  onLogInThroughGosuslugi,
  onRefreshCaptcha,
  onVoiceCaptcha,
  placement = 'inline',
  previewState = 'shown'
}: CaptchaProps) {
  const isControlled = inputValue !== undefined;
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState(defaultCodeValue);
  const resolvedInputValue = isControlled ? String(inputValue ?? '') : uncontrolledInputValue;
  const isContinueDisabled = continueLoading || !isCaptchaValueValid(resolvedInputValue);

  function handleInputValueChange(nextValue: string) {
    if (!isControlled) {
      setUncontrolledInputValue(nextValue);
    }

    onInputValueChange?.(nextValue);
  }

  return (
    <Modal
      description={description}
      heading={heading}
      onClose={onClose}
      placement={placement}
      previewState={previewState}
      actions={({ requestClose }) => (
        <div className="rshb-dialog-modal__actions">
          <Button
            className="rshb-dialog-modal__action"
            disabled={isContinueDisabled}
            loading={continueLoading}
            onClick={() => {
              onContinue?.();

              if (closeOnContinue) {
                requestClose();
              }
            }}
            variant="brand"
          >
            {continueLabel}
          </Button>
          <Button
            className="rshb-dialog-modal__action"
            leadingIcon={<img alt="" src={gosuslugiIconUrl} />}
            onClick={onLogInThroughGosuslugi}
            variant="normal"
          >
            Войти через Госуслуги
          </Button>
          <Button className="rshb-dialog-modal__action rshb-dialog-modal__close" onClick={requestClose} variant="flat-primary">
            Закрыть
          </Button>
        </div>
      )}
    >
      <div className="rshb-dialog-modal rshb-dialog-modal--captcha">
        <div className="rshb-dialog-modal__captcha">
          <div aria-hidden="true" className="rshb-dialog-modal__captcha-symbols">
            <span className="rshb-dialog-modal__captcha-text">{captchaLabel}</span>
          </div>
          <Button
            aria-label="Обновить капчу"
            className="rshb-dialog-modal__captcha-action"
            iconOnly
            leadingIcon={<img alt="" src={arrowRotateLeftIconUrl} />}
            onClick={onRefreshCaptcha}
            variant="flat-primary"
          />
          <Button
            aria-label="Озвучить капчу"
            className="rshb-dialog-modal__captcha-action"
            iconOnly
            leadingIcon={<img alt="" src={volumeRegularIconUrl} />}
            onClick={onVoiceCaptcha}
            variant="flat-primary"
          />
        </div>
        <div className="rshb-dialog-modal__field">
          <InputCaptcha
            {...inputProps}
            label={inputLabel}
            onValueChange={handleInputValueChange}
            value={resolvedInputValue}
          />
        </div>
      </div>
    </Modal>
  );
}
