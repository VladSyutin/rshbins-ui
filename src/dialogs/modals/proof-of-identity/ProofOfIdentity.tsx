import { useEffect, useRef, useState, type ReactNode } from 'react';
import './ProofOfIdentity.scss';
import gosuslugiIconUrl from '../../../../icons/gosuslugi.svg';
import { Button } from '../../../components/button/Button';
import { InputSurname, isSurnameValueValid, type InputSurnameProps } from '../../../components/input-surname/InputSurname';
import { Modal, type ModalPlacement, type ModalPreviewState } from '../../../components/modal/Modal';

export interface ProofOfIdentityProps {
  closeOnContinue?: boolean;
  continueLabel?: ReactNode;
  continueLoading?: boolean;
  continueLoadingDuration?: number;
  defaultLastNameValue?: string;
  description?: ReactNode;
  heading?: ReactNode;
  lastNameInputProps?: Omit<
    InputSurnameProps,
    'className' | 'defaultValue' | 'label' | 'onValueChange' | 'value'
  >;
  lastNameLabel?: ReactNode;
  lastNameValue?: string;
  onClose?: () => void;
  onContinue?: () => void;
  onLogInThroughGosuslugi?: () => void;
  onLastNameValueChange?: (value: string) => void;
  placement?: ModalPlacement;
  previewState?: ModalPreviewState;
}

/**
 * Proof-of-identity dialog template composed from the shared modal, input and button components.
 */
export function ProofOfIdentity({
  closeOnContinue = false,
  continueLabel = 'Продолжить',
  continueLoading = false,
  continueLoadingDuration = 3000,
  defaultLastNameValue = '',
  description = 'Вы давно не заходили в личный кабинет. Пожалуйста, подтвердите личность',
  heading = 'Подтверждение личности',
  lastNameInputProps,
  lastNameLabel = 'Фамилия',
  lastNameValue,
  onClose,
  onContinue,
  onLogInThroughGosuslugi,
  onLastNameValueChange,
  placement = 'inline',
  previewState = 'shown'
}: ProofOfIdentityProps) {
  const isControlled = lastNameValue !== undefined;
  const [uncontrolledLastNameValue, setUncontrolledLastNameValue] = useState(defaultLastNameValue);
  const [isContinuePending, setIsContinuePending] = useState(false);
  const continueTimerRef = useRef<number | null>(null);
  const resolvedLastNameValue = isControlled ? String(lastNameValue ?? '') : uncontrolledLastNameValue;
  const resolvedContinueLoading = continueLoading || isContinuePending;
  const isContinueDisabled = resolvedContinueLoading || !isSurnameValueValid(resolvedLastNameValue);

  function clearContinueTimer() {
    if (continueTimerRef.current === null) {
      return;
    }

    window.clearTimeout(continueTimerRef.current);
    continueTimerRef.current = null;
  }

  function handleLastNameValueChange(nextValue: string) {
    if (!isControlled) {
      setUncontrolledLastNameValue(nextValue);
    }

    onLastNameValueChange?.(nextValue);
  }

  function handleContinue(requestClose: () => void) {
    if (resolvedContinueLoading || !isSurnameValueValid(resolvedLastNameValue)) {
      return;
    }

    setIsContinuePending(true);
    clearContinueTimer();
    continueTimerRef.current = window.setTimeout(() => {
      continueTimerRef.current = null;
      setIsContinuePending(false);
      onContinue?.();

      if (closeOnContinue) {
        requestClose();
      }
    }, continueLoadingDuration);
  }

  useEffect(() => clearContinueTimer, []);

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
            loading={resolvedContinueLoading}
            onClick={() => handleContinue(requestClose)}
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
      <div className="rshb-dialog-modal rshb-dialog-modal--proof-of-identity">
        <div className="rshb-dialog-modal__field">
          <InputSurname
            {...lastNameInputProps}
            label={lastNameLabel}
            onValueChange={handleLastNameValueChange}
            value={resolvedLastNameValue}
          />
        </div>
      </div>
    </Modal>
  );
}
