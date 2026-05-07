import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  LegacyLoaderBrandLogoStep,
  LegacyLoaderBrandTextStep,
  LegacyLoaderBrandProps
} from './index.js';
import LoaderBrand from './index.js';

const logoSteps: LegacyLoaderBrandLogoStep[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
const textSteps: LegacyLoaderBrandTextStep[] = ['1', '2', '3', '4'];

const meta = {
  title: 'Legacy/Components/LoaderBrand',
  component: LoaderBrand,
  tags: ['autodocs'],
  args: {
    autoPlay: true
  }
} satisfies Meta<typeof LoaderBrand>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyLoaderBrandProps) => (
    <div style={surfaceStyle}>
      <LoaderBrand {...args} />
    </div>
  )
};

export const LogoSteps: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        {logoSteps.map((step) => (
          <section key={step} style={cellStyle}>
            <p style={labelStyle}>Logo step {step}</p>
            <LoaderBrand autoPlay={false} logoStep={step} textStep="1" />
          </section>
        ))}
      </div>
    </div>
  )
};

export const TextSteps: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        {textSteps.map((step) => (
          <section key={step} style={cellStyle}>
            <p style={labelStyle}>Text step {step}</p>
            <LoaderBrand autoPlay={false} logoStep="1" textStep={step} />
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
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  alignItems: 'start'
};

const cellStyle: CSSProperties = {
  display: 'grid',
  gap: '12px',
  justifyItems: 'center'
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
