import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyCheckboxPreviewState, LegacyCheckboxProps, LegacyCheckboxSize } from './index.js';
import Checkbox from './index.js';

const previewStates: LegacyCheckboxPreviewState[] = ['default', 'hover', 'focused'];
const sizes: Array<{ label: string; value: LegacyCheckboxSize }> = [
  { label: 'Size M', value: 'm' },
  { label: 'Size S', value: 's' }
];
type MatrixVariant = 'inactive' | 'active' | 'error';
const variants: Array<{ label: string; value: MatrixVariant }> = [
  { label: 'Inactive', value: 'inactive' },
  { label: 'Active', value: 'active' },
  { label: 'Error', value: 'error' }
];

const meta = {
  title: 'Legacy/Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    invalid: false,
    label: 'Контент',
    previewState: 'default',
    size: 'm'
  }
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

function matrixProps(variant: MatrixVariant, previewState: LegacyCheckboxPreviewState): Partial<LegacyCheckboxProps> {
  if (variant === 'active') {
    return {
      checked: true,
      previewState,
      readOnly: true
    };
  }

  if (variant === 'error') {
    return {
      invalid: true,
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
  render: (args: LegacyCheckboxProps) => (
    <div style={surfaceStyle}>
      <Checkbox {...args} />
    </div>
  )
};

export const Overview: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      {sizes.map((size) => (
        <section key={size.value} style={sectionStyle}>
          <h3 style={titleStyle}>{size.label}</h3>
          <div style={matrixStyle}>
            <div />
            {previewStates.map((state) => (
              <p key={`${size.value}-${state}`} style={metaStyle}>
                {state}
              </p>
            ))}
            {variants.flatMap((variant) => [
              <p key={`${size.value}-${variant.value}-label`} style={metaStyle}>
                {variant.label}
              </p>,
              ...previewStates.map((state) => (
                <Checkbox
                  {...matrixProps(variant.value, state)}
                  key={`${size.value}-${variant.value}-${state}`}
                  label="Контент"
                  size={size.value}
                />
              ))
            ])}
          </div>
        </section>
      ))}
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '16px'
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
