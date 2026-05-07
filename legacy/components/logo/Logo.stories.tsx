import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Logo from './index.js';

const meta = {
  title: 'Legacy/Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  args: {
    state: 'default'
  }
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <Logo {...args} />
    </div>
  )
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        <section className="theme-light" style={cardStyle}>
          <h3 style={titleStyle}>Light</h3>
          <Logo />
        </section>
        <section className="theme-dark" style={cardStyle}>
          <h3 style={titleStyle}>Dark</h3>
          <Logo />
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  padding: '20px',
  borderRadius: '16px',
  border: '1px dashed var(--color-border-default-default)',
  background: 'var(--color-background-default-primary)'
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)'
};
