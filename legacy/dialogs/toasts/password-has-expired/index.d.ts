import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacyPasswordHasExpiredProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function PasswordHasExpired(props: LegacyPasswordHasExpiredProps): JSX.Element | null;
