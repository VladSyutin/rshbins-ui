import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

function LegacySetupOverview() {
  return (
    <section style={sectionStyle}>
      <div style={stackStyle}>
        <p style={eyebrowStyle}>Legacy</p>
        <h1 style={titleStyle}>Compatibility layer for FOS delivery</h1>
        <p style={bodyStyle}>
          This section hosts React 17-compatible component versions that are reviewed in the same
          Storybook, but delivered separately from the modern `src/components` layer.
        </p>
      </div>

      <div style={gridStyle}>
        <article style={cardStyle}>
          <h2 style={cardTitleStyle}>Modern layer</h2>
          <p style={bodyStyle}>
            Source of truth for Figma parity, token usage, and day-to-day component development.
          </p>
          <code style={codeStyle}>src/components/*</code>
        </article>

        <article style={cardStyle}>
          <h2 style={cardTitleStyle}>Legacy layer</h2>
          <p style={bodyStyle}>
            Copy-friendly React 17-compatible adaptations with ready CSS and focused integration
            notes.
          </p>
          <code style={codeStyle}>legacy/components/*</code>
        </article>
      </div>
    </section>
  );
}

const meta = {
  title: 'Legacy/Overview/Setup',
  component: LegacySetupOverview,
  parameters: {
    controls: {
      disable: true
    }
  }
} satisfies Meta<typeof LegacySetupOverview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

const sectionStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '32px',
  display: 'grid',
  gap: '24px',
  backgroundColor: 'var(--color-background-default-primary)',
  color: 'var(--color-text-default-primary)',
  alignContent: 'start'
};

const stackStyle: CSSProperties = {
  display: 'grid',
  gap: '12px',
  maxWidth: '720px'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '10px',
  padding: '20px',
  border: '1px solid var(--color-border-default-default)',
  borderRadius: 'var(--radius-m)',
  backgroundColor: 'var(--color-background-default-secondary)'
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--typography-header-h3-fontFamily)',
  fontSize: 'var(--typography-header-h3-fontSize)',
  fontWeight: 'var(--typography-header-h3-fontWeight)',
  lineHeight: 'var(--typography-header-h3-lineHeight)'
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--typography-header-h4-fontFamily)',
  fontSize: 'var(--typography-header-h4-fontSize)',
  fontWeight: 'var(--typography-header-h4-fontWeight)',
  lineHeight: 'var(--typography-header-h4-lineHeight)'
};

const bodyStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-body-regular-fontFamily)',
  fontSize: 'var(--typography-body-regular-fontSize)',
  fontWeight: 'var(--typography-body-regular-fontWeight)',
  lineHeight: 'var(--typography-body-regular-lineHeight)'
};

const codeStyle: CSSProperties = {
  display: 'inline-flex',
  width: 'fit-content',
  padding: '4px 8px',
  borderRadius: 'var(--radius-3xs)',
  backgroundColor: 'var(--color-background-default-tertiary)',
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-caption-regular-fontFamily)',
  fontSize: 'var(--typography-caption-regular-fontSize)',
  fontWeight: 'var(--typography-caption-regular-fontWeight)',
  lineHeight: 'var(--typography-caption-regular-lineHeight)'
};
