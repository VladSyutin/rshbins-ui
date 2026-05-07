import type { Meta, StoryObj } from '@storybook/react-vite';
import PasswordHasExpired from './index.js';

const meta = {
  title: 'Legacy/Dialogs/Toasts/PasswordHasExpired',
  component: PasswordHasExpired,
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
} satisfies Meta<typeof PasswordHasExpired>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
