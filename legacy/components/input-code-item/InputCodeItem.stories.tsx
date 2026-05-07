import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputCodeItemProps, LegacyInputCodeItemPreviewState } from './index.js';
import InputCodeItem from './index.js';

const meta = {
  title: 'Legacy/Components/InputCodeItem',
  component: InputCodeItem,
  tags: ['autodocs'],
  args: {
    completionBehavior: 'reset',
    complementaryText: 'Вспомогательный текст',
    loadingDuration: 3000,
    showComplementaryIcon: false,
    showComplementaryText: true
  },
  argTypes: {
    onComplete: {
      control: false,
      table: {
        disable: true
      }
    },
    onValueChange: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof InputCodeItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)',
  justifyItems: 'center'
};

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: '20px 24px',
  alignItems: 'center',
  gridTemplateColumns: '120px max-content'
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)'
};

const states: Array<{ label: string; previewState: LegacyInputCodeItemPreviewState }> = [
  { label: 'Default', previewState: 'default' },
  { label: 'Typing', previewState: 'typing' },
  { label: 'Loading', previewState: 'loading' },
  { label: 'Error', previewState: 'error' }
];

export const Playground: Story = {
  render: (args: LegacyInputCodeItemProps) => (
    <div style={surfaceStyle}>
      <InputCodeItem {...args} />
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
      <h3 style={titleStyle}>State Matrix</h3>
      <div style={matrixStyle}>
        {states.flatMap((state) => [
          <p key={`${state.label}-label`} style={labelStyle}>
            {state.label}
          </p>,
          <InputCodeItem key={state.label} previewState={state.previewState} />
        ])}
      </div>
    </div>
  )
};
