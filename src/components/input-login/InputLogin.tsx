import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode
} from 'react';
import { InputText, type InputTextProps } from '../input-text/InputText';
import { cyrillicToLatin } from '../transliterate';
import './InputLogin.scss';

const LOGIN_REQUIRED_ERROR = 'Обязательно для заполнения';
const LOGIN_ALLOWED_CHARACTER_PATTERN = /^[A-Za-z0-9._-]$/;
const LOGIN_SEPARATOR_PATTERN = /^[._-]$/;

export interface InputLoginProps
  extends Omit<InputTextProps, 'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'> {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function sanitizeLoginValue(value: string): string {
  let sanitizedValue = '';

  for (const rawCharacter of value) {
    const character = LOGIN_ALLOWED_CHARACTER_PATTERN.test(rawCharacter)
      ? rawCharacter
      : cyrillicToLatin(rawCharacter);

    if (!LOGIN_ALLOWED_CHARACTER_PATTERN.test(character)) {
      continue;
    }

    const previousCharacter = sanitizedValue.at(-1);

    if (
      previousCharacter !== undefined &&
      LOGIN_SEPARATOR_PATTERN.test(previousCharacter) &&
      LOGIN_SEPARATOR_PATTERN.test(character)
    ) {
      continue;
    }

    sanitizedValue += character;
  }

  return sanitizedValue;
}

function validateLogin(value: string): string | undefined {
  return value.length === 0 ? LOGIN_REQUIRED_ERROR : undefined;
}

/**
 * Login input that accepts latin letters, digits and `.`, `-`, `_` separators.
 */
export function InputLogin({
  className,
  defaultValue,
  helperText,
  invalid = false,
  label = 'Логин',
  onBlur,
  onChange,
  onValueChange,
  value,
  ...props
}: InputLoginProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    sanitizeLoginValue(String(defaultValue ?? ''))
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled ? sanitizeLoginValue(String(value ?? '')) : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateLogin(resolvedValue) : undefined;

  useEffect(() => {
    if (!isControlled || value === undefined || resolvedValue === value) {
      return;
    }

    onValueChange?.(resolvedValue);
  }, [isControlled, onValueChange, resolvedValue, value]);

  function updateValue(nextValue: string) {
    const sanitizedValue = sanitizeLoginValue(nextValue);

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
      className={joinClassNames('rshb-input-login', className)}
      helperText={validationMessage ?? helperText}
      inputMode="email"
      invalid={invalid || validationMessage !== undefined}
      label={label}
      onBlur={handleBlur}
      onChange={handleChange}
      onValueChange={updateValue}
      spellCheck={props.spellCheck ?? false}
      type="text"
      value={resolvedValue}
    />
  );
}
