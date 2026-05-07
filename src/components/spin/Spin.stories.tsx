import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spin } from './Spin';

const meta = {
  title: 'Modern/Components/Spin',
  component: Spin,
  tags: ['autodocs'],
  args: {
    size: '2xs'
  }
} satisfies Meta<typeof Spin>;

export default meta;

type Story = StoryObj<typeof meta>;

const sizes = ['2xs', 'xs', 's', 'm', 'l', 'xl'] as const;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)',
  color: 'var(--color-text-brand-default)'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap'
};

const captionStyle: CSSProperties = {
  minWidth: '48px',
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <Spin {...args} />
    </div>
  )
};

export const Sizes: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      {sizes.map((size) => (
        <div key={size} style={rowStyle}>
          <p style={captionStyle}>{size.toUpperCase()}</p>
          <Spin size={size} />
        </div>
      ))}
    </div>
  )
};
