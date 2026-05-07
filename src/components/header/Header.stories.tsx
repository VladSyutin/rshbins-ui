import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header, type HeaderProps, type HeaderSize } from './Header';
import type { ThemeMode } from '../theme/Theme';

const meta = {
  title: 'Modern/Components/Header',
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

const viewportMap: Record<Exclude<HeaderSize, 'responsive'>, number> = {
  l: 1280,
  m: 1024,
  s: 744,
  xs: 361
};

function fixedStory(size: Exclude<HeaderSize, 'responsive'>, args?: Partial<HeaderProps>) {
  return {
    parameters: {
      controls: {
        disable: true
      }
    },
    render: () => (
      <div style={wrapperStyle}>
        <div style={{ width: `${viewportMap[size]}px`, maxWidth: '100%' }}>
          <Header
            {...args}
            size={size}
            themeProps={{ applyToDocument: false, ...args?.themeProps }}
          />
        </div>
      </div>
    )
  } satisfies Story;
}

export const Playground: Story = {
  render: (args) => {
    const [mode, setMode] = useState<ThemeMode>('light');

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
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={wrapperStyle}>
      {(Object.entries(viewportMap) as Array<[Exclude<HeaderSize, 'responsive'>, number]>).map(
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
