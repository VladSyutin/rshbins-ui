import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  async viteFinal(config) {
    return {
      ...config,
      server: {
        ...config.server,
        fs: {
          ...config.server?.fs,
          allow: [
            ...(config.server?.fs?.allow ?? []),
            path.resolve(__dirname, '..'),
            path.resolve(__dirname, '../node_modules'),
            path.resolve(__dirname, '../../../../node_modules')
          ]
        }
      },
      legacy: {
        ...config.legacy,
        inconsistentCjsInterop: true
      }
    };
  }
};

export default config;
