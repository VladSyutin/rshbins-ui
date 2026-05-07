import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyHeaderSize } from './index.js';
import type { LegacyThemeMode } from '../theme/index.js';
import Header from './index.js';

const meta = {
  title: 'Legacy/Components/Header',
  component: Header,
  tags: ['autodocs'],
  args: {
    size: 'responsive',
    themeProps: {
      applyToDocument: false
    }
  }
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

const viewportMap: Record<Exclude<LegacyHeaderSize, 'responsive'>, number> = {
  l: 1280,
  m: 1024,
  s: 744,
  xs: 361
};

export const Playground: Story = {
  render: (args) => {
    const [mode, setMode] = useState<LegacyThemeMode>('light');

    return (
      <div className={`theme-${mode}`} style={wrapperStyle}>
        <Header
          {...args}
          themeProps={{
            ...args.themeProps,
            applyToDocument: false,
            mode,
            onModeChange: setMode
          }}
        />
      </div>
    );
  }
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={wrapperStyle}>
      {(Object.entries(viewportMap) as Array<[Exclude<LegacyHeaderSize, 'responsive'>, number]>).map(
        ([size, width]) => (
          <section key={size} style={cardStyle}>
            <p style={labelStyle}>
              {size.toUpperCase()} / {width}px
            </p>
            <div style={{ width: `${width}px`, maxWidth: '100%' }}>
              <Header size={size} themeProps={{ applyToDocument: false }} />
            </div>
          </section>
        )
      )}
    </div>
  )
};

const wrapperStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  padding: '24px',
  background: 'var(--color-background-default-secondary)',
  borderRadius: '24px'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '8px'
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
