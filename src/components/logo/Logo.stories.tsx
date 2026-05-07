import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './Logo';

const meta = {
  title: 'Modern/Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  args: {
    state: 'default'
  }
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

const wrapperStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  padding: '24px',
  background: 'var(--color-background-default-primary)',
  borderRadius: '24px'
};

export const Playground: Story = {
  render: (args) => (
    <div style={wrapperStyle}>
      <Logo {...args} />
    </div>
  )
};

export const States: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={wrapperStyle}>
      <Logo />
      <Logo state="focused" />
    </div>
  )
};
