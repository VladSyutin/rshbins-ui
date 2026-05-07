import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputSurname } from './InputSurname';

const meta = {
  title: 'Modern/Components/InputSurname',
  component: InputSurname,
  tags: ['autodocs'],
  args: {
    clearable: true,
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'Фамилия',
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
} satisfies Meta<typeof InputSurname>;

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
      <InputSurname {...args} />
    </div>
  )
};

export const Entered: Story = {
  args: {
    value: 'Иванова'
  },
  render: (args) => (
    <div style={surfaceStyle}>
      <InputSurname {...args} />
    </div>
  )
};
