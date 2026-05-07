import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Captcha from './index.js';
import Button from '../../../components/button/index.js';

const meta = {
  title: 'Legacy/Dialogs/Modals/Captcha',
  component: Captcha,
  tags: ['autodocs'],
  args: {
    captchaLabel: '        ',
    defaultCodeValue: '',
    placement: 'inline',
    previewState: 'shown'
  },
  argTypes: {
    onClose: { control: false, table: { disable: true } },
    onContinue: { control: false, table: { disable: true } },
    onInputValueChange: { control: false, table: { disable: true } },
    onLogInThroughGosuslugi: { control: false, table: { disable: true } },
    onRefreshCaptcha: { control: false, table: { disable: true } },
    onVoiceCaptcha: { control: false, table: { disable: true } }
  }
} satisfies Meta<typeof Captcha>;

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
            <Captcha
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

export const Filled: Story = {
  args: {
    defaultCodeValue: '4876'
  }
};

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />
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
