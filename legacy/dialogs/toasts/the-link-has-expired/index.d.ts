import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacyTheLinkHasExpiredProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function TheLinkHasExpired(props: LegacyTheLinkHasExpiredProps): JSX.Element | null;
