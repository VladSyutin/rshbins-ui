import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Divider from './index.js';

const meta = {
  title: 'Legacy/Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  args: {
    label: 'или',
    view: 'text'
  }
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <Divider {...args} />
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
      <div style={gridStyle}>
        <section className="theme-light" style={cardStyle}>
          <h3 style={titleStyle}>Light</h3>
          <div style={stackStyle}>
            <p style={labelStyle}>With text</p>
            <Divider />
          </div>
          <div style={stackStyle}>
            <p style={labelStyle}>Without text</p>
            <Divider view="without-text" />
          </div>
        </section>
        <section className="theme-dark" style={cardStyle}>
          <h3 style={titleStyle}>Dark</h3>
          <div style={stackStyle}>
            <p style={labelStyle}>With text</p>
            <Divider />
          </div>
          <div style={stackStyle}>
            <p style={labelStyle}>Without text</p>
            <Divider view="without-text" />
          </div>
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
  background: 'var(--color-background-default-primary)'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  padding: '20px',
  borderRadius: '16px',
  border: '1px dashed var(--color-border-default-default)',
  background: 'var(--color-background-default-primary)'
};

const stackStyle: CSSProperties = {
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

const labelStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
