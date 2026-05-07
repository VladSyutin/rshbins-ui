import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  LegacyButtonPreviewState,
  LegacyButtonProps,
  LegacyButtonVariant
} from './index.js';
import Button from './index.js';

type MatrixState = LegacyButtonPreviewState;

const overviewStates: MatrixState[] = [
  'default',
  'hover',
  'focused',
  'pressed',
  'disabled',
  'loading',
  'selection'
];
const variants = [
  { label: 'Brand', value: 'brand' },
  { label: 'Normal', value: 'normal' },
  { label: 'Flat Primary', value: 'flat-primary' },
  { label: 'Flat Secondary', value: 'flat-secondary' }
] satisfies Array<{ label: string; value: LegacyButtonVariant }>;

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

const meta = {
  title: 'Legacy/Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Контент',
    iconOnly: false,
    previewState: 'default',
    selected: false,
    size: 'm',
    variant: 'brand'
  },
  argTypes: {
    leadingIcon: {
      control: false,
      table: {
        disable: true
      }
    },
    trailingIcon: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

function storyStateProps(state: MatrixState): Partial<LegacyButtonProps> {
  if (state === 'default') {
    return {};
  }

  return {
    previewState: state
  };
}

export const Playground: Story = {
  render: (args: LegacyButtonProps) => (
    <Button
      {...args}
      aria-label={args.iconOnly ? 'Кнопка действия' : args['aria-label']}
      leadingIcon={<StarIcon />}
      trailingIcon={args.iconOnly ? undefined : <StarIcon />}
    >
      {args.iconOnly ? undefined : args.children}
    </Button>
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
      <div style={gridStyle}>
        {variants.map((variant) => (
          <section key={variant.value} style={cardStyle}>
            <h3 style={{ margin: 0 }}>{variant.label}</h3>
            {overviewStates.map((state) => (
              <div key={`${variant.value}-${state}`} style={stackStyle}>
                <p style={metaStyle}>{state}</p>
                <div style={rowStyle}>
                  <Button
                    {...storyStateProps(state)}
                    leadingIcon={<StarIcon />}
                    size="m"
                    trailingIcon={<StarIcon />}
                    variant={variant.value}
                  >
                    Контент
                  </Button>
                  <Button
                    {...storyStateProps(state)}
                    aria-label={`${variant.label} ${state}`}
                    iconOnly
                    leadingIcon={<StarIcon />}
                    size="m"
                    variant={variant.value}
                  />
                </div>
                <div style={rowStyle}>
                  <Button
                    {...storyStateProps(state)}
                    leadingIcon={<StarIcon />}
                    size="s"
                    trailingIcon={<StarIcon />}
                    variant={variant.value}
                  >
                    Контент
                  </Button>
                  <Button
                    {...storyStateProps(state)}
                    aria-label={`${variant.label} ${state} compact`}
                    iconOnly
                    leadingIcon={<StarIcon />}
                    size="s"
                    variant={variant.value}
                  />
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  padding: '16px',
  borderRadius: '24px',
  border: '1px dashed var(--legacy-color-border-default-default, #d7dce1)',
  backgroundColor: 'var(--color-background-default-primary)'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '16px'
};

const stackStyle: CSSProperties = {
  display: 'grid',
  gap: '8px'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  alignItems: 'center'
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--legacy-color-text-default-secondary, #6d737a)',
  fontFamily: 'var(--legacy-typography-footnote-font-family)',
  fontSize: 'var(--legacy-typography-footnote-font-size)',
  fontWeight: 'var(--legacy-typography-footnote-font-weight)',
  lineHeight: 'var(--legacy-typography-footnote-line-height)'
};
