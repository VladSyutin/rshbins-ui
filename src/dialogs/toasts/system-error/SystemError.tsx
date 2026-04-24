import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type SystemErrorProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function SystemError(props: SystemErrorProps) {
  return <DialogToastTemplate {...props} message="Что-то пошло не так" variant="danger" />;
}
