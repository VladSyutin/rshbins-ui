import type { Meta, StoryObj } from '@storybook/react-vite';
import { TheLinkHasExpired } from './TheLinkHasExpired';

const meta = {
  title: 'Modern/Dialogs/Toasts/TheLinkHasExpired',
  component: TheLinkHasExpired,
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
} satisfies Meta<typeof TheLinkHasExpired>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
