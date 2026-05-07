import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyThemeMode, LegacyThemeProps } from './index.js';
import Theme from './index.js';

const meta = {
  title: 'Legacy/Components/Theme',
  component: Theme,
  tags: ['autodocs'],
  args: {
    applyToDocument: false,
    previewState: 'default'
  },
  argTypes: {
    onModeChange: {
      control: false,
      table: { disable: true }
    },
    mode: {
      control: false,
      table: { disable: true }
    }
  }
} satisfies Meta<typeof Theme>;

export default meta;

type Story = StoryObj<typeof meta>;

const previewStates: Array<LegacyThemeProps['previewState']> = ['default', 'hover', 'pressed', 'focused'];

export const Playground: Story = {
  render: (args) => {
    const [mode, setMode] = useState<LegacyThemeMode>('light');

    return (
      <div style={surfaceStyle}>
        <Theme
          {...args}
          mode={mode}
          onModeChange={setMode}
        />
      </div>
    );
  }
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        {(['light', 'dark'] as LegacyThemeMode[]).map((mode) => (
          <section key={mode} style={cardStyle}>
            <h3 style={titleStyle}>{mode === 'light' ? 'Light mode' : 'Dark mode'}</h3>
            <div style={rowStyle}>
              {previewStates.map((state) => (
                <div key={state} style={cellStyle}>
                  <p style={metaStyle}>{state}</p>
                  <Theme applyToDocument={false} mode={mode} previewState={state} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '12px'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px'
};

const cellStyle: CSSProperties = {
  display: 'grid',
  gap: '8px',
  justifyItems: 'center'
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)'
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
