import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacyPasswordChangeIsAvailableOnceEveryXHoursProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function PasswordChangeIsAvailableOnceEveryXHours(props: LegacyPasswordChangeIsAvailableOnceEveryXHoursProps): JSX.Element | null;
