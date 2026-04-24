import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Theme,
  type ThemeMode,
  type ThemePreviewState,
  type ThemeProps
} from './Theme';

const meta = {
  title: 'Components/Theme',
  component: Theme,
  tags: ['autodocs'],
  args: {
    applyToDocument: false,
    defaultMode: 'light',
    previewState: 'default'
  }
} satisfies Meta<typeof Theme>;

export default meta;

type Story = StoryObj<typeof meta>;

const states: ThemePreviewState[] = ['default', 'hover', 'pressed', 'focused'];
const modes: ThemeMode[] = ['light', 'dark'];

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '16px',
  borderRadius: '24px',
  border: '1px dashed var(--color-border-default-default)',
  backgroundColor: 'var(--color-background-default-primary)'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '18px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '10px',
  alignItems: 'start'
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

function stateProps(state: ThemePreviewState): Partial<ThemeProps> {
  return state === 'default' ? {} : { previewState: state };
}

export const Playground: Story = {
  render: (args) => <Theme {...args} />
};

export const Overview: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        {modes.map((mode) => (
          <section key={mode} style={cardStyle}>
            <h3 style={{ margin: 0 }}>{mode}</h3>
            {states.map((state) => (
              <div key={`${mode}-${state}`} style={cardStyle}>
                <p style={labelStyle}>{state}</p>
                <Theme
                  {...stateProps(state)}
                  applyToDocument={false}
                  aria-label={`${mode} ${state}`}
                  mode={mode}
                />
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
};
