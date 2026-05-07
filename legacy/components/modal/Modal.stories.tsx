import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyModalVariant, LegacyModalProps } from './index.js';
import Modal from './index.js';
import Button from '../button/index.js';

const meta = {
  title: 'Legacy/Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    captchaLabel: '',
    closeOnPrimaryAction: true,
    closeOnTertiaryAction: true,
    description: 'Что-то пошло не так. Пожалуйста, повторите попытку позже.',
    heading: 'Ошибка',
    inputPlaceholder: 'Название',
    placement: 'inline',
    previewState: 'shown',
    variant: 'default'
  },
  argTypes: {
    inputProps: { control: false },
    onClose: { control: false, table: { disable: true } },
    onPrimaryAction: { control: false, table: { disable: true } },
    onRefreshCaptcha: { control: false, table: { disable: true } },
    onSecondaryAction: { control: false, table: { disable: true } },
    onTertiaryAction: { control: false, table: { disable: true } },
    onVoiceCaptcha: { control: false, table: { disable: true } }
  }
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

const variants: Array<{ label: string; value: LegacyModalVariant }> = [
  { label: 'Default', value: 'default' },
  { label: 'Text input', value: 'text-input' },
  { label: 'Captcha', value: 'captcha' }
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

function getStoryArgsForVariant(args: Story['args']): Story['args'] {
  if (args?.variant === 'captcha') {
    return { ...args, captchaLabel: args?.captchaLabel || '        ', closeOnPrimaryAction: false };
  }
  if (args?.variant === 'text-input') {
    return { ...args, closeOnPrimaryAction: false };
  }
  return args;
}

function InteractiveModalDemo(args: Story['args']) {
  const [isVisible, setIsVisible] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const resolvedArgs = getStoryArgsForVariant(args);

  function showModal() {
    setModalKey((v) => v + 1);
    setIsVisible(true);
  }

  return (
    <div style={surfaceStyle}>
      <div style={demoStyle}>
        <Button onClick={showModal} variant="brand">
          Показать modal
        </Button>
        {isVisible ? (
          <ParentDocumentPortal>
            <Modal
              {...resolvedArgs}
              key={modalKey}
              onClose={() => setIsVisible(false)}
              placement="top-center"
            />
          </ParentDocumentPortal>
        ) : null}
      </div>
    </div>
  );
}

export const Playground: Story = {};

export const Interactive: Story = {
  args: { variant: 'default' },
  render: (args) => <InteractiveModalDemo {...args} />
};

export const Overview: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={overviewStyle}>
        <div style={overviewGridStyle}>
          {variants.map((variant) => (
            <Modal
              {...getStoryArgsForVariant({ ...args, variant: variant.value })}
              key={variant.value}
            />
          ))}
        </div>
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

const overviewStyle: CSSProperties = {
  display: 'grid',
  gap: '32px',
  alignItems: 'start',
  justifyItems: 'start'
};

const overviewGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 360px))',
  gap: '32px',
  alignItems: 'start',
  width: '100%'
};

const demoStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
  gap: '16px',
  justifyItems: 'start',
  minHeight: '220px'
};
