import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacyNewInstructionsHaveBeenSentProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function NewInstructionsHaveBeenSent(props: LegacyNewInstructionsHaveBeenSentProps): JSX.Element | null;
