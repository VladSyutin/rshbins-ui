import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationFirstScreen from './index.js';
import type { LegacyAuthenticationClientType } from './index.js';

const meta = {
  title: 'Legacy/Templates/Authentication/AuthenticationFirstScreen',
  component: AuthenticationFirstScreen,
  tags: ['autodocs'],
  args: {
    defaultClientType: 'individual',
    device: 'desktop'
  }
} satisfies Meta<typeof AuthenticationFirstScreen>;

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
    const [clientType, setClientType] =
      useState<LegacyAuthenticationClientType>(args.defaultClientType ?? 'individual');

    return (
      <div style={surfaceStyle}>
        <div style={storyWidthStyle}>
          <AuthenticationFirstScreen
            {...args}
            clientType={clientType}
            onClientTypeChange={setClientType}
            onIndividualSubmit={(payload) => console.log('Individual submit', payload)}
            onCorporateSubmit={(payload) => console.log('Corporate submit', payload)}
            onGosuslugiLogin={() => console.log('Gosuslugi login')}
            onForgotCredentials={() => console.log('Forgot credentials')}
            onRegister={() => console.log('Register')}
          />
        </div>
      </div>
    );
  }
};

export const Individual: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationFirstScreen {...args} defaultClientType="individual" />
      </div>
    </div>
  )
};

export const Corporate: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationFirstScreen {...args} defaultClientType="corporate" />
      </div>
    </div>
  )
};

export const Mobile: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={mobileWidthStyle}>
        <AuthenticationFirstScreen {...args} device="mobile" />
      </div>
    </div>
  )
};

export const Overview: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(448px, max-content))' }}>
        <div style={storyWidthStyle}>
          <AuthenticationFirstScreen {...args} defaultClientType="individual" />
        </div>
        <div style={storyWidthStyle}>
          <AuthenticationFirstScreen {...args} defaultClientType="corporate" />
        </div>
      </div>
    </div>
  )
};
