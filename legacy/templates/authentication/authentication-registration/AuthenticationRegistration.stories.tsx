import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationRegistration from './index.js';
import type { LegacyAuthenticationRegistrationMethod } from './index.js';

const meta = {
  title: 'Legacy/Templates/Authentication/AuthenticationRegistration',
  component: AuthenticationRegistration,
  tags: ['autodocs'],
  args: {
    defaultMethod: 'email',
    device: 'desktop'
  }
} satisfies Meta<typeof AuthenticationRegistration>;

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
  render: (args) => {
    const [method, setMethod] = useState<LegacyAuthenticationRegistrationMethod>(
      args.defaultMethod ?? 'email'
    );

    return (
      <div style={surfaceStyle}>
        <div style={storyWidthStyle}>
          <AuthenticationRegistration
            {...args}
            method={method}
            onMethodChange={setMethod}
            onBack={() => console.log('Back')}
            onSubmit={(payload) => console.log('Submit', payload)}
          />
        </div>
      </div>
    );
  }
};

export const Email: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationRegistration {...args} defaultMethod="email" />
      </div>
    </div>
  )
};

export const Phone: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationRegistration {...args} defaultMethod="phone" />
      </div>
    </div>
  )
};

export const Mobile: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={mobileWidthStyle}>
        <AuthenticationRegistration {...args} device="mobile" />
      </div>
    </div>
  )
};

export const Overview: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(448px, max-content))' }}>
        <div style={storyWidthStyle}>
          <AuthenticationRegistration {...args} defaultMethod="email" />
        </div>
        <div style={storyWidthStyle}>
          <AuthenticationRegistration {...args} defaultMethod="phone" />
        </div>
      </div>
    </div>
  )
};
