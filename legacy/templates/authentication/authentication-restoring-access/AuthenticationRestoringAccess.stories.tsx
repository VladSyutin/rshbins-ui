import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationRestoringAccess from './index.js';
import type {
  LegacyAuthenticationRestoringAccessFlow,
  LegacyAuthenticationRestoringAccessMethod
} from './index.js';

const meta = {
  title: 'Legacy/Templates/Authentication/AuthenticationRestoringAccess',
  component: AuthenticationRestoringAccess,
  tags: ['autodocs'],
  args: {
    defaultRestoringFlow: 'password',
    device: 'desktop'
  }
} satisfies Meta<typeof AuthenticationRestoringAccess>;

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
    const [flow, setFlow] = useState<LegacyAuthenticationRestoringAccessFlow>(
      args.defaultRestoringFlow ?? 'password'
    );
    const [method, setMethod] = useState<LegacyAuthenticationRestoringAccessMethod>('email');

    return (
      <div style={surfaceStyle}>
        <div style={storyWidthStyle}>
          <AuthenticationRestoringAccess
            {...args}
            restoringFlow={flow}
            loginMethod={method}
            onRestoringFlowChange={setFlow}
            onLoginMethodChange={setMethod}
            onBack={() => console.log('Back')}
            onPasswordSubmit={(payload) => console.log('Password submit', payload)}
            onRestoringLoginSubmit={(payload) => console.log('Login submit', payload)}
          />
        </div>
      </div>
    );
  }
};

export const RestorePassword: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationRestoringAccess {...args} defaultRestoringFlow="password" />
      </div>
    </div>
  )
};

export const RestoreLogin: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationRestoringAccess {...args} defaultRestoringFlow="login" />
      </div>
    </div>
  )
};

export const Mobile: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={mobileWidthStyle}>
        <AuthenticationRestoringAccess {...args} device="mobile" />
      </div>
    </div>
  )
};

export const Overview: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(448px, max-content))' }}>
        <div style={storyWidthStyle}>
          <AuthenticationRestoringAccess {...args} defaultRestoringFlow="password" />
        </div>
        <div style={storyWidthStyle}>
          <AuthenticationRestoringAccess {...args} defaultRestoringFlow="login" />
        </div>
      </div>
    </div>
  )
};
