import type { Meta, StoryObj } from '@storybook/react-vite';
import { NewInstructionsHaveBeenSent } from './NewInstructionsHaveBeenSent';

const meta = {
  title: 'Modern/Dialogs/Toasts/NewInstructionsHaveBeenSent',
  component: NewInstructionsHaveBeenSent,
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
} satisfies Meta<typeof NewInstructionsHaveBeenSent>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
