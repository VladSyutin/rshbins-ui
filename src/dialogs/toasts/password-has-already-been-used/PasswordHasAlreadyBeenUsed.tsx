import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type PasswordHasAlreadyBeenUsedProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function PasswordHasAlreadyBeenUsed(props: PasswordHasAlreadyBeenUsedProps) {
  return <DialogToastTemplate {...props} message="Пароль уже был использован" variant="danger" />;
}
