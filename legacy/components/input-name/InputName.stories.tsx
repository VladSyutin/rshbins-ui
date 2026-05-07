import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputNameProps } from './index.js';
import InputName from './index.js';

const meta = {
  title: 'Legacy/Components/InputName',
  component: InputName,
  tags: ['autodocs'],
  args: {
    clearable: true,
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'Имя',
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
} satisfies Meta<typeof InputName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputNameProps) => (
    <div style={surfaceStyle}>
      <InputName {...args} />
    </div>
  )
};

export const Entered: Story = {
  args: {
    value: 'Анна'
  },
  render: (args: LegacyInputNameProps) => (
    <div style={surfaceStyle}>
      <InputName {...args} />
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
