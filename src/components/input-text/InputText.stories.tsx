import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputText, type InputTextPreviewState } from './InputText';

const meta = {
  title: 'Components/InputText',
  component: InputText,
  tags: ['autodocs'],
  args: {
    clearable: true,
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'Название',
    showHelperIcon: false
  },
  argTypes: {
    helperIcon: {
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
    },
    startIcon: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof InputText>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: '20px 32px',
  alignItems: 'start',
  gridTemplateColumns: 'repeat(auto-fit, minmax(361px, 1fr))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '10px'
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

const states: Array<{
  helperText?: string;
  invalid?: boolean;
  label: string;
  previewState: InputTextPreviewState;
  value?: string;
}> = [
  { label: 'Default', previewState: 'default' },
  { label: 'Hover', previewState: 'hover' },
  { label: 'Focused', previewState: 'focused' },
  { label: 'Typing', previewState: 'typing', value: 'Контент' },
  { label: 'Entered', previewState: 'entered', value: 'Контент' },
  { label: 'Entered Hover', previewState: 'entered-hover', value: 'Контент' },
  {
    helperText: 'Вспомогательный текст',
    invalid: true,
    label: 'Error',
    previewState: 'error'
  },
  {
    helperText: 'Вспомогательный текст',
    invalid: true,
    label: 'Error Hover',
    previewState: 'error-hover'
  },
  {
    helperText: 'Вспомогательный текст',
    invalid: true,
    label: 'Error Entered',
    previewState: 'error-entered',
    value: 'Контент'
  },
  {
    helperText: 'Вспомогательный текст',
    invalid: true,
    label: 'Error Entered Hover',
    previewState: 'error-entered-hover',
    value: 'Контент'
  },
  { label: 'Disabled', previewState: 'disabled' },
  { label: 'Disabled Entered', previewState: 'disabled-entered', value: 'Контент' },
  { label: 'Keyboard Focused', previewState: 'keyboard-focused' }
];

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <InputText {...args} />
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
      <div style={matrixStyle}>
        {states.map((state) => (
          <section key={state.label} style={cardStyle}>
            <p style={labelStyle}>{state.label}</p>
            <InputText
              clearable
              helperText={state.helperText}
              invalid={state.invalid}
              label="Название"
              previewState={state.previewState}
              value={state.value}
            />
          </section>
        ))}
      </div>
    </div>
  )
};
