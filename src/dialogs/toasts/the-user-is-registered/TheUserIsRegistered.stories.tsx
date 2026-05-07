import type { Meta, StoryObj } from '@storybook/react-vite';
import { TheUserIsRegistered } from './TheUserIsRegistered';

const meta = {
  title: 'Modern/Dialogs/Toasts/TheUserIsRegistered',
  component: TheUserIsRegistered,
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
} satisfies Meta<typeof TheUserIsRegistered>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
