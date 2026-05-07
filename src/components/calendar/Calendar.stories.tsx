import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Calendar,
  CalendarDayItem,
  CalendarPeriodItem,
  type CalendarItemPreviewState
} from './Calendar';

const today = new Date();

const meta = {
  title: 'Modern/Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {
    initialView: 'day'
  },
  argTypes: {
    className: {
      control: false
    },
    onChange: {
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
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '28px 36px 40px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '16px'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: '32px'
};

const compactRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '16px'
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

const dayStates: Array<{
  anotherMonth?: boolean;
  day: number;
  label: string;
  previewState?: CalendarItemPreviewState;
  selected?: boolean;
}> = [
  { day: 29, label: 'Default' },
  { day: 29, label: 'Hover', previewState: 'hover' },
  { day: 29, label: 'Focused', previewState: 'focused' },
  { day: 29, label: 'Active', selected: true },
  { anotherMonth: true, day: 29, label: 'Another month' },
  { anotherMonth: true, day: 29, label: 'Another month hover', previewState: 'hover' },
  { anotherMonth: true, day: 29, label: 'Another month focused', previewState: 'focused' }
];

const periodStates: Array<{
  label: string;
  previewState?: CalendarItemPreviewState;
  selected?: boolean;
  text: string;
}> = [
  { label: 'Default', text: 'Май' },
  { label: 'Hover', previewState: 'hover', text: 'Май' },
  { label: 'Focused', previewState: 'focused', text: 'Май' },
  { label: 'Active', selected: true, text: 'Май' }
];

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <Calendar {...args} />
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
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Variants</h3>
        <p style={metaStyle}>Три режима из Figma: выбор дня, месяца и года.</p>
        <div style={rowStyle}>
          <Calendar defaultValue={today} initialView="day" />
          <Calendar defaultValue={today} initialView="month" />
          <Calendar defaultValue={today} initialView="year" />
        </div>
      </section>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Day item states</h3>
        <p style={metaStyle}>Состояния `CalendarDayItem`, включая ячейки соседних месяцев.</p>
        <div style={compactRowStyle}>
          {dayStates.map((state) => (
            <div key={state.label} style={staticItemStyle}>
              <CalendarDayItem
                anotherMonth={state.anotherMonth}
                day={state.day}
                previewState={state.previewState}
                selected={state.selected}
              />
            </div>
          ))}
        </div>
      </section>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Period item states</h3>
        <p style={metaStyle}>Состояния `CalendarPeriodItem` для сеток месяцев и лет.</p>
        <div style={compactRowStyle}>
          {periodStates.map((state) => (
            <div key={state.label} style={staticItemStyle}>
              <CalendarPeriodItem
                label={state.text}
                previewState={state.previewState}
                selected={state.selected}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
};
