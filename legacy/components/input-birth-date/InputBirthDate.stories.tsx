import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  LegacyInputBirthDatePreviewState,
  LegacyInputBirthDateProps
} from './index.js';
import InputBirthDate from './index.js';

const DEMO_DATE = new Date(2001, 5, 2);

const overviewStates: Array<{
  helperText?: string;
  invalid?: boolean;
  label: string;
  previewState: LegacyInputBirthDatePreviewState;
  value?: Date;
}> = [
  { label: 'Default', previewState: 'default' },
  { label: 'Hover', previewState: 'hover' },
  { label: 'Focused', previewState: 'focused' },
  { label: 'Typing', previewState: 'typing' },
  { label: 'Entered', previewState: 'entered', value: DEMO_DATE },
  { label: 'Entered Hover', previewState: 'entered-hover', value: DEMO_DATE },
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
    value: DEMO_DATE
  },
  {
    helperText: 'Вспомогательный текст',
    invalid: true,
    label: 'Error Entered Hover',
    previewState: 'error-entered-hover',
    value: DEMO_DATE
  },
  { label: 'Disabled', previewState: 'disabled' },
  { label: 'Disabled Entered', previewState: 'disabled-entered', value: DEMO_DATE },
  { label: 'Keyboard Focused', previewState: 'keyboard-focused' }
];

const meta = {
  title: 'Legacy/Components/InputBirthDate',
  component: InputBirthDate,
  args: {
    clearable: true,
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'Дата рождения',
    pickerMode: 'desktop',
    showHelperIcon: false
  },
  argTypes: {
    helperIcon: {
      control: false,
      table: {
        disable: true
      }
    },
    defaultValue: {
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
    value: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof InputBirthDate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputBirthDateProps) => (
    <div style={surfaceStyle}>
      <InputBirthDate {...args} />
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
            <InputBirthDate
              clearable
              helperText={state.helperText}
              invalid={state.invalid}
              label="Дата рождения"
              pickerMode="desktop"
              previewState={state.previewState}
              value={state.value}
            />
          </section>
        ))}
      </div>
    </div>
  )
};

export const NativePicker: Story = {
  render: (args: LegacyInputBirthDateProps) => (
    <div style={surfaceStyle}>
      <InputBirthDate {...args} pickerMode="native" />
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  border: '1px dashed var(--color-border-default-default)',
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
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
