import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialogToastTemplate } from './shared/DialogToastTemplate';
import { EmailConfirmed } from './email-confirmed/EmailConfirmed';
import { NewCodeHasBeenSent } from './new-code-has-been-sent/NewCodeHasBeenSent';
import { NewInstructionsHaveBeenSent } from './new-instructions-have-been-sent/NewInstructionsHaveBeenSent';
import { PasswordChangeIsAvailableOnceEveryXHours } from './password-change-is-available-once-every-x-hours/PasswordChangeIsAvailableOnceEveryXHours';
import { PasswordHasAlreadyBeenUsed } from './password-has-already-been-used/PasswordHasAlreadyBeenUsed';
import { PasswordHasExpired } from './password-has-expired/PasswordHasExpired';
import { SuccessfulAuthentication } from './successful-authentication/SuccessfulAuthentication';
import { SystemError } from './system-error/SystemError';
import { TheLinkHasExpired } from './the-link-has-expired/TheLinkHasExpired';
import { TheUserIsRegistered } from './the-user-is-registered/TheUserIsRegistered';
import { TheUserWasNotFound } from './the-user-was-not-found/TheUserWasNotFound';

const meta = {
  title: 'Dialogs/Toasts/Overview',
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
  border: '1px dashed #8b5cf6',
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
