import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch, type SwitchPreviewState, type SwitchProps } from './Switch';

const meta = {
  title: 'Modern/Components/Switch',
  component: Switch,
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
    onChange: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;
type MatrixVariant = 'inactive' | 'active';

const previewStates: SwitchPreviewState[] = ['default', 'hover', 'focused'];
const variants: Array<{ label: string; value: MatrixVariant }> = [
  { label: 'Inactive', value: 'inactive' },
  { label: 'Active', value: 'active' }
];

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: '12px 16px',
  alignItems: 'center',
  gridTemplateColumns: '120px repeat(3, max-content)'
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

function matrixProps(variant: MatrixVariant, previewState: SwitchPreviewState): Partial<SwitchProps> {
  if (variant === 'active') {
    return {
      checked: true,
      previewState,
      readOnly: true
    };
  }

  return {
    previewState,
    readOnly: true
  };
}

export const Playground: Story = {
  render: ({ defaultChecked = false, onChange, ...args }) => {
    const [checked, setChecked] = useState(Boolean(defaultChecked));

    useEffect(() => {
      setChecked(Boolean(defaultChecked));
    }, [defaultChecked]);

    return (
      <div style={surfaceStyle}>
        <Switch
          {...args}
          checked={checked}
          onChange={(event) => {
            setChecked(event.target.checked);
            onChange?.(event);
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
      <h3 style={titleStyle}>Base states</h3>
      <div style={matrixStyle}>
        <div />
        {previewStates.map((state) => (
          <p key={state} style={metaStyle}>
            {state}
          </p>
        ))}
        {variants.flatMap((variant) => [
          <p key={`${variant.value}-label`} style={metaStyle}>
            {variant.label}
          </p>,
          ...previewStates.map((state) => (
            <Switch
              {...matrixProps(variant.value, state)}
              key={`${variant.value}-${state}`}
              label="Контент"
            />
          ))
        ])}
      </div>
    </div>
  )
};
