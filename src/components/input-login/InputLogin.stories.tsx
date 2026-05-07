import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputLogin } from './InputLogin';

const meta = {
  title: 'Modern/Components/InputLogin',
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

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <InputLogin {...args} />
    </div>
  )
};

export const Entered: Story = {
  args: {
    value: 'client_123'
  },
  render: (args) => (
    <div style={surfaceStyle}>
      <InputLogin {...args} />
    </div>
  )
};
