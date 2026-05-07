import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationRegistrationData from './index.js';
import type { LegacyThemeMode } from '../../../components/theme/index.js';

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
    const [mode, setMode] = useState<LegacyThemeMode>('light');
    const [lastSubmit, setLastSubmit] = useState<Record<string, unknown> | null>(null);

    return (
      <div className={`theme-${mode}`} style={surfaceStyle}>
        <div style={args.device === 'mobile' ? mobileWidthStyle : storyWidthStyle}>
          <AuthenticationRegistrationData
            {...args}
            defaultBirthDate={lastSubmit?.birthDate as Date | undefined}
            defaultConsentAccepted={lastSubmit?.consentAccepted as boolean | undefined}
            defaultEmail={(lastSubmit?.email as string) ?? ''}
            defaultGender={lastSubmit?.gender as 'male' | 'female' | undefined}
            defaultMiddleName={(lastSubmit?.middleName as string) ?? ''}
            defaultName={(lastSubmit?.name as string) ?? ''}
            defaultSurname={(lastSubmit?.surname as string) ?? ''}
            defaultWithoutMiddleName={(lastSubmit?.withoutMiddleName as boolean) ?? false}
            onSubmit={setLastSubmit as (payload: unknown) => void}
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
            <p style={labelStyle}>Default</p>
            <div className="theme-light" style={storyWidthStyle}>
              <AuthenticationRegistrationData
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
            <p style={labelStyle}>Default</p>
            <div className="theme-light" style={mobileWidthStyle}>
              <AuthenticationRegistrationData
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
