import './LogInThroughTheGosuslugi.scss';
import type { CSSProperties, ReactNode } from 'react';
import gosuslugiIconUrl from '../../../../icons/gosuslugi.svg';
import { Button } from '../../../components/button/Button';
import { Modal, type ModalPlacement, type ModalPreviewState } from '../../../components/modal/Modal';

export interface LogInThroughTheGosuslugiProps {
  description?: ReactNode;
  heading?: ReactNode;
  onClose?: () => void;
  onLogInThroughGosuslugi?: () => void;
  placement?: ModalPlacement;
  previewState?: ModalPreviewState;
}

/**
 * Gosuslugi-login dialog template composed from the shared modal and button components.
 */
export function LogInThroughTheGosuslugi({
  description = 'Пользователь с такими данными уже зарегистрирован. Пожалуйста, подтвердите личность через Госуслуги',
  heading = 'Войдите через Госуслуги',
  onClose,
  onLogInThroughGosuslugi,
  placement = 'inline',
  previewState = 'shown'
}: LogInThroughTheGosuslugiProps) {
  const gosuslugiIconStyle = {
    '--rshb-dialog-modal-icon-url': `url("${gosuslugiIconUrl}")`
  } as CSSProperties;

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
