import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacyNewCodeHasBeenSentProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function NewCodeHasBeenSent(props: LegacyNewCodeHasBeenSentProps): JSX.Element | null;
