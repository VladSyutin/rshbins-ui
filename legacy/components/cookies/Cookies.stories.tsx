import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyCookiesProps } from './index.js';
import Cookies from './index.js';
import LegacyButton from '../button/index.js';

const meta = {
  title: 'Legacy/Components/Cookies',
  component: Cookies,
  tags: ['autodocs'],
  args: {
    closeOnPrimaryAction: true,
    description: 'Описание',
    heading: 'Заголовок',
    placement: 'inline',
    previewState: 'shown',
    primaryActionLabel: 'Принять',
    secondaryActionLabel: 'Настройки',
    size: 's'
  },
  argTypes: {
    onClose: {
      control: false,
      table: { disable: true }
    },
    onPrimaryAction: {
      control: false,
      table: { disable: true }
    },
    onSecondaryAction: {
      control: false,
      table: { disable: true }
    }
  }
} satisfies Meta<typeof Cookies>;

export default meta;

type Story = StoryObj<typeof meta>;

function InteractiveCookiesDemo(args: LegacyCookiesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [cookiesKey, setCookiesKey] = useState(0);

  function showCookies() {
    setCookiesKey((v) => v + 1);
    setIsVisible(true);
  }

  return (
    <div style={surfaceStyle}>
      <div style={demoStyle}>
        <LegacyButton onClick={showCookies} variant="brand">
          Показать cookies
        </LegacyButton>
        {isVisible ? (
          <Cookies
            {...args}
            key={cookiesKey}
            onClose={() => setIsVisible(false)}
            placement="bottom-center"
            primaryActionLabel="Закрыть"
          />
        ) : null}
      </div>
    </div>
  );
}

export const Playground: Story = {};

export const Interactive: Story = {
  render: (args) => <InteractiveCookiesDemo {...args} />
};

export const Overview: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={rowStyle}>
        <Cookies {...args} />
        <Cookies {...args} size="xs" />
      </div>
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '28px 36px 40px',
  border: '1px dashed var(--color-border-default-default)',
  borderRadius: '4px',
  background: 'var(--color-background-default-primary)'
};

const rowStyle: CSSProperties = {
  display: 'grid',
  gap: '32px',
  justifyItems: 'start'
};

const demoStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
  gap: '16px',
  justifyItems: 'start',
  minHeight: '220px'
};
