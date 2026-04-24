import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type TheLinkHasExpiredProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function TheLinkHasExpired(props: TheLinkHasExpiredProps) {
  return <DialogToastTemplate {...props} message="Срок действия ссылки истёк" variant="danger" />;
}
