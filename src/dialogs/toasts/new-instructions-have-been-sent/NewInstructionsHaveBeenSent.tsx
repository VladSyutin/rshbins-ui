import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type NewInstructionsHaveBeenSentProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function NewInstructionsHaveBeenSent(props: NewInstructionsHaveBeenSentProps) {
  return <DialogToastTemplate {...props} message="Новая инструкция отправлена" variant="success" />;
}
