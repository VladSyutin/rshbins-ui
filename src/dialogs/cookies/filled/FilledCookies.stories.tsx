import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilledCookies } from './FilledCookies';

const meta = {
  title: 'Dialogs/Cookies/FilledCookies',
  component: FilledCookies,
  tags: ['autodocs'],
  args: {
    placement: 'inline',
    previewState: 'shown',
    primaryActionLabel: 'Понятно',
    size: 's'
  },
  argTypes: {
    onClose: {
      control: false,
      table: {
        disable: true
      }
    },
    onPrimaryAction: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof FilledCookies>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    size: 'xs'
  }
};
