import type { Meta, StoryObj } from '@storybook/react-vite';
import { LogInThroughTheGosuslugi } from './LogInThroughTheGosuslugi';

const meta = {
  title: 'Dialogs/Modals/LogInThroughTheGosuslugi',
  component: LogInThroughTheGosuslugi,
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
} satisfies Meta<typeof LogInThroughTheGosuslugi>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
