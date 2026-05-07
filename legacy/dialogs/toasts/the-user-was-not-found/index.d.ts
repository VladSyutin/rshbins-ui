import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacyTheUserWasNotFoundProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function TheUserWasNotFound(props: LegacyTheUserWasNotFoundProps): JSX.Element | null;
