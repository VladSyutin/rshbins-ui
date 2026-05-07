import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AuthenticationRestoringAccess,
  type AuthenticationRestoringAccessFlow,
  type AuthenticationRestoringAccessMethod
} from './AuthenticationRestoringAccess';
import type { ThemeMode } from '../../../components/theme/Theme';

const meta = {
  title: 'Modern/Templates/Authentication/AuthenticationRestoringAccess',
  component: AuthenticationRestoringAccess,
  tags: ['autodocs'],
  args: {
    defaultLoginMethod: 'email',
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
    const [flow, setFlow] = useState<AuthenticationRestoringAccessFlow>(
      args.defaultRestoringFlow ?? 'password'
    );
    const [method, setMethod] = useState<AuthenticationRestoringAccessMethod>(
      args.defaultLoginMethod ?? 'email'
    );

    return (
      <div className={`theme-${mode}`} style={surfaceStyle}>
        <div style={args.device === 'mobile' ? mobileWidthStyle : storyWidthStyle}>
          <AuthenticationRestoringAccess
            {...args}
            loginMethod={method}
            onLoginMethodChange={setMethod}
            onRestoringFlowChange={setFlow}
            restoringFlow={flow}
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
            <p style={labelStyle}>Восстановление пароля</p>
            <div className="theme-light" style={storyWidthStyle}>
              <AuthenticationRestoringAccess
                defaultRestoringFlow="password"
                device="desktop"
                themeProps={{ applyToDocument: false }}
              />
            </div>
          </section>

          <section style={sectionStyle}>
            <p style={labelStyle}>Восстановление логина / Email</p>
            <div className="theme-light" style={storyWidthStyle}>
              <AuthenticationRestoringAccess
                defaultLoginMethod="email"
                defaultRestoringFlow="login"
                device="desktop"
                themeProps={{ applyToDocument: false }}
              />
            </div>
          </section>

          <section style={sectionStyle}>
            <p style={labelStyle}>Восстановление логина / Телефон</p>
            <div className="theme-light" style={storyWidthStyle}>
              <AuthenticationRestoringAccess
                defaultLoginMethod="phone"
                defaultRestoringFlow="login"
                device="desktop"
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
            <p style={labelStyle}>Восстановление пароля</p>
            <div className="theme-light" style={mobileWidthStyle}>
              <AuthenticationRestoringAccess
                defaultRestoringFlow="password"
                device="mobile"
                themeProps={{ applyToDocument: false }}
              />
            </div>
          </section>

          <section style={sectionStyle}>
            <p style={labelStyle}>Восстановление логина / Email</p>
            <div className="theme-light" style={mobileWidthStyle}>
              <AuthenticationRestoringAccess
                defaultLoginMethod="email"
                defaultRestoringFlow="login"
                device="mobile"
                themeProps={{ applyToDocument: false }}
              />
            </div>
          </section>

          <section style={sectionStyle}>
            <p style={labelStyle}>Восстановление логина / Телефон</p>
            <div className="theme-light" style={mobileWidthStyle}>
              <AuthenticationRestoringAccess
                defaultLoginMethod="phone"
                defaultRestoringFlow="login"
                device="mobile"
                themeProps={{ applyToDocument: false }}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  )
};
