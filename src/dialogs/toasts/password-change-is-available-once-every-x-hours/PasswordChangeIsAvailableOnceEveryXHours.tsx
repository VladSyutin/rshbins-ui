import { DialogToastTemplate, type DialogToastTemplateProps } from '../shared/DialogToastTemplate';

export type PasswordChangeIsAvailableOnceEveryXHoursProps = Omit<DialogToastTemplateProps, 'message' | 'variant'>;

export function PasswordChangeIsAvailableOnceEveryXHours(props: PasswordChangeIsAvailableOnceEveryXHoursProps) {
  return <DialogToastTemplate {...props} message="Смена пароля доступна раз в 24 ч" variant="danger" />;
}
