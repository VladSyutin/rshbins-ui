import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputCaptchaProps } from './index.js';
import InputCaptcha from './index.js';

const meta = {
  title: 'Legacy/Components/InputCaptcha',
  component: InputCaptcha,
  tags: ['autodocs'],
  args: {
    clearable: true,
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'Код с картинки',
    showHelperIcon: false
  },
  argTypes: {
    helperIcon: {
      control: false,
      table: {
        disable: true
      }
    },
    onValueChange: {
      control: false,
      table: {
        disable: true
      }
    },
    startIcon: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof InputCaptcha>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputCaptchaProps) => (
    <div style={surfaceStyle}>
      <InputCaptcha {...args} />
    </div>
  )
};

export const Entered: Story = {
  args: {
    value: 'A7#k'
  },
  render: (args: LegacyInputCaptchaProps) => (
    <div style={surfaceStyle}>
      <InputCaptcha {...args} />
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  backgroundColor: 'var(--color-background-default-primary)'
};
