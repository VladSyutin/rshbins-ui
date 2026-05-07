import type { HTMLAttributes } from 'react';

export type LegacySpinSize = '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl';

export interface LegacySpinProps extends HTMLAttributes<HTMLSpanElement> {
  label?: string;
  size?: LegacySpinSize;
}

export default function Spin(props: LegacySpinProps): JSX.Element;
