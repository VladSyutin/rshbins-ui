import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeout } from './Timeout';

const meta = {
  title: 'Dialogs/Modals/Timeout',
  component: Timeout,
  tags: ['autodocs'],
  args: {
    placement: 'inline',
    previewState: 'shown'
  },
  argTypes: {
    onClose: {
      control: false,
      table: {
        disable: true
      }
    },
    onLogInThroughGosuslugi: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Timeout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
