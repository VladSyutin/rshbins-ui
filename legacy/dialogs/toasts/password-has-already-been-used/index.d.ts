import type { LegacyDialogToastTemplateProps } from '../shared/index.js';

export type LegacyPasswordHasAlreadyBeenUsedProps = Omit<LegacyDialogToastTemplateProps, 'message' | 'variant'>;

export default function PasswordHasAlreadyBeenUsed(props: LegacyPasswordHasAlreadyBeenUsedProps): JSX.Element | null;
