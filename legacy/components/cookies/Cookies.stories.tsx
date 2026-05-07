import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
    primaryActionLabel: 'Контент',
    secondaryActionLabel: 'Контент',
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

function getPortalDocument(): Document {
  try {
    if (window.parent.document?.body && window.parent.document !== document) {
      return window.parent.document;
    }
  } catch {
    return document;
  }
  return document;
}

function syncPreviewStyles(targetDocument: Document) {
  if (targetDocument === document || targetDocument.head.querySelector('[data-rshb-legacy-cookies-portal-style]')) {
    return;
  }
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const clone = node.cloneNode(true) as HTMLLinkElement | HTMLStyleElement;
    clone.setAttribute('data-rshb-legacy-cookies-portal-style', 'true');
    if (node.tagName === 'LINK' && clone.tagName === 'LINK') {
      (clone as HTMLLinkElement).href = (node as HTMLLinkElement).href;
    }
    targetDocument.head.appendChild(clone);
  });
}

function ParentDocumentPortal({ children }: { children: ReactNode }) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const targetDocument = getPortalDocument();
    syncPreviewStyles(targetDocument);
    const root = targetDocument.createElement('div');
    root.setAttribute('data-rshb-legacy-cookies-portal-root', 'true');
    targetDocument.body.appendChild(root);
    setPortalRoot(root);
    return () => { root.remove(); };
  }, []);

  return portalRoot ? createPortal(children, portalRoot) : null;
}

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
          <ParentDocumentPortal>
            <Cookies
              {...args}
              key={cookiesKey}
              onClose={() => setIsVisible(false)}
              placement="bottom-center"
              primaryActionLabel="Закрыть"
            />
          </ParentDocumentPortal>
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
