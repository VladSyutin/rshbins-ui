import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import InputMiddleName from './index.js';

const meta = {
  title: 'Legacy/Components/InputMiddleName',
  component: InputMiddleName,
  tags: ['autodocs'],
  args: {
    clearable: true,
    defaultValue: '',
    defaultWithoutMiddleName: false,
    helperText: 'Вспомогательный текст',
    invalid: false,
    showHelperIcon: false,
    switchLabel: 'Нет отчества'
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
    onWithoutMiddleNameChange: {
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
    },
    withoutMiddleName: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof InputMiddleName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ defaultWithoutMiddleName = false, ...args }) => {
    const [withoutMiddleName, setWithoutMiddleName] = useState(defaultWithoutMiddleName);

    useEffect(() => {
      setWithoutMiddleName(defaultWithoutMiddleName);
    }, [defaultWithoutMiddleName]);

    return (
      <div style={surfaceStyle}>
        <InputMiddleName
          {...args}
          onWithoutMiddleNameChange={setWithoutMiddleName}
          withoutMiddleName={withoutMiddleName}
        />
      </div>
    );
  }
};

export const WithoutMiddleName: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <InputMiddleName defaultValue="Иванович" defaultWithoutMiddleName />
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
