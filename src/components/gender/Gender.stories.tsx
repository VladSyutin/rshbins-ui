import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gender, type GenderProps, type GenderValue } from './Gender';

const meta = {
  title: 'Modern/Components/Gender',
  component: Gender,
  tags: ['autodocs'],
  args: {
    defaultValue: undefined,
    femaleLabel: 'Жен',
    invalid: false,
    maleLabel: 'Муж'
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
} satisfies Meta<typeof Gender>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, max-content))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '12px'
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)'
};

const states: Array<{ label: string; props: Partial<GenderProps> }> = [
  { label: 'Default', props: {} },
  { label: 'Male selected', props: { value: 'male' } },
  { label: 'Female selected', props: { value: 'female' } },
  { label: 'Error', props: { invalid: true, value: undefined } }
];

export const Playground: Story = {
  render: ({ defaultValue, onChange, ...args }) => {
    const [value, setValue] = useState<GenderValue | undefined>(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    return (
      <div style={surfaceStyle}>
        <Gender
          {...args}
          value={value}
          onChange={(nextValue, event) => {
            setValue(nextValue);
            onChange?.(nextValue, event);
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
        {states.map((state) => (
          <section key={state.label} style={cardStyle}>
            <h3 style={titleStyle}>{state.label}</h3>
            <p style={metaStyle}>Композиция из двух GenderItem внутри общей рамки.</p>
            <Gender {...state.props} />
          </section>
        ))}
      </div>
    </div>
  )
};
