import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyRadioPreviewState } from './index.js';
import Radio from './index.js';

const states: Array<{
  checked?: boolean;
  label: string;
  previewState: LegacyRadioPreviewState;
}> = [
  { label: 'Inactive', previewState: 'default' },
  { label: 'Hover', previewState: 'hover' },
  { label: 'Focused', previewState: 'focused' },
  { checked: true, label: 'Active', previewState: 'default' }
];

const meta = {
  title: 'Legacy/Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: {
    defaultChecked: false,
    label: 'Контент',
    previewState: 'default'
  },
  argTypes: {
    checked: {
      control: false,
      table: {
        disable: true
      }
    },
    name: {
      control: false,
      table: {
        disable: true
      }
    },
    onChange: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ defaultChecked = false, onChange, ...args }) => {
    const [checked, setChecked] = useState(Boolean(defaultChecked));

    useEffect(() => {
      setChecked(Boolean(defaultChecked));
    }, [defaultChecked]);

    return (
      <div style={surfaceStyle}>
        <Radio
          {...args}
          checked={checked}
          name="legacy-storybook-radio-playground"
          onChange={(event) => {
            setChecked(event.target.checked);
            if (onChange) {
              onChange(event);
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
      <section style={stackStyle}>
        <h3 style={titleStyle}>Base states</h3>
        <p style={metaStyle}>
          Состояния вспомогательного `_Radio` из Figma: inactive, hover, focused и active.
        </p>
        <div style={rowStyle}>
          {states.map((state) => (
            <Radio
              checked={state.checked}
              key={state.label}
              label="Контент"
              name={'legacy-storybook-radio-overview-' + state.label}
              previewState={state.previewState}
              readOnly
            />
          ))}
        </div>
      </section>
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

const stackStyle: CSSProperties = {
  display: 'grid',
  gap: '16px'
};

const rowStyle: CSSProperties = {
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
