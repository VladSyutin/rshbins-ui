import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type SuccessfulAuthenticationProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function SuccessfulAuthentication(props: SuccessfulAuthenticationProps) {
  return <DialogToastTemplate {...props} message="Успешный вход" variant="success" />;
}
