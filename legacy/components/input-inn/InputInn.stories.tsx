import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputInnProps } from './index.js';
import InputInn from './index.js';

const meta = {
  title: 'Legacy/Components/InputInn',
  component: InputInn,
  tags: ['autodocs'],
  args: {
    clearable: true,
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'ИНН',
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
} satisfies Meta<typeof InputInn>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputInnProps) => (
    <div style={surfaceStyle}>
      <InputInn {...args} />
    </div>
  )
};

export const Entered: Story = {
  args: {
    value: '1234567890'
  },
  render: (args: LegacyInputInnProps) => (
    <div style={surfaceStyle}>
      <InputInn {...args} />
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
