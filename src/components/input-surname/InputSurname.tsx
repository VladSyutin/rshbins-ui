import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode
} from 'react';
import { InputText, type InputTextProps } from '../input-text/InputText';
import { latinToCyrillic } from '../transliterate';
import './InputSurname.scss';

const SURNAME_REQUIRED_ERROR = 'Обязательно для заполнения';
const SURNAME_BRACKETS_ERROR = 'Скобки должны быть парными.';
const SURNAME_ALLOWED_CHARACTER_PATTERN = /^[А-Яа-яЁё.\-’,() ]$/;
const SURNAME_LETTER_PATTERN = /^[А-Яа-яЁё]$/;
const SURNAME_SEPARATOR_PATTERN = /^[.\-’,() ]$/;
const SURNAME_TRAILING_FORBIDDEN_PATTERN = /^[.\-’, ]$/;

export interface InputSurnameProps
  extends Omit<InputTextProps, 'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'> {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function formatFirstLetter(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return `${value[0].toLocaleUpperCase('ru-RU')}${value.slice(1)}`;
}

function sanitizeSurnameValue(value: string): string {
  let sanitizedValue = '';

  for (const rawCharacter of value) {
    const character = SURNAME_ALLOWED_CHARACTER_PATTERN.test(rawCharacter)
      ? rawCharacter
      : latinToCyrillic(rawCharacter);

    if (!SURNAME_ALLOWED_CHARACTER_PATTERN.test(character)) {
      continue;
    }

    const previousCharacter = sanitizedValue.at(-1);

    if (sanitizedValue.length === 0 && !SURNAME_LETTER_PATTERN.test(character)) {
      continue;
    }

    if (
      previousCharacter !== undefined &&
      SURNAME_SEPARATOR_PATTERN.test(previousCharacter) &&
      SURNAME_SEPARATOR_PATTERN.test(character)
    ) {
      continue;
    }

    sanitizedValue += character;
  }

  return formatFirstLetter(sanitizedValue);
}

function normalizeSurnameOnBlur(value: string): string {
  let normalizedValue = sanitizeSurnameValue(value);

  while (
    normalizedValue.length > 0 &&
    SURNAME_TRAILING_FORBIDDEN_PATTERN.test(normalizedValue.at(-1) ?? '')
  ) {
    normalizedValue = normalizedValue.slice(0, -1);
  }

  return normalizedValue;
}

function hasPairedBrackets(value: string): boolean {
  let depth = 0;

  for (const character of value) {
    if (character === '(') {
      depth += 1;
    }

    if (character === ')') {
      depth -= 1;
    }

    if (depth < 0) {
      return false;
    }
  }

  return depth === 0;
}

function validateSurname(value: string): string | undefined {
  if (value.length === 0) {
    return SURNAME_REQUIRED_ERROR;
  }

  if (!hasPairedBrackets(value)) {
    return SURNAME_BRACKETS_ERROR;
  }

  return undefined;
}

export function isSurnameValueValid(value: string): boolean {
  return validateSurname(normalizeSurnameOnBlur(value)) === undefined;
}

/**
 * Surname input with Cyrillic-only entry, separator filtering and bracket validation on blur.
 */
export function InputSurname({
  className,
  defaultValue,
  helperText,
  invalid = false,
  label = 'Фамилия',
  onBlur,
  onChange,
  onValueChange,
  value,
  ...props
}: InputSurnameProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    sanitizeSurnameValue(String(defaultValue ?? ''))
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled ? sanitizeSurnameValue(String(value ?? '')) : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateSurname(resolvedValue) : undefined;

  useEffect(() => {
    if (!isControlled || value === undefined || resolvedValue === value) {
      return;
    }

    onValueChange?.(resolvedValue);
  }, [isControlled, onValueChange, resolvedValue, value]);

  function updateValue(nextValue: string) {
    const sanitizedValue = sanitizeSurnameValue(nextValue);

    if (!isControlled) {
      setUncontrolledValue(sanitizedValue);
    }

    onValueChange?.(sanitizedValue);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const normalizedValue = normalizeSurnameOnBlur(resolvedValue);

    if (normalizedValue !== resolvedValue) {
      if (!isControlled) {
        setUncontrolledValue(normalizedValue);
      }

      onValueChange?.(normalizedValue);
    }

    setHasBeenValidated(true);
    onBlur?.(event);
  }

  return (
    <InputText
      {...props}
      className={joinClassNames('rshb-input-surname', className)}
      helperText={validationMessage ?? helperText}
      inputMode="text"
      invalid={invalid || validationMessage !== undefined}
      label={label}
      onBlur={handleBlur}
      onChange={handleChange}
      onValueChange={updateValue}
      type="text"
      value={resolvedValue}
    />
  );
}
