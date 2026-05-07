import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordHasAlreadyBeenUsed } from './PasswordHasAlreadyBeenUsed';

const meta = {
  title: 'Modern/Dialogs/Toasts/PasswordHasAlreadyBeenUsed',
  component: PasswordHasAlreadyBeenUsed,
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
} satisfies Meta<typeof PasswordHasAlreadyBeenUsed>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
