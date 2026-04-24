import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuccessfulAuthentication } from './SuccessfulAuthentication';

const meta = {
  title: 'Dialogs/Toasts/SuccessfulAuthentication',
  component: SuccessfulAuthentication,
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
} satisfies Meta<typeof SuccessfulAuthentication>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
