import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthenticationPrototype } from './AuthenticationPrototype';

const meta = {
  title: 'Modern/Prototypes/Authentication/AuthenticationPrototype',
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
