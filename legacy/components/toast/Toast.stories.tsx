import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyToastVariant, LegacyToastProps } from './index.js';
import Toast from './index.js';

const meta = {
  title: 'Legacy/Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    autoCloseDuration: null,
    children: 'Контент',
    closable: true,
    previewState: 'shown',
    variant: 'danger'
  },
  argTypes: {
    onClose: {
      control: false,
      table: { disable: true }
    }
  }
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

const variants: Array<{ label: string; value: LegacyToastVariant }> = [
  { label: 'Danger', value: 'danger' },
  { label: 'Success', value: 'success' }
];

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
  if (targetDocument === document || targetDocument.head.querySelector('[data-rshb-toast-portal-style]')) {
    return;
  }
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const clone = node.cloneNode(true) as HTMLLinkElement | HTMLStyleElement;
    clone.setAttribute('data-rshb-toast-portal-style', 'true');
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
    root.setAttribute('data-rshb-toast-portal-root', 'true');
    targetDocument.body.appendChild(root);
    setPortalRoot(root);
    return () => {
      root.remove();
    };
  }, []);

  return portalRoot ? createPortal(children, portalRoot) : null;
}

function InteractiveToastDemo(args: Story['args']) {
  const [isVisible, setIsVisible] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  function showToast() {
    setToastKey((v) => v + 1);
    setIsVisible(true);
  }

  return (
    <div style={surfaceStyle}>
      <div style={demoStyle}>
        <button onClick={showToast} style={triggerButtonStyle} type="button">
          Показать toast
        </button>
        {isVisible ? (
          <ParentDocumentPortal>
            <Toast
              {...args}
              autoCloseDuration={5000}
              key={toastKey}
              onClose={() => setIsVisible(false)}
              placement="top-center"
            >
              {args?.children}
            </Toast>
          </ParentDocumentPortal>
        ) : null}
      </div>
    </div>
  );
}

export const Playground: Story = {};

export const Interactive: Story = {
  args: {
    autoCloseDuration: 5000,
    variant: 'success'
  },
  render: (args) => <InteractiveToastDemo {...args} />
};

export const Overview: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: () => (
    <div style={surfaceStyle}>
      <div style={rowStyle}>
        {variants.map((variant) => (
          <Toast autoCloseDuration={null} key={variant.value} variant={variant.value}>
            Контент
          </Toast>
        ))}
      </div>
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '28px 36px 40px',
  border: '1px dashed var(--legacy-color-border-default-default, #d7dce1)',
  borderRadius: '4px',
  background: 'var(--color-background-default-primary)'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '32px',
  alignItems: 'center'
};

const demoStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
  gap: '16px',
  justifyItems: 'start',
  minHeight: '220px'
};

const triggerButtonStyle: CSSProperties = {
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  background: 'var(--legacy-color-background-brand-default, #67a757)',
  color: '#ffffff',
  fontFamily: 'var(--legacy-typography-body-font-family)',
  fontSize: 'var(--legacy-typography-body-font-size)',
  fontWeight: 600,
  cursor: 'pointer'
};
