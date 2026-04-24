import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProofOfIdentity } from './ProofOfIdentity';

const meta = {
  title: 'Dialogs/Modals/ProofOfIdentity',
  component: ProofOfIdentity,
  tags: ['autodocs'],
  args: {
    defaultLastNameValue: '',
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
    onContinue: {
      control: false,
      table: {
        disable: true
      }
    },
    onLastNameValueChange: {
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
} satisfies Meta<typeof ProofOfIdentity>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    defaultLastNameValue: 'Иванов'
  }
};
