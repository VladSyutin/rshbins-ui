import type { HTMLAttributes } from 'react';

export type LegacyLoaderBrandLogoStep = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type LegacyLoaderBrandTextStep = '1' | '2' | '3' | '4';

export interface LegacyLoaderBrandProps extends HTMLAttributes<HTMLDivElement> {
  autoPlay?: boolean;
  logoStep?: LegacyLoaderBrandLogoStep;
  textStep?: LegacyLoaderBrandTextStep;
}

export default function LoaderBrand(props: LegacyLoaderBrandProps): JSX.Element;
