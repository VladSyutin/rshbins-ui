import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacyTheUserIsRegisteredProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function TheUserIsRegistered(props: LegacyTheUserIsRegisteredProps): JSX.Element | null;
