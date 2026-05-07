import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputSurnameProps } from './index.js';
import InputSurname from './index.js';

const meta = {
  title: 'Legacy/Components/InputSurname',
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

export const Playground: Story = {
  render: (args: LegacyInputSurnameProps) => (
    <div style={surfaceStyle}>
      <InputSurname {...args} />
    </div>
  )
};

export const Entered: Story = {
  args: {
    value: 'Иванова'
  },
  render: (args: LegacyInputSurnameProps) => (
    <div style={surfaceStyle}>
      <InputSurname {...args} />
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
