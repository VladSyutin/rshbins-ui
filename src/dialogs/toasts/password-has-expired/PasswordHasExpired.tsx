import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type PasswordHasExpiredProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function PasswordHasExpired(props: PasswordHasExpiredProps) {
  return <DialogToastTemplate {...props} message="Срок действия пароля истёк" variant="danger" />;
}
