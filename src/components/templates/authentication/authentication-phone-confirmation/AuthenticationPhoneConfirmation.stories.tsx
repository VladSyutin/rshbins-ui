import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthenticationPhoneConfirmation } from './AuthenticationPhoneConfirmation';
import type { ThemeMode } from '../../../theme/Theme';

const meta = {
  title: 'Templates/Authentication/AuthenticationPhoneConfirmation',
  component: AuthenticationPhoneConfirmation,
  tags: ['autodocs'],
  args: {
    device: 'desktop',
    phoneMode: 'visible',
    phoneNumber: '+7 (952) 999-99-99',
    showEmailButton: true
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

const overviewSectionStyle: CSSProperties = {
  display: 'grid',
  gap: '16px'
};

const desktopOverviewGridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(448px, max-content))',
  alignItems: 'start'
};

const mobileOverviewGridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(361px, max-content))',
  alignItems: 'start'
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '12px',
  alignContent: 'start'
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

export const Playground: Story = {
  render: (args) => {
    const [mode, setMode] = useState<ThemeMode>('light');

    return (
      <div className={`theme-${mode}`} style={surfaceStyle}>
        <div style={args.device === 'mobile' ? mobileWidthStyle : storyWidthStyle}>
          <AuthenticationPhoneConfirmation
            {...args}
            themeProps={{
              applyToDocument: false,
              mode,
              onModeChange: setMode
            }}
          />
        </div>
      </div>
    );
  }
};

export const Overview: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <section style={overviewSectionStyle}>
        <p style={labelStyle}>Desktop</p>
        <div style={desktopOverviewGridStyle}>
          <section style={sectionStyle}>
            <p style={labelStyle}>Номер открыт</p>
            <div className="theme-light" style={storyWidthStyle}>
              <AuthenticationPhoneConfirmation
                device="desktop"
                phoneMode="visible"
                phoneNumber="+7 (952) 999-99-99"
                themeProps={{ applyToDocument: false }}
              />
            </div>
          </section>

          <section style={sectionStyle}>
            <p style={labelStyle}>Номер скрыт</p>
            <div className="theme-light" style={storyWidthStyle}>
              <AuthenticationPhoneConfirmation
                device="desktop"
                phoneMode="hidden"
                phoneNumber="+7 (952) 999-99-99"
                themeProps={{ applyToDocument: false }}
              />
            </div>
          </section>
        </div>
      </section>

      <section style={overviewSectionStyle}>
        <p style={labelStyle}>Mobile</p>
        <div style={mobileOverviewGridStyle}>
          <section style={sectionStyle}>
            <p style={labelStyle}>Номер открыт</p>
            <div className="theme-light" style={mobileWidthStyle}>
              <AuthenticationPhoneConfirmation
                device="mobile"
                phoneMode="visible"
                phoneNumber="+7 (952) 999-99-99"
                themeProps={{ applyToDocument: false }}
              />
            </div>
          </section>

          <section style={sectionStyle}>
            <p style={labelStyle}>Номер скрыт</p>
            <div className="theme-light" style={mobileWidthStyle}>
              <AuthenticationPhoneConfirmation
                device="mobile"
                phoneMode="hidden"
                phoneNumber="+7 (952) 999-99-99"
                themeProps={{ applyToDocument: false }}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  )
};
