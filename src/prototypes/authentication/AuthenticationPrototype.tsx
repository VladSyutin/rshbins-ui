import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes
} from 'react';
import { Captcha } from '../../dialogs/modals/captcha/Captcha';
import { Timeout } from '../../dialogs/modals/timeout/Timeout';
import { SuccessfulAuthentication } from '../../dialogs/toasts/successful-authentication/SuccessfulAuthentication';
import { LoaderBrand } from '../../components/loader-brand/LoaderBrand';
import {
  AuthenticationFirstScreen,
  type AuthenticationClientType,
  type CorporateSubmitPayload,
  type IndividualSubmitPayload,
  type AuthenticationFirstScreenProps
} from '../../templates/authentication/authentication-first-screen/AuthenticationFirstScreen';
import {
  AuthenticationEmailConfirmation,
  type AuthenticationEmailConfirmationProps
} from '../../templates/authentication/authentication-email-confirmation/AuthenticationEmailConfirmation';
import {
  AuthenticationCreatingLoginPassword,
  type AuthenticationCreatingLoginPasswordProps
} from '../../templates/authentication/authentication-creating-login-password/AuthenticationCreatingLoginPassword';
import {
  AuthenticationPhoneConfirmation,
  type AuthenticationPhoneConfirmationProps
} from '../../templates/authentication/authentication-phone-confirmation/AuthenticationPhoneConfirmation';
import { LogInThroughTheGosuslugi } from '../../dialogs/modals/log-in-through-the-gosuslugi/LogInThroughTheGosuslugi';
import { ProofOfIdentity } from '../../dialogs/modals/proof-of-identity/ProofOfIdentity';
import { TheUserWasNotFound } from '../../dialogs/toasts/the-user-was-not-found/TheUserWasNotFound';
import {
  AuthenticationRegistrationData,
  type AuthenticationRegistrationDataSubmitPayload,
  type AuthenticationRegistrationDataProps
} from '../../templates/authentication/authentication-registration-data/AuthenticationRegistrationData';
import {
  AuthenticationRegistration,
  type AuthenticationRegistrationSubmitPayload,
  type AuthenticationRegistrationMethod,
  type AuthenticationRegistrationProps
} from '../../templates/authentication/authentication-registration/AuthenticationRegistration';
import {
  AuthenticationRestoringAccess,
  type AuthenticationRestoringAccessFlow,
  type AuthenticationRestoringLoginSubmitPayload,
  type AuthenticationRestoringPasswordSubmitPayload,
  type AuthenticationRestoringAccessMethod,
  type AuthenticationRestoringAccessProps
} from '../../templates/authentication/authentication-restoring-access/AuthenticationRestoringAccess';
import type { ThemeMode } from '../../components/theme/Theme';
import './AuthenticationPrototype.scss';

type AuthenticationPrototypeStep =
  | 'first-screen'
  | 'restoring-access'
  | 'registration-inn'
  | 'registration-phone-confirmation'
  | 'registration-email-confirmation'
  | 'text-message-code-show-with-email'
  | 'email-code-hidden'
  | 'restoring-email-code-visible'
  | 'restoring-phone-code-visible'
  | 'restoring-email-code-hidden'
  | 'restoring-phone-code-hidden'
  | 'creating-login-password'
  | 'proof-of-identity'
  | 'log-in-through-the-gosuslugi'
  | 'policyholder-details';

export interface AuthenticationPrototypeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  authenticationProps?: Omit<
    AuthenticationFirstScreenProps,
    'clientType' | 'defaultClientType' | 'device' | 'onClientTypeChange'
  >;
  registrationProps?: Omit<
    AuthenticationRegistrationProps,
    'device' | 'method' | 'onBack' | 'onMethodChange' | 'themeProps'
  >;
  textMessageCodeProps?: Omit<
    AuthenticationPhoneConfirmationProps,
    'device' | 'phoneNumber' | 'themeProps'
  >;
  emailCodeProps?: Omit<
    AuthenticationEmailConfirmationProps,
    'device' | 'email' | 'emailMode' | 'themeProps'
  >;
  creatingLoginPasswordProps?: Omit<
    AuthenticationCreatingLoginPasswordProps,
    'device' | 'mode' | 'themeProps'
  >;
  policyholderDetailsProps?: Omit<
    AuthenticationRegistrationDataProps,
    'device' | 'themeProps'
  >;
  restoringAccessProps?: Omit<
    AuthenticationRestoringAccessProps,
    | 'device'
    | 'loginMethod'
    | 'onBack'
    | 'onLoginMethodChange'
    | 'onRestoringFlowChange'
    | 'restoringFlow'
    | 'themeProps'
  >;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

type BrandButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
const INITIAL_LOADING_DURATION_MS = 7000;
const CAPTCHA_PHONE_NUMBER = '79999999992';
const CAPTCHA_TIMEOUT_VALUE = 'timeout';
const REGISTRATION_SKIPPED_PHONE_NUMBERS = new Set([
  '79999999990',
  '79999999991',
  CAPTCHA_PHONE_NUMBER
]);
const PROOF_OF_IDENTITY_PHONE_NUMBERS = new Set(['79999999991']);
const LOG_IN_THROUGH_THE_GOSUSLUGI_EMAIL = 'info@rshbins.ru';
const CORPORATE_SUCCESS_LOGIN = 'login';
const CORPORATE_SUCCESS_PASSWORD = 'password';
const PHONE_LOGIN_LOADING_DURATION_MS = 3000;
const RESTORING_ACCESS_LOADING_DURATION_MS = 3000;
const CODE_CHECK_LOADING_DURATION_MS = 3000;
const POLICYHOLDER_DETAILS_LOADING_DURATION_MS = 3000;
const LOG_IN_THROUGH_THE_GOSUSLUGI_LOADING_DURATION_MS = 3000;
const CREATING_LOGIN_PASSWORD_LOADING_DURATION_MS = 3000;
const FINAL_LOADING_DURATION_MS = 7000;
const REGISTRATION_STEP_LOADING_DURATION_MS = 3000;

function getBrowserThemeMode(): ThemeMode {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

export function AuthenticationPrototype({
  authenticationProps,
  className,
  creatingLoginPasswordProps,
  emailCodeProps,
  policyholderDetailsProps,
  registrationProps,
  restoringAccessProps,
  textMessageCodeProps,
  ...props
}: AuthenticationPrototypeProps) {
  const {
    className: authenticationClassName,
    onForgotCredentials,
    onRegister,
    themeProps: authenticationThemeProps,
    ...resolvedAuthenticationProps
  } = authenticationProps ?? {};
  const { className: restoringClassName, ...resolvedRestoringAccessProps } =
    restoringAccessProps ?? {};
  const { className: registrationClassName, ...resolvedRegistrationProps } =
    registrationProps ?? {};
  const { className: textMessageCodeClassName, ...resolvedTextMessageCodeProps } =
    textMessageCodeProps ?? {};
  const {
    className: creatingLoginPasswordClassName,
    ...resolvedCreatingLoginPasswordProps
  } = creatingLoginPasswordProps ?? {};
  const { className: emailCodeClassName, ...resolvedEmailCodeProps } =
    emailCodeProps ?? {};
  const {
    className: policyholderDetailsClassName,
    ...resolvedPolicyholderDetailsProps
  } = policyholderDetailsProps ?? {};
  const [mode, setMode] = useState<ThemeMode>(getBrowserThemeMode);
  const [step, setStep] = useState<AuthenticationPrototypeStep>('first-screen');
  const [clientType, setClientType] = useState<AuthenticationClientType>('individual');
  const [restoringFlow, setRestoringFlow] =
    useState<AuthenticationRestoringAccessFlow>('password');
  const [restoringMethod, setRestoringMethod] =
    useState<AuthenticationRestoringAccessMethod>('email');
  const [registrationMethod, setRegistrationMethod] =
    useState<AuthenticationRegistrationMethod>('email');
  const [restoringAccessDraft, setRestoringAccessDraft] =
    useState<AuthenticationRestoringPasswordSubmitPayload | null>(null);
  const [restoringLoginDraft, setRestoringLoginDraft] =
    useState<AuthenticationRestoringLoginSubmitPayload | null>(null);
  const [registrationDraft, setRegistrationDraft] =
    useState<AuthenticationRegistrationSubmitPayload | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [submittedPhoneNumber, setSubmittedPhoneNumber] = useState('');
  const [policyholderDetailsDraft, setPolicyholderDetailsDraft] =
    useState<AuthenticationRegistrationDataSubmitPayload | null>(null);
  const [isPhoneLoginLoading, setIsPhoneLoginLoading] = useState(false);
  const [isCorporateLoginLoading, setIsCorporateLoginLoading] = useState(false);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [isTimeoutOpen, setIsTimeoutOpen] = useState(false);
  const [isRestoringAccessLoading, setIsRestoringAccessLoading] = useState(false);
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);
  const [isPolicyholderDetailsLoading, setIsPolicyholderDetailsLoading] =
    useState(false);
  const [isLogInThroughTheGosuslugiLoading, setIsLogInThroughTheGosuslugiLoading] =
    useState(false);
  const [isCreatingLoginPasswordLoading, setIsCreatingLoginPasswordLoading] =
    useState(false);
  const [isFinalLoading, setIsFinalLoading] = useState(false);
  const [credentialCreationMode, setCredentialCreationMode] =
    useState<AuthenticationCreatingLoginPasswordProps['mode']>('password');
  const [successfulToastKey, setSuccessfulToastKey] = useState(0);
  const [userWasNotFoundToastKey, setUserWasNotFoundToastKey] = useState(0);
  const phoneLoginTimerRef = useRef<number | null>(null);
  const captchaTimerRef = useRef<number | null>(null);
  const corporateLoginTimerRef = useRef<number | null>(null);
  const restoringAccessTimerRef = useRef<number | null>(null);
  const registrationTimerRef = useRef<number | null>(null);
  const policyholderDetailsTimerRef = useRef<number | null>(null);
  const logInThroughTheGosuslugiTimerRef = useRef<number | null>(null);
  const creatingLoginPasswordTimerRef = useRef<number | null>(null);
  const codeCheckTimerRef = useRef<number | null>(null);
  const stepLoadingTimerRef = useRef<number | null>(null);
  const stepLoadingActionRef = useRef<(() => void) | null>(null);
  const isLoadingScreen = isInitialLoading || isFinalLoading || isStepLoading;
  const device = 'auto';
  const sharedThemeProps = {
    applyToDocument: false,
    mode,
    onModeChange: setMode
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsInitialLoading(false);
    }, INITIAL_LOADING_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isFinalLoading) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsFinalLoading(false);
      setStep('first-screen');
      setClientType('individual');
    }, FINAL_LOADING_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isFinalLoading]);

  useEffect(() => {
    return () => {
      if (phoneLoginTimerRef.current !== null) {
        window.clearTimeout(phoneLoginTimerRef.current);
      }

      if (captchaTimerRef.current !== null) {
        window.clearTimeout(captchaTimerRef.current);
      }

      if (corporateLoginTimerRef.current !== null) {
        window.clearTimeout(corporateLoginTimerRef.current);
      }

      if (restoringAccessTimerRef.current !== null) {
        window.clearTimeout(restoringAccessTimerRef.current);
      }

      if (registrationTimerRef.current !== null) {
        window.clearTimeout(registrationTimerRef.current);
      }

      if (policyholderDetailsTimerRef.current !== null) {
        window.clearTimeout(policyholderDetailsTimerRef.current);
      }

      if (logInThroughTheGosuslugiTimerRef.current !== null) {
        window.clearTimeout(logInThroughTheGosuslugiTimerRef.current);
      }

      if (creatingLoginPasswordTimerRef.current !== null) {
        window.clearTimeout(creatingLoginPasswordTimerRef.current);
      }

      if (codeCheckTimerRef.current !== null) {
        window.clearTimeout(codeCheckTimerRef.current);
      }

      if (stepLoadingTimerRef.current !== null) {
        window.clearTimeout(stepLoadingTimerRef.current);
      }
    };
  }, []);

  function clearStepLoading() {
    if (stepLoadingTimerRef.current !== null) {
      window.clearTimeout(stepLoadingTimerRef.current);
      stepLoadingTimerRef.current = null;
    }

    stepLoadingActionRef.current = null;
    setIsStepLoading(false);
  }

  function startStepLoading(onComplete: () => void) {
    clearStepLoading();
    stepLoadingActionRef.current = onComplete;
    setIsStepLoading(true);

    stepLoadingTimerRef.current = window.setTimeout(() => {
      const action = stepLoadingActionRef.current;

      stepLoadingTimerRef.current = null;
      stepLoadingActionRef.current = null;
      setIsStepLoading(false);
      action?.();
    }, REGISTRATION_STEP_LOADING_DURATION_MS);
  }

  function handleBackToFirstScreen() {
    clearStepLoading();
    setStep('first-screen');
    setIsPhoneLoginLoading(false);
    setIsCorporateLoginLoading(false);
    setIsCaptchaOpen(false);
    setCaptchaValue('');
    setIsCaptchaLoading(false);
    setIsTimeoutOpen(false);
    setIsRestoringAccessLoading(false);
    setIsRegistrationLoading(false);
    setIsPolicyholderDetailsLoading(false);
    setIsLogInThroughTheGosuslugiLoading(false);
    setIsCreatingLoginPasswordLoading(false);
    setSubmittedPhoneNumber('');
    setRegistrationDraft(null);
    setRestoringAccessDraft(null);
    setRestoringLoginDraft(null);
    setPolicyholderDetailsDraft(null);
    setCredentialCreationMode('password');

    if (registrationTimerRef.current !== null) {
      window.clearTimeout(registrationTimerRef.current);
      registrationTimerRef.current = null;
    }

    if (captchaTimerRef.current !== null) {
      window.clearTimeout(captchaTimerRef.current);
      captchaTimerRef.current = null;
    }
  }

  function handleLogoClick() {
    clearStepLoading();
    setStep('first-screen');
    setClientType('individual');
    setIsPhoneLoginLoading(false);
    setIsCorporateLoginLoading(false);
    setIsCaptchaOpen(false);
    setCaptchaValue('');
    setIsCaptchaLoading(false);
    setIsTimeoutOpen(false);
    setIsRestoringAccessLoading(false);
    setIsRegistrationLoading(false);
    setIsPolicyholderDetailsLoading(false);
    setIsLogInThroughTheGosuslugiLoading(false);
    setIsCreatingLoginPasswordLoading(false);
    setSubmittedPhoneNumber('');
    setRegistrationDraft(null);
    setRestoringAccessDraft(null);
    setRestoringLoginDraft(null);
    setPolicyholderDetailsDraft(null);
    setCredentialCreationMode('password');

    if (registrationTimerRef.current !== null) {
      window.clearTimeout(registrationTimerRef.current);
      registrationTimerRef.current = null;
    }

    if (captchaTimerRef.current !== null) {
      window.clearTimeout(captchaTimerRef.current);
      captchaTimerRef.current = null;
    }
  }

  function normalizePhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, '');

    return digits.length === 10 ? `7${digits}` : digits;
  }

  function formatPhoneNumber(value: string): string {
    const digits = normalizePhoneNumber(value);
    const localDigits = digits.length === 11 && digits[0] === '7' ? digits.slice(1) : digits;

    if (localDigits.length !== 10) {
      return value;
    }

    return `+7 (${localDigits.slice(0, 3)}) ${localDigits.slice(3, 6)}-${localDigits.slice(6, 8)}-${localDigits.slice(8, 10)}`;
  }

  function handleIndividualSubmit(payload: IndividualSubmitPayload) {
    resolvedAuthenticationProps.onIndividualSubmit?.(payload);
    const normalizedPhoneNumber = normalizePhoneNumber(payload.phone);
    setSubmittedPhoneNumber(normalizedPhoneNumber);

    if (normalizedPhoneNumber === CAPTCHA_PHONE_NUMBER) {
      setCaptchaValue('');
      setIsPhoneLoginLoading(true);

      if (phoneLoginTimerRef.current !== null) {
        window.clearTimeout(phoneLoginTimerRef.current);
      }

      phoneLoginTimerRef.current = window.setTimeout(() => {
        phoneLoginTimerRef.current = null;
        setIsPhoneLoginLoading(false);
        setIsCaptchaOpen(true);
      }, PHONE_LOGIN_LOADING_DURATION_MS);
      return;
    }

    setIsPhoneLoginLoading(true);

    if (phoneLoginTimerRef.current !== null) {
      window.clearTimeout(phoneLoginTimerRef.current);
    }

    phoneLoginTimerRef.current = window.setTimeout(() => {
      phoneLoginTimerRef.current = null;
      setIsPhoneLoginLoading(false);

      if (PROOF_OF_IDENTITY_PHONE_NUMBERS.has(normalizedPhoneNumber)) {
        setStep('proof-of-identity');
        return;
      }

      openTextMessageCodeStep();
    }, PHONE_LOGIN_LOADING_DURATION_MS);
  }

  function handleCaptchaClose() {
    if (captchaTimerRef.current !== null) {
      window.clearTimeout(captchaTimerRef.current);
      captchaTimerRef.current = null;
    }

    setIsCaptchaOpen(false);
    setCaptchaValue('');
    setIsCaptchaLoading(false);
  }

  function handleCaptchaContinue() {
    setIsCaptchaLoading(true);

    if (captchaTimerRef.current !== null) {
      window.clearTimeout(captchaTimerRef.current);
    }

    captchaTimerRef.current = window.setTimeout(() => {
      captchaTimerRef.current = null;
      setIsCaptchaLoading(false);
      setIsCaptchaOpen(false);

      if (captchaValue.trim().toLowerCase() === CAPTCHA_TIMEOUT_VALUE) {
        setCaptchaValue('');
        setIsTimeoutOpen(true);
        return;
      }

      openTextMessageCodeStep();
    }, PHONE_LOGIN_LOADING_DURATION_MS);
  }

  function handleCorporateSubmit(payload: CorporateSubmitPayload) {
    resolvedAuthenticationProps.onCorporateSubmit?.(payload);
    setIsCorporateLoginLoading(true);

    if (corporateLoginTimerRef.current !== null) {
      window.clearTimeout(corporateLoginTimerRef.current);
    }

    corporateLoginTimerRef.current = window.setTimeout(() => {
      corporateLoginTimerRef.current = null;
      setIsCorporateLoginLoading(false);

      if (
        payload.login.trim() === CORPORATE_SUCCESS_LOGIN &&
        payload.password.trim() === CORPORATE_SUCCESS_PASSWORD
      ) {
        setSuccessfulToastKey((currentKey) => currentKey + 1);
        setIsFinalLoading(true);
        return;
      }

      setUserWasNotFoundToastKey((currentKey) => currentKey + 1);
    }, PHONE_LOGIN_LOADING_DURATION_MS);
  }

  function openTextMessageCodeStep() {
    setStep('text-message-code-show-with-email');
  }

  function openHiddenEmailCodeStep() {
    setStep('email-code-hidden');
  }

  function openRestoringEmailCodeStep() {
    setStep('restoring-email-code-hidden');
  }

  function openRestoringPhoneCodeStep() {
    setStep('restoring-phone-code-hidden');
  }

  function openCreatingLoginPasswordStep() {
    setStep('creating-login-password');
  }

  function handleRegistrationSubmit(payload: AuthenticationRegistrationSubmitPayload) {
    resolvedRegistrationProps.onSubmit?.(payload);
    setRegistrationDraft(payload);
    setRegistrationMethod(payload.method);
    setIsRegistrationLoading(true);

    if (registrationTimerRef.current !== null) {
      window.clearTimeout(registrationTimerRef.current);
    }

    registrationTimerRef.current = window.setTimeout(() => {
      registrationTimerRef.current = null;
      setIsRegistrationLoading(false);
      setStep(
        payload.method === 'phone'
          ? 'registration-phone-confirmation'
          : 'registration-email-confirmation'
      );
    }, REGISTRATION_STEP_LOADING_DURATION_MS);
  }

  function handleCodeComplete() {
    if (codeCheckTimerRef.current !== null) {
      window.clearTimeout(codeCheckTimerRef.current);
    }

    codeCheckTimerRef.current = window.setTimeout(() => {
      codeCheckTimerRef.current = null;
      if (REGISTRATION_SKIPPED_PHONE_NUMBERS.has(submittedPhoneNumber)) {
        setSuccessfulToastKey((currentKey) => currentKey + 1);
        setIsFinalLoading(true);
        return;
      }

      setStep('policyholder-details');
    }, CODE_CHECK_LOADING_DURATION_MS);
  }

  function handleRestoringAccessSubmit(
    payload: AuthenticationRestoringPasswordSubmitPayload
  ) {
    resolvedRestoringAccessProps.onPasswordSubmit?.(payload);
    setRestoringAccessDraft(payload);
    setIsRestoringAccessLoading(true);

    if (restoringAccessTimerRef.current !== null) {
      window.clearTimeout(restoringAccessTimerRef.current);
    }

    restoringAccessTimerRef.current = window.setTimeout(() => {
      restoringAccessTimerRef.current = null;
      setIsRestoringAccessLoading(false);

      const normalizedValue = payload.login.trim().toLowerCase();
      const phoneDigits = normalizedValue.replace(/\D/g, '');
      const isPhoneValue =
        normalizedValue === 'phone' ||
        phoneDigits.length === 10 ||
        phoneDigits.length === 11;

      if (isPhoneValue) {
        openRestoringPhoneCodeStep();
        return;
      }

      openRestoringEmailCodeStep();
    }, RESTORING_ACCESS_LOADING_DURATION_MS);
  }

  function handleRestoringLoginSubmit(
    payload: AuthenticationRestoringLoginSubmitPayload
  ) {
    resolvedRestoringAccessProps.onRestoringLoginSubmit?.(payload);
    setRestoringLoginDraft(payload);
    setIsRestoringAccessLoading(true);

    if (restoringAccessTimerRef.current !== null) {
      window.clearTimeout(restoringAccessTimerRef.current);
    }

    restoringAccessTimerRef.current = window.setTimeout(() => {
      restoringAccessTimerRef.current = null;
      setIsRestoringAccessLoading(false);
      setStep(
        payload.method === 'phone'
          ? 'restoring-phone-code-visible'
          : 'restoring-email-code-visible'
      );
    }, RESTORING_ACCESS_LOADING_DURATION_MS);
  }

  function handleRestoringCodeComplete() {
    if (codeCheckTimerRef.current !== null) {
      window.clearTimeout(codeCheckTimerRef.current);
    }

    codeCheckTimerRef.current = window.setTimeout(() => {
      codeCheckTimerRef.current = null;
      setCredentialCreationMode('password');
      openCreatingLoginPasswordStep();
    }, CODE_CHECK_LOADING_DURATION_MS);
  }

  function handleRestoringLoginCodeComplete() {
    if (codeCheckTimerRef.current !== null) {
      window.clearTimeout(codeCheckTimerRef.current);
    }

    codeCheckTimerRef.current = window.setTimeout(() => {
      codeCheckTimerRef.current = null;
      setCredentialCreationMode('login');
      openCreatingLoginPasswordStep();
    }, CODE_CHECK_LOADING_DURATION_MS);
  }

  function handleRegistrationCodeComplete() {
    if (codeCheckTimerRef.current !== null) {
      window.clearTimeout(codeCheckTimerRef.current);
    }

    codeCheckTimerRef.current = window.setTimeout(() => {
      codeCheckTimerRef.current = null;
      setCredentialCreationMode('login-and-password');
      openCreatingLoginPasswordStep();
    }, CODE_CHECK_LOADING_DURATION_MS);
  }

  function handleCreatingLoginPasswordSubmit() {
    setIsCreatingLoginPasswordLoading(true);

    if (creatingLoginPasswordTimerRef.current !== null) {
      window.clearTimeout(creatingLoginPasswordTimerRef.current);
    }

    creatingLoginPasswordTimerRef.current = window.setTimeout(() => {
      creatingLoginPasswordTimerRef.current = null;
      setIsCreatingLoginPasswordLoading(false);
      setSuccessfulToastKey((currentKey) => currentKey + 1);
      setIsFinalLoading(true);
      setRestoringLoginDraft(null);
      setCredentialCreationMode('password');
    }, CREATING_LOGIN_PASSWORD_LOADING_DURATION_MS);
  }

  function formatHiddenPhoneNumber(_value: string): string {
    return '+7 (***) ***-99-99';
  }

  function formatHiddenEmail(value: string): string {
    const trimmedValue = value.trim().toLowerCase();
    const [localPart = '', domainPart = ''] = trimmedValue.split('@');

    if (!localPart || !domainPart) {
      return 's******i@r*****s.ru';
    }

    const maskedLocalPart =
      localPart.length <= 2
        ? `${localPart[0] ?? '*'}*`
        : `${localPart[0]}${'*'.repeat(Math.max(localPart.length - 2, 1))}${localPart.at(-1)}`;
    const maskedDomain =
      domainPart.length <= 2
        ? `${domainPart[0] ?? '*'}*`
        : `${domainPart[0]}${'*'.repeat(Math.max(domainPart.length - 2, 1))}${domainPart.at(-1)}`;

    return `${maskedLocalPart}@${maskedDomain}`;
  }

  function handlePolicyholderDetailsSubmit() {
    setIsPolicyholderDetailsLoading(true);

    if (policyholderDetailsTimerRef.current !== null) {
      window.clearTimeout(policyholderDetailsTimerRef.current);
    }

    policyholderDetailsTimerRef.current = window.setTimeout(() => {
      policyholderDetailsTimerRef.current = null;
      setIsPolicyholderDetailsLoading(false);
      setSuccessfulToastKey((currentKey) => currentKey + 1);
      setIsFinalLoading(true);
    }, POLICYHOLDER_DETAILS_LOADING_DURATION_MS);
  }

  function handlePolicyholderDetailsFlow(
    payload: AuthenticationRegistrationDataSubmitPayload
  ) {
    setPolicyholderDetailsDraft(payload);

    if (
      payload.email.trim().toLowerCase() === LOG_IN_THROUGH_THE_GOSUSLUGI_EMAIL
    ) {
      setIsLogInThroughTheGosuslugiLoading(true);

      if (logInThroughTheGosuslugiTimerRef.current !== null) {
        window.clearTimeout(logInThroughTheGosuslugiTimerRef.current);
      }

      logInThroughTheGosuslugiTimerRef.current = window.setTimeout(() => {
        logInThroughTheGosuslugiTimerRef.current = null;
        setIsLogInThroughTheGosuslugiLoading(false);
        setStep('log-in-through-the-gosuslugi');
      }, LOG_IN_THROUGH_THE_GOSUSLUGI_LOADING_DURATION_MS);
      return;
    }

    handlePolicyholderDetailsSubmit();
  }

  function getHomeBrandButtonProps(
    brandButtonProps?: BrandButtonProps
  ): BrandButtonProps {
    return {
      ...brandButtonProps,
      onClick: (event) => {
        brandButtonProps?.onClick?.(event);

        if (!event.defaultPrevented) {
          handleLogoClick();
        }
      }
    };
  }

  function renderStep() {
    const codeInputProps = {
      completionBehavior: 'reset' as const,
      loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
      onComplete: handleCodeComplete
    };

    if (step === 'policyholder-details') {
      return (
        <AuthenticationRegistrationData
          {...resolvedPolicyholderDetailsProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedPolicyholderDetailsProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            policyholderDetailsClassName
          )}
          defaultBirthDate={policyholderDetailsDraft?.birthDate}
          defaultConsentAccepted={
            policyholderDetailsDraft?.consentAccepted ??
            resolvedPolicyholderDetailsProps.defaultConsentAccepted
          }
          defaultEmail={
            policyholderDetailsDraft?.email ??
            resolvedPolicyholderDetailsProps.defaultEmail
          }
          defaultGender={
            policyholderDetailsDraft?.gender ??
            resolvedPolicyholderDetailsProps.defaultGender
          }
          defaultMiddleName={
            policyholderDetailsDraft?.middleName ??
            resolvedPolicyholderDetailsProps.defaultMiddleName
          }
          defaultName={
            policyholderDetailsDraft?.name ??
            resolvedPolicyholderDetailsProps.defaultName
          }
          defaultSurname={
            policyholderDetailsDraft?.surname ??
            resolvedPolicyholderDetailsProps.defaultSurname
          }
          defaultWithoutMiddleName={
            policyholderDetailsDraft?.withoutMiddleName ??
            resolvedPolicyholderDetailsProps.defaultWithoutMiddleName
          }
          device={device}
          onSubmit={(payload) => {
            resolvedPolicyholderDetailsProps.onSubmit?.(payload);
            handlePolicyholderDetailsFlow(payload);
          }}
          saveButtonProps={{
            ...resolvedPolicyholderDetailsProps.saveButtonProps,
            loading:
              isLogInThroughTheGosuslugiLoading ||
              isPolicyholderDetailsLoading ||
              resolvedPolicyholderDetailsProps.saveButtonProps?.loading
          }}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'log-in-through-the-gosuslugi') {
      return (
        <>
          <AuthenticationRegistrationData
            {...resolvedPolicyholderDetailsProps}
            brandButtonProps={getHomeBrandButtonProps(
              resolvedPolicyholderDetailsProps.brandButtonProps
            )}
            className={joinClassNames(
              'rshb-authentication-prototype__template',
              policyholderDetailsClassName
            )}
            defaultBirthDate={policyholderDetailsDraft?.birthDate}
            defaultConsentAccepted={
              policyholderDetailsDraft?.consentAccepted ??
              resolvedPolicyholderDetailsProps.defaultConsentAccepted
            }
            defaultEmail={
              policyholderDetailsDraft?.email ??
              resolvedPolicyholderDetailsProps.defaultEmail
            }
            defaultGender={
              policyholderDetailsDraft?.gender ??
              resolvedPolicyholderDetailsProps.defaultGender
            }
            defaultMiddleName={
              policyholderDetailsDraft?.middleName ??
              resolvedPolicyholderDetailsProps.defaultMiddleName
            }
            defaultName={
              policyholderDetailsDraft?.name ??
              resolvedPolicyholderDetailsProps.defaultName
            }
            defaultSurname={
              policyholderDetailsDraft?.surname ??
              resolvedPolicyholderDetailsProps.defaultSurname
            }
            defaultWithoutMiddleName={
              policyholderDetailsDraft?.withoutMiddleName ??
              resolvedPolicyholderDetailsProps.defaultWithoutMiddleName
            }
            device={device}
            onSubmit={(payload) => {
              resolvedPolicyholderDetailsProps.onSubmit?.(payload);
              handlePolicyholderDetailsFlow(payload);
            }}
            saveButtonProps={{
              ...resolvedPolicyholderDetailsProps.saveButtonProps,
              loading:
                isLogInThroughTheGosuslugiLoading ||
                resolvedPolicyholderDetailsProps.saveButtonProps?.loading
            }}
            themeProps={sharedThemeProps}
          />
          <LogInThroughTheGosuslugi
            onClose={() => setStep('policyholder-details')}
            placement="top-center"
          />
        </>
      );
    }

    if (step === 'email-code-hidden') {
      return (
        <AuthenticationEmailConfirmation
          {...resolvedEmailCodeProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedEmailCodeProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            emailCodeClassName
          )}
          codeInputProps={{
            ...resolvedEmailCodeProps.codeInputProps,
            ...codeInputProps,
            onComplete: (code) => {
              resolvedEmailCodeProps.codeInputProps?.onComplete?.(code);
              handleCodeComplete();
            }
          }}
          device={device}
          email="sample@rshbins.ru"
          emailMode="hidden"
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'registration-email-confirmation') {
      return (
        <AuthenticationEmailConfirmation
          {...resolvedEmailCodeProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedEmailCodeProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            emailCodeClassName
          )}
          codeInputProps={{
            ...resolvedEmailCodeProps.codeInputProps,
            completionBehavior: 'reset',
            loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
            onComplete: (code) => {
              resolvedEmailCodeProps.codeInputProps?.onComplete?.(code);
              handleRegistrationCodeComplete();
            }
          }}
          device={device}
          email={registrationDraft?.value ?? ''}
          emailMode="visible"
          onChangeEmail={() => setStep('registration-inn')}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'restoring-email-code-hidden') {
      return (
        <AuthenticationEmailConfirmation
          {...resolvedEmailCodeProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedEmailCodeProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            emailCodeClassName
          )}
          codeInputProps={{
            ...resolvedEmailCodeProps.codeInputProps,
            completionBehavior: 'reset',
            loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
            onComplete: (code) => {
              resolvedEmailCodeProps.codeInputProps?.onComplete?.(code);
              handleRestoringCodeComplete();
            }
          }}
          device={device}
          email={restoringAccessDraft?.login ?? ''}
          emailMode="hidden"
          hiddenEmail={formatHiddenEmail(restoringAccessDraft?.login ?? '')}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'restoring-email-code-visible') {
      return (
        <AuthenticationEmailConfirmation
          {...resolvedEmailCodeProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedEmailCodeProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            emailCodeClassName
          )}
          codeInputProps={{
            ...resolvedEmailCodeProps.codeInputProps,
            completionBehavior: 'reset',
            loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
            onComplete: (code) => {
              resolvedEmailCodeProps.codeInputProps?.onComplete?.(code);
              handleRestoringLoginCodeComplete();
            }
          }}
          device={device}
          email={restoringLoginDraft?.value ?? ''}
          emailMode="visible"
          onChangeEmail={() => setStep('restoring-access')}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'restoring-phone-code-hidden') {
      return (
        <AuthenticationPhoneConfirmation
          {...resolvedTextMessageCodeProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedTextMessageCodeProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            textMessageCodeClassName
          )}
          codeInputProps={{
            ...resolvedTextMessageCodeProps.codeInputProps,
            completionBehavior: 'reset',
            loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
            onComplete: (code) => {
              resolvedTextMessageCodeProps.codeInputProps?.onComplete?.(code);
              handleRestoringCodeComplete();
            }
          }}
          device={device}
          hiddenPhoneNumber={formatHiddenPhoneNumber(restoringAccessDraft?.login ?? '')}
          phoneMode="hidden"
          phoneNumber={formatPhoneNumber(restoringAccessDraft?.login ?? '')}
          showEmailButton={false}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'restoring-phone-code-visible') {
      return (
        <AuthenticationPhoneConfirmation
          {...resolvedTextMessageCodeProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedTextMessageCodeProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            textMessageCodeClassName
          )}
          codeInputProps={{
            ...resolvedTextMessageCodeProps.codeInputProps,
            completionBehavior: 'reset',
            loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
            onComplete: (code) => {
              resolvedTextMessageCodeProps.codeInputProps?.onComplete?.(code);
              handleRestoringLoginCodeComplete();
            }
          }}
          device={device}
          onChangePhone={() => setStep('restoring-access')}
          phoneNumber={formatPhoneNumber(restoringLoginDraft?.value ?? '')}
          showEmailButton={false}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'creating-login-password') {
      return (
        <AuthenticationCreatingLoginPassword
          {...resolvedCreatingLoginPasswordProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedCreatingLoginPasswordProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            creatingLoginPasswordClassName
          )}
          defaultLogin={resolvedCreatingLoginPasswordProps.defaultLogin ?? ''}
          device={device}
          mode={credentialCreationMode}
          onSubmit={(payload) => {
            resolvedCreatingLoginPasswordProps.onSubmit?.(payload);
            handleCreatingLoginPasswordSubmit();
          }}
          saveButtonProps={{
            ...resolvedCreatingLoginPasswordProps.saveButtonProps,
            loading:
              isCreatingLoginPasswordLoading ||
              resolvedCreatingLoginPasswordProps.saveButtonProps?.loading
          }}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'proof-of-identity') {
      return (
        <>
          <AuthenticationFirstScreen
            {...resolvedAuthenticationProps}
            brandButtonProps={getHomeBrandButtonProps(
              resolvedAuthenticationProps.brandButtonProps
            )}
            className={joinClassNames(
              'rshb-authentication-prototype__template',
              authenticationClassName
            )}
            clientType={clientType}
            device={device}
            loginButtonProps={{
              ...resolvedAuthenticationProps.loginButtonProps,
              loading: false
            }}
            onClientTypeChange={setClientType}
            onForgotCredentials={() => {
              onForgotCredentials?.();
              setStep('restoring-access');
            }}
            onIndividualSubmit={handleIndividualSubmit}
            onRegister={() => {
              onRegister?.();
              setStep('registration-inn');
            }}
            themeProps={{
              ...authenticationThemeProps,
              ...sharedThemeProps
            }}
          />
          <ProofOfIdentity
            onClose={handleBackToFirstScreen}
            onContinue={openTextMessageCodeStep}
            placement="top-center"
          />
        </>
      );
    }

    if (step === 'text-message-code-show-with-email') {
      return (
        <AuthenticationPhoneConfirmation
          {...resolvedTextMessageCodeProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedTextMessageCodeProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            textMessageCodeClassName
          )}
          codeInputProps={{
            ...resolvedTextMessageCodeProps.codeInputProps,
            ...codeInputProps,
            onComplete: (code) => {
              resolvedTextMessageCodeProps.codeInputProps?.onComplete?.(code);
              handleCodeComplete();
            }
          }}
          device={device}
          onChangePhone={handleBackToFirstScreen}
          onRequestEmailCode={openHiddenEmailCodeStep}
          phoneNumber={formatPhoneNumber(submittedPhoneNumber)}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'registration-phone-confirmation') {
      return (
        <AuthenticationPhoneConfirmation
          {...resolvedTextMessageCodeProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedTextMessageCodeProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            textMessageCodeClassName
          )}
          codeInputProps={{
            ...resolvedTextMessageCodeProps.codeInputProps,
            completionBehavior: 'reset',
            loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
            onComplete: (code) => {
              resolvedTextMessageCodeProps.codeInputProps?.onComplete?.(code);
              handleRegistrationCodeComplete();
            }
          }}
          device={device}
          onChangePhone={() => setStep('registration-inn')}
          phoneNumber={formatPhoneNumber(registrationDraft?.value ?? '')}
          showEmailButton={false}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'restoring-access') {
      return (
        <AuthenticationRestoringAccess
          {...resolvedRestoringAccessProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedRestoringAccessProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            restoringClassName
          )}
          defaultLogin={
            restoringAccessDraft?.login ?? resolvedRestoringAccessProps.defaultLogin
          }
          device={device}
          loginMethod={restoringMethod}
          onBack={handleBackToFirstScreen}
          onLoginMethodChange={setRestoringMethod}
          onRestoringLoginSubmit={handleRestoringLoginSubmit}
          onPasswordSubmit={handleRestoringAccessSubmit}
          onRestoringFlowChange={setRestoringFlow}
          restoringFlow={restoringFlow}
          submitButtonProps={{
            ...resolvedRestoringAccessProps.submitButtonProps,
            loading:
              isRestoringAccessLoading ||
              resolvedRestoringAccessProps.submitButtonProps?.loading
          }}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'registration-inn') {
      return (
        <AuthenticationRegistration
          {...resolvedRegistrationProps}
          brandButtonProps={getHomeBrandButtonProps(
            resolvedRegistrationProps.brandButtonProps
          )}
          className={joinClassNames(
            'rshb-authentication-prototype__template',
            registrationClassName
          )}
          device={device}
          method={registrationMethod}
          onBack={handleBackToFirstScreen}
          onMethodChange={setRegistrationMethod}
          onSubmit={handleRegistrationSubmit}
          registerButtonProps={{
            ...resolvedRegistrationProps.registerButtonProps,
            loading:
              isRegistrationLoading ||
              resolvedRegistrationProps.registerButtonProps?.loading
          }}
          themeProps={sharedThemeProps}
        />
      );
    }

    return (
      <AuthenticationFirstScreen
        {...resolvedAuthenticationProps}
        brandButtonProps={getHomeBrandButtonProps(
          resolvedAuthenticationProps.brandButtonProps
        )}
        className={joinClassNames(
          'rshb-authentication-prototype__template',
          authenticationClassName
        )}
        clientType={clientType}
        device={device}
        onClientTypeChange={setClientType}
        onForgotCredentials={() => {
          onForgotCredentials?.();
          setStep('restoring-access');
        }}
        onCorporateSubmit={handleCorporateSubmit}
        onIndividualSubmit={handleIndividualSubmit}
        onRegister={() => {
          onRegister?.();
          setStep('registration-inn');
        }}
        loginButtonProps={{
          ...resolvedAuthenticationProps.loginButtonProps,
          loading:
            isPhoneLoginLoading ||
            isCorporateLoginLoading ||
            resolvedAuthenticationProps.loginButtonProps?.loading
        }}
        themeProps={{
          ...authenticationThemeProps,
          ...sharedThemeProps
        }}
      />
    );
  }

  return (
    <div
      {...props}
      className={joinClassNames(
        'rshb-authentication-prototype',
        isLoadingScreen && 'rshb-authentication-prototype--loading',
        `theme-${mode}`,
        className
      )}
    >
      {isLoadingScreen ? (
        <div className="rshb-authentication-prototype__loading">
          <LoaderBrand />
        </div>
      ) : (
        renderStep()
      )}
      {isCaptchaOpen ? (
        <Captcha
          continueLoading={isCaptchaLoading}
          inputValue={captchaValue}
          onClose={handleCaptchaClose}
          onContinue={handleCaptchaContinue}
          onInputValueChange={setCaptchaValue}
          placement="top-center"
        />
      ) : null}
      {isTimeoutOpen ? (
        <Timeout
          countdownDurationSeconds={30 * 60}
          onClose={() => setIsTimeoutOpen(false)}
          placement="top-center"
        />
      ) : null}
      {successfulToastKey > 0 ? (
        <SuccessfulAuthentication
          key={successfulToastKey}
          onClose={() => setSuccessfulToastKey(0)}
          placement="top-center"
        />
      ) : null}
      {userWasNotFoundToastKey > 0 ? (
        <TheUserWasNotFound
          key={userWasNotFoundToastKey}
          onClose={() => setUserWasNotFoundToastKey(0)}
          placement="top-center"
        />
      ) : null}
    </div>
  );
}
