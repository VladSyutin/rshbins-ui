import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacyEmailConfirmedProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function EmailConfirmed(props: LegacyEmailConfirmedProps): JSX.Element | null;
