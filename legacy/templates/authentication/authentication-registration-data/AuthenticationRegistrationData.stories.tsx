import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationRegistrationData from './index.js';
import type { LegacyAuthenticationRegistrationDataSubmitPayload } from './index.js';

const meta = {
  title: 'Legacy/Templates/Authentication/AuthenticationRegistrationData',
  component: AuthenticationRegistrationData,
  tags: ['autodocs'],
  args: {
    device: 'desktop'
  }
} satisfies Meta<typeof AuthenticationRegistrationData>;

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
        <AuthenticationRegistrationData
          {...args}
          onSubmit={(payload: LegacyAuthenticationRegistrationDataSubmitPayload) =>
            console.log('Submit', payload)
          }
        />
      </div>
    </div>
  )
};

export const Desktop: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationRegistrationData {...args} device="desktop" />
      </div>
    </div>
  )
};

export const Mobile: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={mobileWidthStyle}>
        <AuthenticationRegistrationData {...args} device="mobile" />
      </div>
    </div>
  )
};

export const Overview: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(448px, max-content))' }}>
        <div style={storyWidthStyle}>
          <AuthenticationRegistrationData {...args} device="desktop" />
        </div>
        <div style={mobileWidthStyle}>
          <AuthenticationRegistrationData {...args} device="mobile" />
        </div>
      </div>
    </div>
  )
};
