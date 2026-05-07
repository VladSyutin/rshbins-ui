import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import RadioGroup from './index.js';

const defaultOptions = [
  { label: 'Контент', value: 'first' },
  { label: 'Контент', value: 'second' },
  { label: 'Контент', value: 'third' }
];

const meta = {
  title: 'Legacy/Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    defaultValue: 'first',
    direction: 'vertical',
    options: defaultOptions
  },
  argTypes: {
    onChange: {
      control: false,
      table: {
        disable: true
      }
    },
    value: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ defaultValue = 'first', onChange, options, ...args }) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    return (
      <div style={surfaceStyle}>
        <RadioGroup
          {...args}
          options={options}
          value={value}
          onChange={(nextValue, event) => {
            setValue(nextValue);
            if (onChange) {
              onChange(nextValue, event);
            }
          }}
        />
      </div>
    );
  }
};

export const Overview: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        <section style={sectionStyle}>
          <h3 style={titleStyle}>Vertical</h3>
          <p style={metaStyle}>
            Базовая композиция из основной Figma-ноды с одним выбранным `Radio`.
          </p>
          <RadioGroup
            defaultValue="first"
            direction="vertical"
            options={[
              { label: 'Контент', value: 'first' },
              { label: 'Контент', value: 'second' }
            ]}
          />
        </section>
        <section style={sectionStyle}>
          <h3 style={titleStyle}>Horizontal</h3>
          <p style={metaStyle}>
            Горизонтальная раскладка с тем же single-select поведением.
          </p>
          <RadioGroup
            defaultValue="first"
            direction="horizontal"
            options={[
              { label: 'Контент', value: 'first' },
              { label: 'Контент', value: 'second' }
            ]}
          />
        </section>
      </div>
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

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, max-content))'
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '12px'
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)'
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
