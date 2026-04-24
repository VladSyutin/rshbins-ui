import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmailConfirmed } from './EmailConfirmed';

const meta = {
  title: 'Dialogs/Toasts/EmailConfirmed',
  component: EmailConfirmed,
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
} satisfies Meta<typeof EmailConfirmed>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
