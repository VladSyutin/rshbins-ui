import type { HTMLAttributes } from 'react';

export type LegacyLogoState = 'default' | 'focused';

export interface LegacyLogoProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
  state?: LegacyLogoState;
}

export default function Logo(props: LegacyLogoProps): JSX.Element;
