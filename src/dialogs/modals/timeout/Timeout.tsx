import './Timeout.scss';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import gosuslugiIconUrl from '../../../../icons/gosuslugi.svg';
import { Button } from '../../../components/button/Button';
import { Modal, type ModalPlacement, type ModalPreviewState } from '../../../components/modal/Modal';

export interface TimeoutProps {
  countdownDurationSeconds?: number;
  description?: ReactNode;
  heading?: ReactNode;
  onClose?: () => void;
  onLogInThroughGosuslugi?: () => void;
  placement?: ModalPlacement;
  previewState?: ModalPreviewState;
}

/**
 * Timeout dialog template composed from the shared modal and button components.
 */
export function Timeout({
  countdownDurationSeconds = 30 * 60,
  description,
  heading = 'Подозрительная активность',
  onClose,
  onLogInThroughGosuslugi,
  placement = 'inline',
  previewState = 'shown'
}: TimeoutProps) {
  const [secondsLeft, setSecondsLeft] = useState(countdownDurationSeconds);
  const gosuslugiIconStyle = {
    '--rshb-dialog-modal-icon-url': `url("${gosuslugiIconUrl}")`
  } as CSSProperties;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${String(seconds).padStart(2, '0')}`;
  const resolvedDescription =
    description ??
    (secondsLeft > 0
      ? `Слишком много попыток ввода. Войдите через Госуслуги или продолжите через ${formattedTime}`
      : 'Слишком много попыток ввода. Теперь можно повторить попытку');

  useEffect(() => {
    setSecondsLeft(countdownDurationSeconds);
  }, [countdownDurationSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [secondsLeft]);

  return (
    <Modal
      description={resolvedDescription}
      heading={heading}
      onClose={onClose}
      placement={placement}
      previewState={previewState}
      actions={({ requestClose }) => (
        <div className="rshb-dialog-modal__actions">
          <Button
            className="rshb-dialog-modal__action"
            leadingIcon={<span aria-hidden="true" className="rshb-dialog-modal__action-icon" style={gosuslugiIconStyle} />}
            onClick={onLogInThroughGosuslugi}
            variant="brand"
          >
            Войти через Госуслуги
          </Button>
          <Button
            className="rshb-dialog-modal__action rshb-dialog-modal__close"
            onClick={requestClose}
            variant="flat-primary"
          >
            Закрыть
          </Button>
        </div>
      )}
    />
  );
}
