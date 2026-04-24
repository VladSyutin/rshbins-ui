import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type EmailConfirmedProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function EmailConfirmed(props: EmailConfirmedProps) {
  return <DialogToastTemplate {...props} message="Адрес эл. почты подтверждён" variant="success" />;
}
