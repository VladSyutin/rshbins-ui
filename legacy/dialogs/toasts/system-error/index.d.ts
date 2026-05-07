import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacySystemErrorProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function SystemError(props: LegacySystemErrorProps): JSX.Element | null;
