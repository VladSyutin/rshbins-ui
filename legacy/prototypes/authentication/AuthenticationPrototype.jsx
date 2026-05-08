import React, { useEffect, useRef, useState } from 'react';
import LoaderBrand from '../../components/loader-brand/index.js';
import Captcha from '../../dialogs/modals/captcha/index.js';
import Timeout from '../../dialogs/modals/timeout/index.js';
import ProofOfIdentity from '../../dialogs/modals/proof-of-identity/index.js';
import LogInThroughTheGosuslugi from '../../dialogs/modals/log-in-through-the-gosuslugi/index.js';
import FilledCookies from '../../dialogs/cookies/filled/index.js';
import SuccessfulAuthentication from '../../dialogs/toasts/successful-authentication/index.js';
import TheUserWasNotFound from '../../dialogs/toasts/the-user-was-not-found/index.js';
import AuthenticationFirstScreen from '../../templates/authentication/authentication-first-screen/index.js';
import AuthenticationEmailConfirmation from '../../templates/authentication/authentication-email-confirmation/index.js';
import AuthenticationPhoneConfirmation from '../../templates/authentication/authentication-phone-confirmation/index.js';
import AuthenticationCreatingLoginPassword from '../../templates/authentication/authentication-creating-login-password/index.js';
import AuthenticationRegistrationData from '../../templates/authentication/authentication-registration-data/index.js';
import AuthenticationRegistration from '../../templates/authentication/authentication-registration/index.js';
import AuthenticationRestoringAccess from '../../templates/authentication/authentication-restoring-access/index.js';
import '../../../src/prototypes/authentication/AuthenticationPrototype.scss';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

var COOKIES_XS_BREAKPOINT = 743;
var INITIAL_LOADING_DURATION_MS = 7000;
var CAPTCHA_PHONE_NUMBER = '79999999992';
var CAPTCHA_TIMEOUT_VALUE = 'timeout';
var REGISTRATION_SKIPPED_PHONE_NUMBERS = new Set([
  '79999999990',
  '79999999991',
  CAPTCHA_PHONE_NUMBER
]);
var PROOF_OF_IDENTITY_PHONE_NUMBERS = new Set(['79999999991']);
var LOG_IN_THROUGH_THE_GOSUSLUGI_EMAIL = 'info@rshbins.ru';
var CORPORATE_SUCCESS_LOGIN = 'login';
var CORPORATE_SUCCESS_PASSWORD = 'password';
var PHONE_LOGIN_LOADING_DURATION_MS = 3000;
var RESTORING_ACCESS_LOADING_DURATION_MS = 3000;
var CODE_CHECK_LOADING_DURATION_MS = 3000;
var POLICYHOLDER_DETAILS_LOADING_DURATION_MS = 3000;
var LOG_IN_THROUGH_THE_GOSUSLUGI_LOADING_DURATION_MS = 3000;
var CREATING_LOGIN_PASSWORD_LOADING_DURATION_MS = 3000;
var FINAL_LOADING_DURATION_MS = 7000;
var REGISTRATION_STEP_LOADING_DURATION_MS = 3000;

function getBrowserThemeMode() {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

export default function AuthenticationPrototype(props) {
  var authenticationProps = props.authenticationProps;
  var className = props.className;
  var creatingLoginPasswordProps = props.creatingLoginPasswordProps;
  var emailCodeProps = props.emailCodeProps;
  var policyholderDetailsProps = props.policyholderDetailsProps;
  var registrationProps = props.registrationProps;
  var restoringAccessProps = props.restoringAccessProps;
  var textMessageCodeProps = props.textMessageCodeProps;

  var resolvedAuthenticationProps = Object.assign({}, authenticationProps);
  var authenticationClassName = resolvedAuthenticationProps.className;
  var onForgotCredentials = resolvedAuthenticationProps.onForgotCredentials;
  var onRegister = resolvedAuthenticationProps.onRegister;
  var authenticationThemeProps = resolvedAuthenticationProps.themeProps;
  delete resolvedAuthenticationProps.className;
  delete resolvedAuthenticationProps.onForgotCredentials;
  delete resolvedAuthenticationProps.onRegister;
  delete resolvedAuthenticationProps.themeProps;

  var resolvedRestoringAccessProps = Object.assign({}, restoringAccessProps);
  var restoringClassName = resolvedRestoringAccessProps.className;
  delete resolvedRestoringAccessProps.className;

  var resolvedRegistrationProps = Object.assign({}, registrationProps);
  var registrationClassName = resolvedRegistrationProps.className;
  delete resolvedRegistrationProps.className;

  var resolvedTextMessageCodeProps = Object.assign({}, textMessageCodeProps);
  var textMessageCodeClassName = resolvedTextMessageCodeProps.className;
  delete resolvedTextMessageCodeProps.className;

  var resolvedCreatingLoginPasswordProps = Object.assign({}, creatingLoginPasswordProps);
  var creatingLoginPasswordClassName = resolvedCreatingLoginPasswordProps.className;
  delete resolvedCreatingLoginPasswordProps.className;

  var resolvedEmailCodeProps = Object.assign({}, emailCodeProps);
  var emailCodeClassName = resolvedEmailCodeProps.className;
  delete resolvedEmailCodeProps.className;

  var resolvedPolicyholderDetailsProps = Object.assign({}, policyholderDetailsProps);
  var policyholderDetailsClassName = resolvedPolicyholderDetailsProps.className;
  delete resolvedPolicyholderDetailsProps.className;

  var modeState = useState(getBrowserThemeMode);
  var mode = modeState[0];
  var setMode = modeState[1];

  var stepState = useState('first-screen');
  var step = stepState[0];
  var setStep = stepState[1];

  var clientTypeState = useState('individual');
  var clientType = clientTypeState[0];
  var setClientType = clientTypeState[1];

  var restoringFlowState = useState('password');
  var restoringFlow = restoringFlowState[0];
  var setRestoringFlow = restoringFlowState[1];

  var restoringMethodState = useState('email');
  var restoringMethod = restoringMethodState[0];
  var setRestoringMethod = restoringMethodState[1];

  var registrationMethodState = useState('email');
  var registrationMethod = registrationMethodState[0];
  var setRegistrationMethod = registrationMethodState[1];

  var restoringAccessDraftState = useState(null);
  var restoringAccessDraft = restoringAccessDraftState[0];
  var setRestoringAccessDraft = restoringAccessDraftState[1];

  var restoringLoginDraftState = useState(null);
  var restoringLoginDraft = restoringLoginDraftState[0];
  var setRestoringLoginDraft = restoringLoginDraftState[1];

  var registrationDraftState = useState(null);
  var registrationDraft = registrationDraftState[0];
  var setRegistrationDraft = registrationDraftState[1];

  var isInitialLoadingState = useState(true);
  var isInitialLoading = isInitialLoadingState[0];
  var setIsInitialLoading = isInitialLoadingState[1];

  var isCookiesVisibleState = useState(false);
  var isCookiesVisible = isCookiesVisibleState[0];
  var setIsCookiesVisible = isCookiesVisibleState[1];

  var isMobileViewportState = useState(function () {
    return typeof window !== 'undefined' && window.innerWidth <= COOKIES_XS_BREAKPOINT;
  });
  var isMobileViewport = isMobileViewportState[0];
  var setIsMobileViewport = isMobileViewportState[1];

  var isStepLoadingState = useState(false);
  var isStepLoading = isStepLoadingState[0];
  var setIsStepLoading = isStepLoadingState[1];

  var submittedPhoneNumberState = useState('');
  var submittedPhoneNumber = submittedPhoneNumberState[0];
  var setSubmittedPhoneNumber = submittedPhoneNumberState[1];

  var policyholderDetailsDraftState = useState(null);
  var policyholderDetailsDraft = policyholderDetailsDraftState[0];
  var setPolicyholderDetailsDraft = policyholderDetailsDraftState[1];

  var isPhoneLoginLoadingState = useState(false);
  var isPhoneLoginLoading = isPhoneLoginLoadingState[0];
  var setIsPhoneLoginLoading = isPhoneLoginLoadingState[1];

  var isCorporateLoginLoadingState = useState(false);
  var isCorporateLoginLoading = isCorporateLoginLoadingState[0];
  var setIsCorporateLoginLoading = isCorporateLoginLoadingState[1];

  var isCaptchaOpenState = useState(false);
  var isCaptchaOpen = isCaptchaOpenState[0];
  var setIsCaptchaOpen = isCaptchaOpenState[1];

  var captchaValueState = useState('');
  var captchaValue = captchaValueState[0];
  var setCaptchaValue = captchaValueState[1];

  var isCaptchaLoadingState = useState(false);
  var isCaptchaLoading = isCaptchaLoadingState[0];
  var setIsCaptchaLoading = isCaptchaLoadingState[1];

  var isTimeoutOpenState = useState(false);
  var isTimeoutOpen = isTimeoutOpenState[0];
  var setIsTimeoutOpen = isTimeoutOpenState[1];

  var isRestoringAccessLoadingState = useState(false);
  var isRestoringAccessLoading = isRestoringAccessLoadingState[0];
  var setIsRestoringAccessLoading = isRestoringAccessLoadingState[1];

  var isRegistrationLoadingState = useState(false);
  var isRegistrationLoading = isRegistrationLoadingState[0];
  var setIsRegistrationLoading = isRegistrationLoadingState[1];

  var isPolicyholderDetailsLoadingState = useState(false);
  var isPolicyholderDetailsLoading = isPolicyholderDetailsLoadingState[0];
  var setIsPolicyholderDetailsLoading = isPolicyholderDetailsLoadingState[1];

  var isLogInThroughTheGosuslugiLoadingState = useState(false);
  var isLogInThroughTheGosuslugiLoading = isLogInThroughTheGosuslugiLoadingState[0];
  var setIsLogInThroughTheGosuslugiLoading = isLogInThroughTheGosuslugiLoadingState[1];

  var isCreatingLoginPasswordLoadingState = useState(false);
  var isCreatingLoginPasswordLoading = isCreatingLoginPasswordLoadingState[0];
  var setIsCreatingLoginPasswordLoading = isCreatingLoginPasswordLoadingState[1];

  var isFinalLoadingState = useState(false);
  var isFinalLoading = isFinalLoadingState[0];
  var setIsFinalLoading = isFinalLoadingState[1];

  var credentialCreationModeState = useState('password');
  var credentialCreationMode = credentialCreationModeState[0];
  var setCredentialCreationMode = credentialCreationModeState[1];

  var successfulToastKeyState = useState(0);
  var successfulToastKey = successfulToastKeyState[0];
  var setSuccessfulToastKey = successfulToastKeyState[1];

  var userWasNotFoundToastKeyState = useState(0);
  var userWasNotFoundToastKey = userWasNotFoundToastKeyState[0];
  var setUserWasNotFoundToastKey = userWasNotFoundToastKeyState[1];

  var phoneLoginTimerRef = useRef(null);
  var captchaTimerRef = useRef(null);
  var corporateLoginTimerRef = useRef(null);
  var restoringAccessTimerRef = useRef(null);
  var registrationTimerRef = useRef(null);
  var policyholderDetailsTimerRef = useRef(null);
  var logInThroughTheGosuslugiTimerRef = useRef(null);
  var creatingLoginPasswordTimerRef = useRef(null);
  var codeCheckTimerRef = useRef(null);
  var stepLoadingTimerRef = useRef(null);
  var stepLoadingActionRef = useRef(null);

  var isLoadingScreen = isInitialLoading || isFinalLoading || isStepLoading;
  var device = 'auto';
  var sharedThemeProps = {
    applyToDocument: false,
    mode: mode,
    onModeChange: setMode
  };

  useEffect(function () {
    var timeoutId = window.setTimeout(function () {
      setIsInitialLoading(false);
      setIsCookiesVisible(true);
    }, INITIAL_LOADING_DURATION_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(function () {
    function handleResize() {
      setIsMobileViewport(window.innerWidth <= COOKIES_XS_BREAKPOINT);
    }

    window.addEventListener('resize', handleResize);

    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(function () {
    if (!isFinalLoading) {
      return undefined;
    }

    var timeoutId = window.setTimeout(function () {
      setIsFinalLoading(false);
      setStep('first-screen');
      setClientType('individual');
    }, FINAL_LOADING_DURATION_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, [isFinalLoading]);

  useEffect(function () {
    return function () {
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

  function startStepLoading(onComplete) {
    clearStepLoading();
    stepLoadingActionRef.current = onComplete;
    setIsStepLoading(true);

    stepLoadingTimerRef.current = window.setTimeout(function () {
      var action = stepLoadingActionRef.current;

      stepLoadingTimerRef.current = null;
      stepLoadingActionRef.current = null;
      setIsStepLoading(false);

      if (action) {
        action();
      }
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

  function normalizePhoneNumber(value) {
    var digits = value.replace(/\D/g, '');

    return digits.length === 10 ? '7' + digits : digits;
  }

  function formatPhoneNumber(value) {
    var digits = normalizePhoneNumber(value);
    var localDigits = digits.length === 11 && digits[0] === '7' ? digits.slice(1) : digits;

    if (localDigits.length !== 10) {
      return value;
    }

    return '+7 (' + localDigits.slice(0, 3) + ') ' + localDigits.slice(3, 6) + '-' + localDigits.slice(6, 8) + '-' + localDigits.slice(8, 10);
  }

  function handleIndividualSubmit(payload) {
    if (resolvedAuthenticationProps.onIndividualSubmit) {
      resolvedAuthenticationProps.onIndividualSubmit(payload);
    }

    var normalizedPhoneNumber = normalizePhoneNumber(payload.phone);
    setSubmittedPhoneNumber(normalizedPhoneNumber);

    if (normalizedPhoneNumber === CAPTCHA_PHONE_NUMBER) {
      setCaptchaValue('');
      setIsPhoneLoginLoading(true);

      if (phoneLoginTimerRef.current !== null) {
        window.clearTimeout(phoneLoginTimerRef.current);
      }

      phoneLoginTimerRef.current = window.setTimeout(function () {
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

    phoneLoginTimerRef.current = window.setTimeout(function () {
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

    captchaTimerRef.current = window.setTimeout(function () {
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

  function handleCorporateSubmit(payload) {
    if (resolvedAuthenticationProps.onCorporateSubmit) {
      resolvedAuthenticationProps.onCorporateSubmit(payload);
    }

    setIsCorporateLoginLoading(true);

    if (corporateLoginTimerRef.current !== null) {
      window.clearTimeout(corporateLoginTimerRef.current);
    }

    corporateLoginTimerRef.current = window.setTimeout(function () {
      corporateLoginTimerRef.current = null;
      setIsCorporateLoginLoading(false);

      if (
        payload.login.trim() === CORPORATE_SUCCESS_LOGIN &&
        payload.password.trim() === CORPORATE_SUCCESS_PASSWORD
      ) {
        setSuccessfulToastKey(function (currentKey) { return currentKey + 1; });
        setIsFinalLoading(true);
        return;
      }

      setUserWasNotFoundToastKey(function (currentKey) { return currentKey + 1; });
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

  function handleRegistrationSubmit(payload) {
    if (resolvedRegistrationProps.onSubmit) {
      resolvedRegistrationProps.onSubmit(payload);
    }

    setRegistrationDraft(payload);
    setRegistrationMethod(payload.method);
    setIsRegistrationLoading(true);

    if (registrationTimerRef.current !== null) {
      window.clearTimeout(registrationTimerRef.current);
    }

    registrationTimerRef.current = window.setTimeout(function () {
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

    codeCheckTimerRef.current = window.setTimeout(function () {
      codeCheckTimerRef.current = null;

      if (REGISTRATION_SKIPPED_PHONE_NUMBERS.has(submittedPhoneNumber)) {
        setSuccessfulToastKey(function (currentKey) { return currentKey + 1; });
        setIsFinalLoading(true);
        return;
      }

      setStep('policyholder-details');
    }, CODE_CHECK_LOADING_DURATION_MS);
  }

  function handleRestoringAccessSubmit(payload) {
    if (resolvedRestoringAccessProps.onPasswordSubmit) {
      resolvedRestoringAccessProps.onPasswordSubmit(payload);
    }

    setRestoringAccessDraft(payload);
    setIsRestoringAccessLoading(true);

    if (restoringAccessTimerRef.current !== null) {
      window.clearTimeout(restoringAccessTimerRef.current);
    }

    restoringAccessTimerRef.current = window.setTimeout(function () {
      restoringAccessTimerRef.current = null;
      setIsRestoringAccessLoading(false);

      var normalizedValue = payload.login.trim().toLowerCase();
      var phoneDigits = normalizedValue.replace(/\D/g, '');
      var isPhoneValue =
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

  function handleRestoringLoginSubmit(payload) {
    if (resolvedRestoringAccessProps.onRestoringLoginSubmit) {
      resolvedRestoringAccessProps.onRestoringLoginSubmit(payload);
    }

    setRestoringLoginDraft(payload);
    setIsRestoringAccessLoading(true);

    if (restoringAccessTimerRef.current !== null) {
      window.clearTimeout(restoringAccessTimerRef.current);
    }

    restoringAccessTimerRef.current = window.setTimeout(function () {
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

    codeCheckTimerRef.current = window.setTimeout(function () {
      codeCheckTimerRef.current = null;
      setCredentialCreationMode('password');
      openCreatingLoginPasswordStep();
    }, CODE_CHECK_LOADING_DURATION_MS);
  }

  function handleRestoringLoginCodeComplete() {
    if (codeCheckTimerRef.current !== null) {
      window.clearTimeout(codeCheckTimerRef.current);
    }

    codeCheckTimerRef.current = window.setTimeout(function () {
      codeCheckTimerRef.current = null;
      setCredentialCreationMode('login');
      openCreatingLoginPasswordStep();
    }, CODE_CHECK_LOADING_DURATION_MS);
  }

  function handleRegistrationCodeComplete() {
    if (codeCheckTimerRef.current !== null) {
      window.clearTimeout(codeCheckTimerRef.current);
    }

    codeCheckTimerRef.current = window.setTimeout(function () {
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

    creatingLoginPasswordTimerRef.current = window.setTimeout(function () {
      creatingLoginPasswordTimerRef.current = null;
      setIsCreatingLoginPasswordLoading(false);
      setSuccessfulToastKey(function (currentKey) { return currentKey + 1; });
      setIsFinalLoading(true);
      setRestoringLoginDraft(null);
      setCredentialCreationMode('password');
    }, CREATING_LOGIN_PASSWORD_LOADING_DURATION_MS);
  }

  function formatHiddenPhoneNumber() {
    return '+7 (***) ***-99-99';
  }

  function formatHiddenEmail(value) {
    var trimmedValue = value.trim().toLowerCase();
    var parts = trimmedValue.split('@');
    var localPart = parts[0] || '';
    var domainPart = parts[1] || '';

    if (!localPart || !domainPart) {
      return 's******i@r*****s.ru';
    }

    var maskedLocalPart =
      localPart.length <= 2
        ? (localPart[0] || '*') + '*'
        : localPart[0] + new Array(Math.max(localPart.length - 2, 1) + 1).join('*') + localPart[localPart.length - 1];
    var maskedDomain =
      domainPart.length <= 2
        ? (domainPart[0] || '*') + '*'
        : domainPart[0] + new Array(Math.max(domainPart.length - 2, 1) + 1).join('*') + domainPart[domainPart.length - 1];

    return maskedLocalPart + '@' + maskedDomain;
  }

  function handlePolicyholderDetailsSubmit() {
    setIsPolicyholderDetailsLoading(true);

    if (policyholderDetailsTimerRef.current !== null) {
      window.clearTimeout(policyholderDetailsTimerRef.current);
    }

    policyholderDetailsTimerRef.current = window.setTimeout(function () {
      policyholderDetailsTimerRef.current = null;
      setIsPolicyholderDetailsLoading(false);
      setSuccessfulToastKey(function (currentKey) { return currentKey + 1; });
      setIsFinalLoading(true);
    }, POLICYHOLDER_DETAILS_LOADING_DURATION_MS);
  }

  function handlePolicyholderDetailsFlow(payload) {
    setPolicyholderDetailsDraft(payload);

    if (
      payload.email.trim().toLowerCase() === LOG_IN_THROUGH_THE_GOSUSLUGI_EMAIL
    ) {
      setIsLogInThroughTheGosuslugiLoading(true);

      if (logInThroughTheGosuslugiTimerRef.current !== null) {
        window.clearTimeout(logInThroughTheGosuslugiTimerRef.current);
      }

      logInThroughTheGosuslugiTimerRef.current = window.setTimeout(function () {
        logInThroughTheGosuslugiTimerRef.current = null;
        setIsLogInThroughTheGosuslugiLoading(false);
        setStep('log-in-through-the-gosuslugi');
      }, LOG_IN_THROUGH_THE_GOSUSLUGI_LOADING_DURATION_MS);
      return;
    }

    handlePolicyholderDetailsSubmit();
  }

  function getHomeBrandButtonProps(brandButtonProps) {
    return Object.assign({}, brandButtonProps, {
      onClick: function (event) {
        if (brandButtonProps && brandButtonProps.onClick) {
          brandButtonProps.onClick(event);
        }

        if (!event.defaultPrevented) {
          handleLogoClick();
        }
      }
    });
  }

  function renderStep() {
    var codeInputProps = {
      completionBehavior: 'reset',
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
          defaultBirthDate={policyholderDetailsDraft ? policyholderDetailsDraft.birthDate : undefined}
          defaultConsentAccepted={
            policyholderDetailsDraft
              ? policyholderDetailsDraft.consentAccepted
              : resolvedPolicyholderDetailsProps.defaultConsentAccepted
          }
          defaultEmail={
            policyholderDetailsDraft
              ? policyholderDetailsDraft.email
              : resolvedPolicyholderDetailsProps.defaultEmail
          }
          defaultGender={
            policyholderDetailsDraft
              ? policyholderDetailsDraft.gender
              : resolvedPolicyholderDetailsProps.defaultGender
          }
          defaultMiddleName={
            policyholderDetailsDraft
              ? policyholderDetailsDraft.middleName
              : resolvedPolicyholderDetailsProps.defaultMiddleName
          }
          defaultName={
            policyholderDetailsDraft
              ? policyholderDetailsDraft.name
              : resolvedPolicyholderDetailsProps.defaultName
          }
          defaultSurname={
            policyholderDetailsDraft
              ? policyholderDetailsDraft.surname
              : resolvedPolicyholderDetailsProps.defaultSurname
          }
          defaultWithoutMiddleName={
            policyholderDetailsDraft
              ? policyholderDetailsDraft.withoutMiddleName
              : resolvedPolicyholderDetailsProps.defaultWithoutMiddleName
          }
          device={device}
          onSubmit={function (payload) {
            if (resolvedPolicyholderDetailsProps.onSubmit) {
              resolvedPolicyholderDetailsProps.onSubmit(payload);
            }
            handlePolicyholderDetailsFlow(payload);
          }}
          saveButtonProps={Object.assign(
            {},
            resolvedPolicyholderDetailsProps.saveButtonProps,
            {
              loading:
                isLogInThroughTheGosuslugiLoading ||
                isPolicyholderDetailsLoading ||
                (resolvedPolicyholderDetailsProps.saveButtonProps && resolvedPolicyholderDetailsProps.saveButtonProps.loading)
            }
          )}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'log-in-through-the-gosuslugi') {
      return (
        <React.Fragment>
          <AuthenticationRegistrationData
            {...resolvedPolicyholderDetailsProps}
            brandButtonProps={getHomeBrandButtonProps(
              resolvedPolicyholderDetailsProps.brandButtonProps
            )}
            className={joinClassNames(
              'rshb-authentication-prototype__template',
              policyholderDetailsClassName
            )}
            defaultBirthDate={policyholderDetailsDraft ? policyholderDetailsDraft.birthDate : undefined}
            defaultConsentAccepted={
              policyholderDetailsDraft
                ? policyholderDetailsDraft.consentAccepted
                : resolvedPolicyholderDetailsProps.defaultConsentAccepted
            }
            defaultEmail={
              policyholderDetailsDraft
                ? policyholderDetailsDraft.email
                : resolvedPolicyholderDetailsProps.defaultEmail
            }
            defaultGender={
              policyholderDetailsDraft
                ? policyholderDetailsDraft.gender
                : resolvedPolicyholderDetailsProps.defaultGender
            }
            defaultMiddleName={
              policyholderDetailsDraft
                ? policyholderDetailsDraft.middleName
                : resolvedPolicyholderDetailsProps.defaultMiddleName
            }
            defaultName={
              policyholderDetailsDraft
                ? policyholderDetailsDraft.name
                : resolvedPolicyholderDetailsProps.defaultName
            }
            defaultSurname={
              policyholderDetailsDraft
                ? policyholderDetailsDraft.surname
                : resolvedPolicyholderDetailsProps.defaultSurname
            }
            defaultWithoutMiddleName={
              policyholderDetailsDraft
                ? policyholderDetailsDraft.withoutMiddleName
                : resolvedPolicyholderDetailsProps.defaultWithoutMiddleName
            }
            device={device}
            onSubmit={function (payload) {
              if (resolvedPolicyholderDetailsProps.onSubmit) {
                resolvedPolicyholderDetailsProps.onSubmit(payload);
              }
              handlePolicyholderDetailsFlow(payload);
            }}
            saveButtonProps={Object.assign(
              {},
              resolvedPolicyholderDetailsProps.saveButtonProps,
              {
                loading:
                  isLogInThroughTheGosuslugiLoading ||
                  (resolvedPolicyholderDetailsProps.saveButtonProps && resolvedPolicyholderDetailsProps.saveButtonProps.loading)
              }
            )}
            themeProps={sharedThemeProps}
          />
          <LogInThroughTheGosuslugi
            onClose={function () { setStep('policyholder-details'); }}
            placement="top-center"
          />
        </React.Fragment>
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
          codeInputProps={Object.assign(
            {},
            resolvedEmailCodeProps.codeInputProps,
            codeInputProps,
            {
              onComplete: function (code) {
                if (resolvedEmailCodeProps.codeInputProps && resolvedEmailCodeProps.codeInputProps.onComplete) {
                  resolvedEmailCodeProps.codeInputProps.onComplete(code);
                }
                handleCodeComplete();
              }
            }
          )}
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
          codeInputProps={Object.assign(
            {},
            resolvedEmailCodeProps.codeInputProps,
            {
              completionBehavior: 'reset',
              loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
              onComplete: function (code) {
                if (resolvedEmailCodeProps.codeInputProps && resolvedEmailCodeProps.codeInputProps.onComplete) {
                  resolvedEmailCodeProps.codeInputProps.onComplete(code);
                }
                handleRegistrationCodeComplete();
              }
            }
          )}
          device={device}
          email={registrationDraft ? registrationDraft.value : ''}
          emailMode="visible"
          onChangeEmail={function () { setStep('registration-inn'); }}
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
          codeInputProps={Object.assign(
            {},
            resolvedEmailCodeProps.codeInputProps,
            {
              completionBehavior: 'reset',
              loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
              onComplete: function (code) {
                if (resolvedEmailCodeProps.codeInputProps && resolvedEmailCodeProps.codeInputProps.onComplete) {
                  resolvedEmailCodeProps.codeInputProps.onComplete(code);
                }
                handleRestoringCodeComplete();
              }
            }
          )}
          device={device}
          email={restoringAccessDraft ? restoringAccessDraft.login : ''}
          emailMode="hidden"
          hiddenEmail={formatHiddenEmail(restoringAccessDraft ? restoringAccessDraft.login : '')}
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
          codeInputProps={Object.assign(
            {},
            resolvedEmailCodeProps.codeInputProps,
            {
              completionBehavior: 'reset',
              loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
              onComplete: function (code) {
                if (resolvedEmailCodeProps.codeInputProps && resolvedEmailCodeProps.codeInputProps.onComplete) {
                  resolvedEmailCodeProps.codeInputProps.onComplete(code);
                }
                handleRestoringLoginCodeComplete();
              }
            }
          )}
          device={device}
          email={restoringLoginDraft ? restoringLoginDraft.value : ''}
          emailMode="visible"
          onChangeEmail={function () { setStep('restoring-access'); }}
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
          codeInputProps={Object.assign(
            {},
            resolvedTextMessageCodeProps.codeInputProps,
            {
              completionBehavior: 'reset',
              loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
              onComplete: function (code) {
                if (resolvedTextMessageCodeProps.codeInputProps && resolvedTextMessageCodeProps.codeInputProps.onComplete) {
                  resolvedTextMessageCodeProps.codeInputProps.onComplete(code);
                }
                handleRestoringCodeComplete();
              }
            }
          )}
          device={device}
          hiddenPhoneNumber={formatHiddenPhoneNumber(restoringAccessDraft ? restoringAccessDraft.login : '')}
          phoneMode="hidden"
          phoneNumber={formatPhoneNumber(restoringAccessDraft ? restoringAccessDraft.login : '')}
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
          codeInputProps={Object.assign(
            {},
            resolvedTextMessageCodeProps.codeInputProps,
            {
              completionBehavior: 'reset',
              loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
              onComplete: function (code) {
                if (resolvedTextMessageCodeProps.codeInputProps && resolvedTextMessageCodeProps.codeInputProps.onComplete) {
                  resolvedTextMessageCodeProps.codeInputProps.onComplete(code);
                }
                handleRestoringLoginCodeComplete();
              }
            }
          )}
          device={device}
          onChangePhone={function () { setStep('restoring-access'); }}
          phoneNumber={formatPhoneNumber(restoringLoginDraft ? restoringLoginDraft.value : '')}
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
          defaultLogin={resolvedCreatingLoginPasswordProps.defaultLogin || ''}
          device={device}
          mode={credentialCreationMode}
          onSubmit={function (payload) {
            if (resolvedCreatingLoginPasswordProps.onSubmit) {
              resolvedCreatingLoginPasswordProps.onSubmit(payload);
            }
            handleCreatingLoginPasswordSubmit();
          }}
          saveButtonProps={Object.assign(
            {},
            resolvedCreatingLoginPasswordProps.saveButtonProps,
            {
              loading:
                isCreatingLoginPasswordLoading ||
                (resolvedCreatingLoginPasswordProps.saveButtonProps && resolvedCreatingLoginPasswordProps.saveButtonProps.loading)
            }
          )}
          themeProps={sharedThemeProps}
        />
      );
    }

    if (step === 'proof-of-identity') {
      return (
        <React.Fragment>
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
            loginButtonProps={Object.assign(
              {},
              resolvedAuthenticationProps.loginButtonProps,
              { loading: false }
            )}
            onClientTypeChange={setClientType}
            onForgotCredentials={function () {
              if (onForgotCredentials) { onForgotCredentials(); }
              setStep('restoring-access');
            }}
            onIndividualSubmit={handleIndividualSubmit}
            onRegister={function () {
              if (onRegister) { onRegister(); }
              setStep('registration-inn');
            }}
            themeProps={Object.assign(
              {},
              authenticationThemeProps,
              sharedThemeProps
            )}
          />
          <ProofOfIdentity
            onClose={handleBackToFirstScreen}
            onContinue={openTextMessageCodeStep}
            placement="top-center"
          />
        </React.Fragment>
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
          codeInputProps={Object.assign(
            {},
            resolvedTextMessageCodeProps.codeInputProps,
            codeInputProps,
            {
              onComplete: function (code) {
                if (resolvedTextMessageCodeProps.codeInputProps && resolvedTextMessageCodeProps.codeInputProps.onComplete) {
                  resolvedTextMessageCodeProps.codeInputProps.onComplete(code);
                }
                handleCodeComplete();
              }
            }
          )}
          device={device}
          onChangePhone={handleBackToFirstScreen}
          onRequestEmailCode={openHiddenEmailCodeStep}
          phoneNumber={formatPhoneNumber(submittedPhoneNumber)}
          showEmailButton={REGISTRATION_SKIPPED_PHONE_NUMBERS.has(submittedPhoneNumber)}
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
          codeInputProps={Object.assign(
            {},
            resolvedTextMessageCodeProps.codeInputProps,
            {
              completionBehavior: 'reset',
              loadingDuration: CODE_CHECK_LOADING_DURATION_MS,
              onComplete: function (code) {
                if (resolvedTextMessageCodeProps.codeInputProps && resolvedTextMessageCodeProps.codeInputProps.onComplete) {
                  resolvedTextMessageCodeProps.codeInputProps.onComplete(code);
                }
                handleRegistrationCodeComplete();
              }
            }
          )}
          device={device}
          onChangePhone={function () { setStep('registration-inn'); }}
          phoneNumber={formatPhoneNumber(registrationDraft ? registrationDraft.value : '')}
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
            restoringAccessDraft
              ? restoringAccessDraft.login
              : resolvedRestoringAccessProps.defaultLogin
          }
          device={device}
          loginMethod={restoringMethod}
          onBack={handleBackToFirstScreen}
          onLoginMethodChange={setRestoringMethod}
          onRestoringLoginSubmit={handleRestoringLoginSubmit}
          onPasswordSubmit={handleRestoringAccessSubmit}
          onRestoringFlowChange={setRestoringFlow}
          restoringFlow={restoringFlow}
          submitButtonProps={Object.assign(
            {},
            resolvedRestoringAccessProps.submitButtonProps,
            {
              loading:
                isRestoringAccessLoading ||
                (resolvedRestoringAccessProps.submitButtonProps && resolvedRestoringAccessProps.submitButtonProps.loading)
            }
          )}
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
          registerButtonProps={Object.assign(
            {},
            resolvedRegistrationProps.registerButtonProps,
            {
              loading:
                isRegistrationLoading ||
                (resolvedRegistrationProps.registerButtonProps && resolvedRegistrationProps.registerButtonProps.loading)
            }
          )}
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
        onForgotCredentials={function () {
          if (onForgotCredentials) { onForgotCredentials(); }
          setStep('restoring-access');
        }}
        onCorporateSubmit={handleCorporateSubmit}
        onIndividualSubmit={handleIndividualSubmit}
        onRegister={function () {
          if (onRegister) { onRegister(); }
          setStep('registration-inn');
        }}
        loginButtonProps={Object.assign(
          {},
          resolvedAuthenticationProps.loginButtonProps,
          {
            loading:
              isPhoneLoginLoading ||
              isCorporateLoginLoading ||
              (resolvedAuthenticationProps.loginButtonProps && resolvedAuthenticationProps.loginButtonProps.loading)
          }
        )}
        themeProps={Object.assign(
          {},
          authenticationThemeProps,
          sharedThemeProps
        )}
      />
    );
  }

  return (
    <div
      className={joinClassNames(
        'rshb-authentication-prototype',
        isLoadingScreen && 'rshb-authentication-prototype--loading',
        'theme-' + mode,
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
          onClose={function () { setIsTimeoutOpen(false); }}
          placement="top-center"
        />
      ) : null}
      {successfulToastKey > 0 ? (
        <SuccessfulAuthentication
          key={successfulToastKey}
          onClose={function () { setSuccessfulToastKey(0); }}
          placement="top-center"
        />
      ) : null}
      {userWasNotFoundToastKey > 0 ? (
        <TheUserWasNotFound
          key={userWasNotFoundToastKey}
          onClose={function () { setUserWasNotFoundToastKey(0); }}
          placement="top-center"
        />
      ) : null}
      {isCookiesVisible ? (
        <FilledCookies
          onClose={function () { setIsCookiesVisible(false); }}
          placement="bottom-center"
          size={isMobileViewport ? 'xs' : 's'}
        />
      ) : null}
    </div>
  );
}
