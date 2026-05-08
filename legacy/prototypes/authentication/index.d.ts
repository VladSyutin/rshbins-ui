import type { HTMLAttributes } from 'react';
import type { LegacyAuthenticationFirstScreenProps } from '../../templates/authentication/authentication-first-screen/index.js';
import type { LegacyAuthenticationRegistrationProps } from '../../templates/authentication/authentication-registration/index.js';
import type { LegacyAuthenticationPhoneConfirmationProps } from '../../templates/authentication/authentication-phone-confirmation/index.js';
import type { LegacyAuthenticationEmailConfirmationProps } from '../../templates/authentication/authentication-email-confirmation/index.js';
import type { LegacyAuthenticationCreatingLoginPasswordProps } from '../../templates/authentication/authentication-creating-login-password/index.js';
import type { LegacyAuthenticationRegistrationDataProps } from '../../templates/authentication/authentication-registration-data/index.js';
import type { LegacyAuthenticationRestoringAccessProps } from '../../templates/authentication/authentication-restoring-access/index.js';

export interface LegacyAuthenticationPrototypeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  authenticationProps?: Omit<
    LegacyAuthenticationFirstScreenProps,
    'clientType' | 'defaultClientType' | 'device' | 'onClientTypeChange'
  >;
  registrationProps?: Omit<
    LegacyAuthenticationRegistrationProps,
    'device' | 'method' | 'onBack' | 'onMethodChange' | 'themeProps'
  >;
  textMessageCodeProps?: Omit<
    LegacyAuthenticationPhoneConfirmationProps,
    'device' | 'phoneNumber' | 'themeProps'
  >;
  emailCodeProps?: Omit<
    LegacyAuthenticationEmailConfirmationProps,
    'device' | 'email' | 'emailMode' | 'themeProps'
  >;
  creatingLoginPasswordProps?: Omit<
    LegacyAuthenticationCreatingLoginPasswordProps,
    'device' | 'mode' | 'themeProps'
  >;
  policyholderDetailsProps?: Omit<
    LegacyAuthenticationRegistrationDataProps,
    'device' | 'themeProps'
  >;
  restoringAccessProps?: Omit<
    LegacyAuthenticationRestoringAccessProps,
    | 'device'
    | 'loginMethod'
    | 'onBack'
    | 'onLoginMethodChange'
    | 'onRestoringFlowChange'
    | 'restoringFlow'
    | 'themeProps'
  >;
}

export default function AuthenticationPrototype(
  props: LegacyAuthenticationPrototypeProps
): JSX.Element;
