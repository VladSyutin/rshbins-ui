import type { Meta, StoryObj } from '@storybook/react-vite';
import { Captcha } from './Captcha';

const meta = {
  title: 'Modern/Dialogs/Modals/Captcha',
  component: Captcha,
  tags: ['autodocs'],
  args: {
    captchaLabel: '        ',
    defaultCodeValue: '',
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
    onInputValueChange: {
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
    },
    onRefreshCaptcha: {
      control: false,
      table: {
        disable: true
      }
    },
    onVoiceCaptcha: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Captcha>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    defaultCodeValue: '4876'
  }
};
