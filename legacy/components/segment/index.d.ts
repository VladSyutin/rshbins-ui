import type { InputHTMLAttributes, ReactNode } from 'react';

export type LegacySegmentPreviewState = 'default' | 'hover' | 'focused';

export interface LegacySegmentProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  className?: string;
  label: ReactNode;
  leadingIcon?: ReactNode;
  previewState?: LegacySegmentPreviewState;
  trailingIcon?: ReactNode;
}

export default function Segment(props: LegacySegmentProps): JSX.Element;
