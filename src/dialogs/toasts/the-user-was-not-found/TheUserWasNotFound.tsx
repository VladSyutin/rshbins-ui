import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type TheUserWasNotFoundProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function TheUserWasNotFound(props: TheUserWasNotFoundProps) {
  return <DialogToastTemplate {...props} message="Пользователь не найден" variant="danger" />;
}
