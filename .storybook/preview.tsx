import type { Preview } from '@storybook/react-vite';
import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/300-italic.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/400-italic.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/500-italic.css';
import '@fontsource/ubuntu/700.css';
import '@fontsource/ubuntu/700-italic.css';
import '../src/styles/global.scss';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: {
        method: 'alphabetical'
      }
    },
    backgrounds: {
      disable: true
    },
    controls: {
      expanded: true
    }
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'UI theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ]
      }
    }
  },
  decorators: [
    (Story, context) => {
      if (context.parameters.fullscreenPrototype) {
        return <Story />;
      }

      return (
        <div className={`storybook-surface theme-${context.globals.theme}`}>
          <Story />
        </div>
      );
    }
  ]
};

export default preview;
