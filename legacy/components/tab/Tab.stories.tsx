import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyTabPreviewState, LegacyTabProps } from './index.js';
import Tab from './index.js';

function StarIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <path
        clipRule="evenodd"
        d="M9.1943 4.99924L9.54523 5.87313L10.4848 5.93683L13.6823 6.15365L11.2229 8.20852L10.5002 8.81232L10.73 9.72558L11.5119 12.8336L8.79757 11.1296L8.00001 10.6288L7.20245 11.1296L4.48814 12.8336L5.27003 9.72558L5.49978 8.81232L4.77711 8.20852L2.31768 6.15365L5.51523 5.93683L6.45479 5.87313L6.80571 4.99924L8.00001 2.02519L9.1943 4.99924ZM1.47085 4.70762L5.41375 4.44027L6.88644 0.772963C7.28953 -0.230801 8.71049 -0.230798 9.11358 0.772965L10.5863 4.44027L14.5292 4.70762C15.6084 4.7808 16.0475 6.13222 15.2174 6.82575L12.1847 9.35962L13.1488 13.1922C13.4127 14.2411 12.2631 15.0764 11.347 14.5012L8.00001 12.3999L4.65299 14.5012C3.73689 15.0764 2.58731 14.2411 2.8512 13.1922L3.81536 9.35962L0.782629 6.82575C-0.0474471 6.13221 0.391658 4.7808 1.47085 4.70762Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

const starIcon = <StarIcon />;

const meta = {
  title: 'Legacy/Components/Tab',
  component: Tab,
  tags: ['autodocs'],
  args: {
    label: 'Контент',
    leadingIcon: starIcon,
    previewState: 'default',
    selected: false,
    trailingIcon: starIcon
  },
  argTypes: {
    leadingIcon: {
      control: false
    },
    onClick: {
      control: false,
      table: {
        disable: true
      }
    },
    trailingIcon: {
      control: false
    }
  }
} satisfies Meta<typeof Tab>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

const columnStyle: CSSProperties = {
  display: 'inline-grid',
  gap: '16px',
  justifyItems: 'start'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap'
};

const staticItemStyle: CSSProperties = {
  pointerEvents: 'none'
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

const states: Array<{ label: string; previewState: LegacyTabPreviewState; selected?: boolean }> = [
  { label: 'Active', previewState: 'default', selected: true },
  { label: 'Hover', previewState: 'hover' },
  { label: 'Focused', previewState: 'focused' },
  { label: 'Inactive', previewState: 'default' }
];

export const Playground: Story = {
  render: (args: LegacyTabProps) => (
    <div style={surfaceStyle}>
      <Tab {...args} />
    </div>
  )
};

export const Overview: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <section style={columnStyle}>
        <h3 style={titleStyle}>Base states</h3>
        <p style={metaStyle}>Active, hover, focused и inactive.</p>
        {states.map((state) => (
          <div key={state.label} style={staticItemStyle}>
            <Tab
              label="Контент"
              leadingIcon={starIcon}
              previewState={state.previewState}
              selected={state.selected}
              trailingIcon={starIcon}
            />
          </div>
        ))}
      </section>
      <section style={columnStyle}>
        <h3 style={titleStyle}>Content options</h3>
        <p style={metaStyle}>Иконки опциональны.</p>
        <div style={rowStyle}>
          <Tab label="Контент" selected />
          <Tab label="Контент" leadingIcon={starIcon} />
          <Tab label="Контент" trailingIcon={starIcon} />
        </div>
      </section>
    </div>
  )
};
