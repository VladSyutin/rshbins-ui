import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacySuccessfulAuthenticationProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function SuccessfulAuthentication(props: LegacySuccessfulAuthenticationProps): JSX.Element | null;
