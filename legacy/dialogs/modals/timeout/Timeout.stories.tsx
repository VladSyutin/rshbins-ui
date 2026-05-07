import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Timeout from './index.js';
import Button from '../../../components/button/index.js';

const meta = {
  title: 'Legacy/Dialogs/Modals/Timeout',
  component: Timeout,
  tags: ['autodocs'],
  args: {
    countdownDurationSeconds: 30,
    placement: 'inline',
    previewState: 'shown'
  },
  argTypes: {
    onClose: { control: false, table: { disable: true } },
    onLogInThroughGosuslugi: { control: false, table: { disable: true } }
  }
} satisfies Meta<typeof Timeout>;

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
  if (targetDocument === document || targetDocument.head.querySelector('[data-rshb-modal-portal-style]')) {
    return;
  }
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const clone = node.cloneNode(true) as HTMLLinkElement | HTMLStyleElement;
    clone.setAttribute('data-rshb-modal-portal-style', 'true');
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
    root.setAttribute('data-rshb-modal-portal-root', 'true');
    targetDocument.body.appendChild(root);
    setPortalRoot(root);
    return () => {
      root.remove();
    };
  }, []);

  return portalRoot ? createPortal(children, portalRoot) : null;
}

function InteractiveDemo(args: Story['args']) {
  const [isVisible, setIsVisible] = useState(false);
  const [key, setKey] = useState(0);

  function showModal() {
    setKey((v) => v + 1);
    setIsVisible(true);
  }

  return (
    <div style={surfaceStyle}>
      <div style={demoStyle}>
        <Button onClick={showModal} variant="brand">
          Показать диалог
        </Button>
        {isVisible ? (
          <ParentDocumentPortal>
            <Timeout
              {...args}
              key={key}
              onClose={() => setIsVisible(false)}
              placement="top-center"
            />
          </ParentDocumentPortal>
        ) : null}
      </div>
    </div>
  );
}

export const Default: Story = {};

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />
};

export const Expired: Story = {
  args: {
    countdownDurationSeconds: 0
  }
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '28px 36px 40px',
  border: '1px dashed var(--color-border-default-default)',
  borderRadius: '4px',
  background: 'var(--color-background-default-primary)'
};

const demoStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
  gap: '16px',
  justifyItems: 'start',
  minHeight: '220px'
};
