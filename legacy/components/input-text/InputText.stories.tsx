import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  LegacyInputTextPreviewState,
  LegacyInputTextProps
} from './index.js';
import InputText from './index.js';

type MatrixState = LegacyInputTextPreviewState;

const overviewStates: Array<{
  helperText?: string;
  invalid?: boolean;
  label: string;
  previewState: MatrixState;
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

const meta = {
  title: 'Legacy/Components/InputText',
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

export const Playground: Story = {
  render: (args: LegacyInputTextProps) => (
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
        {overviewStates.map((state) => (
          <section key={state.label} style={cardStyle}>
            <p style={metaStyle}>{state.label}</p>
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

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  border: '1px dashed var(--legacy-color-border-default-default, #d7dce1)',
  backgroundColor: 'var(--color-background-default-primary)'
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

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--legacy-color-text-default-secondary, #6d737a)',
  fontFamily: 'var(--legacy-typography-footnote-font-family)',
  fontSize: 'var(--legacy-typography-footnote-font-size)',
  fontWeight: 'var(--legacy-typography-footnote-font-weight)',
  lineHeight: 'var(--legacy-typography-footnote-line-height)'
};
