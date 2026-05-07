import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationEmailConfirmation from './index.js';

const meta = {
  title: 'Legacy/Templates/Authentication/AuthenticationEmailConfirmation',
  component: AuthenticationEmailConfirmation,
  tags: ['autodocs'],
  args: {
    email: 'user@example.com',
    device: 'desktop'
  }
} satisfies Meta<typeof AuthenticationEmailConfirmation>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-secondary)'
};

const storyWidthStyle: CSSProperties = {
  width: '448px',
  maxWidth: '100%'
};

const mobileWidthStyle: CSSProperties = {
  width: '361px',
  maxWidth: '100%'
};

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationEmailConfirmation
          {...args}
          onChangeEmail={() => console.log('Change email')}
        />
      </div>
    </div>
  )
};

export const VisibleEmail: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationEmailConfirmation {...args} emailMode="visible" />
      </div>
    </div>
  )
};

export const HiddenEmail: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationEmailConfirmation {...args} emailMode="hidden" />
      </div>
    </div>
  )
};

export const Mobile: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={mobileWidthStyle}>
        <AuthenticationEmailConfirmation {...args} device="mobile" />
      </div>
    </div>
  )
};

export const Overview: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(448px, max-content))' }}>
        <div style={storyWidthStyle}>
          <AuthenticationEmailConfirmation {...args} emailMode="visible" />
        </div>
        <div style={storyWidthStyle}>
          <AuthenticationEmailConfirmation {...args} emailMode="hidden" />
        </div>
      </div>
    </div>
  )
};
