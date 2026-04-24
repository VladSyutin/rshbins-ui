import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type TheUserIsRegisteredProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function TheUserIsRegistered(props: TheUserIsRegisteredProps) {
  return <DialogToastTemplate {...props} message="Пользователь зарегистрирован" variant="danger" />;
}
