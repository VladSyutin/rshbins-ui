import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputEmail } from './InputEmail';

const meta = {
  title: 'Modern/Components/InputEmail',
  component: InputEmail,
  tags: ['autodocs'],
  args: {
    clearable: true,
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'Электронная почта',
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
} satisfies Meta<typeof InputEmail>;

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
      <InputEmail {...args} />
    </div>
  )
};

export const Entered: Story = {
  args: {
    value: 'client@example.ru'
  },
  render: (args) => (
    <div style={surfaceStyle}>
      <InputEmail {...args} />
    </div>
  )
};
