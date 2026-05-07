import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GenderItem, type GenderItemProps } from './GenderItem';

const meta = {
  title: 'Modern/Components/GenderItem',
  component: GenderItem,
  tags: ['autodocs'],
  args: {
    checked: false,
    invalid: false,
    label: 'Муж',
    position: 'left',
    previewState: 'default'
  },
  argTypes: {
    defaultChecked: {
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
} satisfies Meta<typeof GenderItem>;

export default meta;

type Story = StoryObj<typeof meta>;
type MatrixVariant = 'inactive' | 'focused' | 'active' | 'error' | 'error-hover' | 'hover';

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
  gridTemplateColumns: '140px repeat(4, max-content)'
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

const columns: Array<{
  label: string;
  props: Pick<GenderItemProps, 'label' | 'position'>;
}> = [
  { label: 'Left', props: { label: 'Муж', position: 'left' } },
  { label: 'Right', props: { label: 'Жен', position: 'right' } },
  { label: 'Left', props: { label: 'Муж', position: 'left' } },
  { label: 'Right', props: { label: 'Жен', position: 'right' } }
];

const rows: Array<{ label: string; variants: MatrixVariant[] }> = [
  { label: 'Inactive', variants: ['inactive', 'inactive', 'hover', 'hover'] },
  { label: 'Focused / Active', variants: ['focused', 'focused', 'active', 'active'] },
  { label: 'Error / Error Hover', variants: ['error', 'error', 'error-hover', 'error-hover'] }
];

function stateProps(variant: MatrixVariant): Partial<GenderItemProps> {
  if (variant === 'active') {
    return {
      checked: true,
      previewState: 'default',
      readOnly: true
    };
  }

  if (variant === 'error') {
    return {
      invalid: true,
      previewState: 'default',
      readOnly: true
    };
  }

  if (variant === 'error-hover') {
    return {
      invalid: true,
      previewState: 'hover',
      readOnly: true
    };
  }

  if (variant === 'focused') {
    return {
      previewState: 'focused',
      readOnly: true
    };
  }

  if (variant === 'hover') {
    return {
      previewState: 'hover',
      readOnly: true
    };
  }

  return {
    readOnly: true
  };
}

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <GenderItem {...args} readOnly />
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
      <h3 style={titleStyle}>Figma State Matrix</h3>
      <div style={matrixStyle}>
        <div />
        {columns.map((column, index) => (
          <p key={`${column.label}-${index}`} style={metaStyle}>
            {column.label}
          </p>
        ))}
        {rows.flatMap((row) => [
          <p key={`${row.label}-label`} style={metaStyle}>
            {row.label}
          </p>,
          ...row.variants.map((variant, index) => (
            <GenderItem
              {...columns[index].props}
              {...stateProps(variant)}
              key={`${row.label}-${columns[index].label}-${variant}-${index}`}
            />
          ))
        ])}
      </div>
    </div>
  )
};
