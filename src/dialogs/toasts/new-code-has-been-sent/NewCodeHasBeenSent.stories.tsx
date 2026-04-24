import type { Meta, StoryObj } from '@storybook/react-vite';
import { NewCodeHasBeenSent } from './NewCodeHasBeenSent';

const meta = {
  title: 'Dialogs/Toasts/NewCodeHasBeenSent',
  component: NewCodeHasBeenSent,
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
} satisfies Meta<typeof NewCodeHasBeenSent>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
