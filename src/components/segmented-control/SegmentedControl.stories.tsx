import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from './SegmentedControl';

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

const defaultOptions = [
  { label: 'Контент', leadingIcon: starIcon, trailingIcon: starIcon, value: 'first' },
  { label: 'Контент', leadingIcon: starIcon, trailingIcon: starIcon, value: 'second' }
];

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: {
    defaultValue: 'first',
    options: defaultOptions
  },
  argTypes: {
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
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px'
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '12px'
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

export const Playground: Story = {
  render: ({ defaultValue = 'first', onChange, options, ...args }) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    return (
      <div style={surfaceStyle}>
        <SegmentedControl
          {...args}
          options={options}
          value={value}
          onChange={(nextValue, event) => {
            setValue(nextValue);
            onChange?.(nextValue, event);
          }}
        />
      </div>
    );
  }
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
        <section style={sectionStyle}>
          <h3 style={titleStyle}>Two segments</h3>
          <p style={metaStyle}>Композиция из основной Figma-ноды: активный сегмент и соседний inactive внутри одной группы.</p>
          <SegmentedControl defaultValue="first" options={defaultOptions} />
        </section>
        <section style={sectionStyle}>
          <h3 style={titleStyle}>Extended group</h3>
          <p style={metaStyle}>Расширенный вариант с несколькими взаимоисключающими опциями на той же геометрии.</p>
          <SegmentedControl
            defaultValue="first"
            options={[
              { label: 'Контент', leadingIcon: starIcon, trailingIcon: starIcon, value: 'first' },
              { label: 'Контент', leadingIcon: starIcon, trailingIcon: starIcon, value: 'second' },
              { label: 'Контент', leadingIcon: starIcon, trailingIcon: starIcon, value: 'third' },
              { label: 'Контент', leadingIcon: starIcon, trailingIcon: starIcon, value: 'fourth' }
            ]}
          />
        </section>
        <section style={sectionStyle}>
          <h3 style={titleStyle}>Text only</h3>
          <p style={metaStyle}>Контрол остаётся валидным и без иконок, если use case требует только текстовые опции.</p>
          <SegmentedControl
            defaultValue="grid"
            options={[
              { label: 'Сетка', value: 'grid' },
              { label: 'Список', value: 'list' },
              { label: 'Карточки', value: 'cards' }
            ]}
          />
        </section>
      </div>
    </div>
  )
};
