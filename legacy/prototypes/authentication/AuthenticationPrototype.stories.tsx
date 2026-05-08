import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationPrototype from './index.js';

const meta = {
  title: 'Legacy/Prototypes/Authentication/AuthenticationPrototype',
  component: AuthenticationPrototype,
  parameters: {
    controls: {
      expanded: true
    },
    fullscreenPrototype: true,
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AuthenticationPrototype>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Responsive: Story = {};
