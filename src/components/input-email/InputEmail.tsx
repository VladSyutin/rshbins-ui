import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode
} from 'react';
import { InputText, type InputTextProps } from '../input-text/InputText';
import './InputEmail.scss';

const EMAIL_MAX_LENGTH = 254;
const EMAIL_LOCAL_MAX_LENGTH = 64;
const EMAIL_REQUIRED_ERROR = 'Обязательно для заполнения';
const EMAIL_AT_SIGN_ERROR = 'Адрес электронной почты должен содержать знак “@”';
const EMAIL_DOMAIN_ERROR =
  'Адрес электронной почты должен содержать доменную часть (например, example.ru)';
const EMAIL_DOMAIN_DOT_ERROR =
  'Адрес электронной почты должен содержать “.” (например, example.ru)';
const EMAIL_ALLOWED_CHARACTER_PATTERN = /^[a-z0-9._+@-]$/;
const EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN = /^[._-]$/;

export interface InputEmailProps
  extends Omit<InputTextProps, 'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'> {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function sanitizeEmailValue(value: string): string {
  let sanitizedValue = '';
  let hasAtSign = false;
  let localLength = 0;

  for (const rawCharacter of value.toLowerCase()) {
    if (sanitizedValue.length >= EMAIL_MAX_LENGTH) {
      break;
    }

    if (!EMAIL_ALLOWED_CHARACTER_PATTERN.test(rawCharacter)) {
      continue;
    }

    if (rawCharacter === '@') {
      if (
        hasAtSign ||
        localLength === 0 ||
        EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN.test(sanitizedValue.at(-1) ?? '')
      ) {
        continue;
      }

      hasAtSign = true;
      sanitizedValue += rawCharacter;
      continue;
    }

    if (rawCharacter === '.' && sanitizedValue.at(-1) === '.') {
      continue;
    }

    if (!hasAtSign) {
      if (localLength >= EMAIL_LOCAL_MAX_LENGTH) {
        continue;
      }

      if (localLength === 0 && EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN.test(rawCharacter)) {
        continue;
      }

      localLength += 1;
    }

    sanitizedValue += rawCharacter;
  }

  return sanitizedValue;
}

function validateEmail(value: string): string | undefined {
  if (value.length === 0) {
    return EMAIL_REQUIRED_ERROR;
  }

  if (!value.includes('@')) {
    return EMAIL_AT_SIGN_ERROR;
  }

  const [, domain = ''] = value.split('@');

  if (domain.length < 3) {
    return EMAIL_DOMAIN_ERROR;
  }

  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return EMAIL_DOMAIN_DOT_ERROR;
  }

  return undefined;
}

export function isEmailValueValid(value: string): boolean {
  return validateEmail(sanitizeEmailValue(value)) === undefined;
}

/**
 * Email input with latin-only entry, one `@`, lowercase normalization and blur validation.
 */
export function InputEmail({
  className,
  defaultValue,
  helperText,
  invalid = false,
  label = 'Электронная почта',
  onBlur,
  onChange,
  onValueChange,
  value,
  ...props
}: InputEmailProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    sanitizeEmailValue(String(defaultValue ?? ''))
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled ? sanitizeEmailValue(String(value ?? '')) : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateEmail(resolvedValue) : undefined;

  useEffect(() => {
    if (!isControlled || value === undefined || resolvedValue === value) {
      return;
    }

    onValueChange?.(resolvedValue);
  }, [isControlled, onValueChange, resolvedValue, value]);

  function updateValue(nextValue: string) {
    const sanitizedValue = sanitizeEmailValue(nextValue);

    if (!isControlled) {
      setUncontrolledValue(sanitizedValue);
    }

    onValueChange?.(sanitizedValue);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setHasBeenValidated(true);
    onBlur?.(event);
  }

  return (
    <InputText
      {...props}
      autoCapitalize={props.autoCapitalize ?? 'none'}
      autoCorrect={props.autoCorrect ?? 'off'}
      className={joinClassNames('rshb-input-email', className)}
      helperText={validationMessage ?? helperText}
      inputMode="email"
      invalid={invalid || validationMessage !== undefined}
      label={label}
      maxLength={EMAIL_MAX_LENGTH}
      onBlur={handleBlur}
      onChange={handleChange}
      onValueChange={updateValue}
      spellCheck={props.spellCheck ?? false}
      type="text"
      value={resolvedValue}
    />
  );
}
