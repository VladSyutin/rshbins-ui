import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationCreatingLoginPassword from './index.js';

const meta = {
  title: 'Legacy/Templates/Authentication/AuthenticationCreatingLoginPassword',
  component: AuthenticationCreatingLoginPassword,
  tags: ['autodocs'],
  args: {
    mode: 'login',
    device: 'desktop'
  }
} satisfies Meta<typeof AuthenticationCreatingLoginPassword>;

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
        <AuthenticationCreatingLoginPassword
          {...args}
          onSubmit={(payload) => console.log('Submit', payload)}
        />
      </div>
    </div>
  )
};

export const CreateLogin: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationCreatingLoginPassword {...args} mode="login" />
      </div>
    </div>
  )
};

export const CreatePassword: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationCreatingLoginPassword {...args} mode="password" />
      </div>
    </div>
  )
};

export const CreateLoginAndPassword: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationCreatingLoginPassword {...args} mode="login-and-password" />
      </div>
    </div>
  )
};

export const Mobile: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={mobileWidthStyle}>
        <AuthenticationCreatingLoginPassword {...args} device="mobile" />
      </div>
    </div>
  )
};

export const Overview: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(448px, max-content))' }}>
        <div style={storyWidthStyle}>
          <AuthenticationCreatingLoginPassword {...args} mode="login" />
        </div>
        <div style={storyWidthStyle}>
          <AuthenticationCreatingLoginPassword {...args} mode="password" />
        </div>
        <div style={storyWidthStyle}>
          <AuthenticationCreatingLoginPassword {...args} mode="login-and-password" />
        </div>
      </div>
    </div>
  )
};
