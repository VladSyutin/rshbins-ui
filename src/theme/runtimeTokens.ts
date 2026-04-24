import runtimeTokens from '../../design-tokens/normalized/runtime.tokens.json';

export const runtimeTokenData = runtimeTokens;

export type ThemeName = keyof typeof runtimeTokenData.semantic.color;

export const themeNames = Object.keys(runtimeTokenData.semantic.color) as ThemeName[];

export function cssVar(name: string): string {
  return `var(--${name})`;
}
