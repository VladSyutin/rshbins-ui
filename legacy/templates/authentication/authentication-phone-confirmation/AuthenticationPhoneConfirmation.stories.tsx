import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationPhoneConfirmation from './index.js';

const meta = {
  title: 'Legacy/Templates/Authentication/AuthenticationPhoneConfirmation',
  component: AuthenticationPhoneConfirmation,
  tags: ['autodocs'],
  args: {
    phoneNumber: '+7 (999) 123-45-67',
    device: 'desktop'
  }
} satisfies Meta<typeof AuthenticationPhoneConfirmation>;

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
        <AuthenticationPhoneConfirmation
          {...args}
          onChangePhone={() => console.log('Change phone')}
          onRequestEmailCode={() => console.log('Request email code')}
        />
      </div>
    </div>
  )
};

export const VisiblePhone: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationPhoneConfirmation {...args} phoneMode="visible" />
      </div>
    </div>
  )
};

export const HiddenPhone: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationPhoneConfirmation {...args} phoneMode="hidden" />
      </div>
    </div>
  )
};

export const WithoutEmailButton: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={storyWidthStyle}>
        <AuthenticationPhoneConfirmation {...args} showEmailButton={false} />
      </div>
    </div>
  )
};

export const Mobile: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={mobileWidthStyle}>
        <AuthenticationPhoneConfirmation {...args} device="mobile" />
      </div>
    </div>
  )
};

export const Overview: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(448px, max-content))' }}>
        <div style={storyWidthStyle}>
          <AuthenticationPhoneConfirmation {...args} phoneMode="visible" />
        </div>
        <div style={storyWidthStyle}>
          <AuthenticationPhoneConfirmation {...args} phoneMode="hidden" />
        </div>
      </div>
    </div>
  )
};
