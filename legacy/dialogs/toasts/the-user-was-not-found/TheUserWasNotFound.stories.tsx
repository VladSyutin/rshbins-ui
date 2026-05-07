import type { Meta, StoryObj } from '@storybook/react-vite';
import TheUserWasNotFound from './index.js';

const meta = {
  title: 'Legacy/Dialogs/Toasts/TheUserWasNotFound',
  component: TheUserWasNotFound,
  tags: ['autodocs'],
  args: {
    autoCloseDuration: null,
    closable: true,
    placement: 'inline',
    previewState: 'shown'
  },
  argTypes: {
    onClose: { control: false, table: { disable: true } }
  }
} satisfies Meta<typeof TheUserWasNotFound>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
