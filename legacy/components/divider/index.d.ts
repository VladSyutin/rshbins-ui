import type { HTMLAttributes, ReactNode } from 'react';

export type LegacyDividerView = 'text' | 'without-text';

export interface LegacyDividerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  label?: ReactNode;
  view?: LegacyDividerView;
}

export default function Divider(props: LegacyDividerProps): JSX.Element;
