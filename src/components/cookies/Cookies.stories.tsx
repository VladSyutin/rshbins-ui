import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/Button';
import { Cookies } from './Cookies';

const meta = {
  title: 'Modern/Components/Cookies',
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
      table: {
        disable: true
      }
    },
    onPrimaryAction: {
      control: false,
      table: {
        disable: true
      }
    },
    onSecondaryAction: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Cookies>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '28px 36px 40px',
  border: '1px dashed #8b5cf6',
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
  if (targetDocument === document || targetDocument.head.querySelector('[data-rshb-cookies-portal-style]')) {
    return;
  }

  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const clone = node.cloneNode(true) as HTMLLinkElement | HTMLStyleElement;

    clone.setAttribute('data-rshb-cookies-portal-style', 'true');

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

    root.setAttribute('data-rshb-cookies-portal-root', 'true');
    targetDocument.body.appendChild(root);
    setPortalRoot(root);

    return () => {
      root.remove();
    };
  }, []);

  return portalRoot ? createPortal(children, portalRoot) : null;
}

function InteractiveCookiesDemo(args: Story['args']) {
  const [isVisible, setIsVisible] = useState(false);
  const [cookiesKey, setCookiesKey] = useState(0);

  function showCookies() {
    setCookiesKey((value) => value + 1);
    setIsVisible(true);
  }

  return (
    <div style={surfaceStyle}>
      <div style={demoStyle}>
        <Button onClick={showCookies} variant="brand">
          Показать cookies
        </Button>
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
