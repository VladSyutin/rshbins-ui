import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputLoginProps } from './index.js';
import InputLogin from './index.js';

const meta = {
  title: 'Legacy/Components/InputLogin',
  component: InputLogin,
  tags: ['autodocs'],
  args: {
    clearable: true,
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'Логин',
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
} satisfies Meta<typeof InputLogin>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputLoginProps) => (
    <div style={surfaceStyle}>
      <InputLogin {...args} />
    </div>
  )
};

export const Entered: Story = {
  args: {
    value: 'client_123'
  },
  render: (args: LegacyInputLoginProps) => (
    <div style={surfaceStyle}>
      <InputLogin {...args} />
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
