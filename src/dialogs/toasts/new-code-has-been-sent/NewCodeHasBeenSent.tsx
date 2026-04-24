import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type NewCodeHasBeenSentProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function NewCodeHasBeenSent(props: NewCodeHasBeenSentProps) {
  return <DialogToastTemplate {...props} message="Новый код отправлен" variant="success" />;
}
