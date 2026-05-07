import type { Meta, StoryObj } from '@storybook/react-vite';
import DialogToastTemplate from './shared/index.js';
import EmailConfirmed from './email-confirmed/index.js';
import NewCodeHasBeenSent from './new-code-has-been-sent/index.js';
import NewInstructionsHaveBeenSent from './new-instructions-have-been-sent/index.js';
import PasswordChangeIsAvailableOnceEveryXHours from './password-change-is-available-once-every-x-hours/index.js';
import PasswordHasAlreadyBeenUsed from './password-has-already-been-used/index.js';
import PasswordHasExpired from './password-has-expired/index.js';
import SuccessfulAuthentication from './successful-authentication/index.js';
import SystemError from './system-error/index.js';
import TheLinkHasExpired from './the-link-has-expired/index.js';
import TheUserIsRegistered from './the-user-is-registered/index.js';
import TheUserWasNotFound from './the-user-was-not-found/index.js';

const meta = {
  title: 'Legacy/Dialogs/Toasts/Overview',
  component: DialogToastTemplate,
  tags: ['autodocs']
} satisfies Meta<typeof DialogToastTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

const layoutStyle = {
  display: 'grid',
  gap: '16px',
  justifyItems: 'start',
  padding: '28px 36px 40px',
  border: '1px dashed var(--color-border-default-default)',
  borderRadius: '4px',
  background: 'var(--color-background-default-primary)'
} as const;

export const AllTemplates: Story = {
  args: {
    autoCloseDuration: null,
    closable: true,
    message: 'Контент',
    placement: 'inline',
    previewState: 'shown',
    variant: 'danger'
  },
  render: () => (
    <div style={layoutStyle}>
      <SystemError autoCloseDuration={null} />
      <TheLinkHasExpired autoCloseDuration={null} />
      <TheUserWasNotFound autoCloseDuration={null} />
      <TheUserIsRegistered autoCloseDuration={null} />
      <PasswordHasAlreadyBeenUsed autoCloseDuration={null} />
      <PasswordChangeIsAvailableOnceEveryXHours autoCloseDuration={null} />
      <PasswordHasExpired autoCloseDuration={null} />
      <SuccessfulAuthentication autoCloseDuration={null} />
      <NewCodeHasBeenSent autoCloseDuration={null} />
      <NewInstructionsHaveBeenSent autoCloseDuration={null} />
      <EmailConfirmed autoCloseDuration={null} />
    </div>
  )
};
