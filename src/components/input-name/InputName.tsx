import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode
} from 'react';
import { InputText, type InputTextProps } from '../input-text/InputText';
import './InputName.scss';

const NAME_REQUIRED_ERROR = 'Обязательно для заполнения';
const NAME_BRACKETS_ERROR = 'Скобки должны быть парными.';
const NAME_ALLOWED_CHARACTER_PATTERN = /^[А-Яа-яЁё.\-’,()]$/;
const NAME_LETTER_PATTERN = /^[А-Яа-яЁё]$/;
const NAME_SEPARATOR_PATTERN = /^[.\-’,() ]$/;
const NAME_TRAILING_FORBIDDEN_PATTERN = /^[.\-’, ]$/;

export interface InputNameProps
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

function sanitizeNameValue(value: string): string {
  let sanitizedValue = '';

  for (const character of value) {
    if (!NAME_ALLOWED_CHARACTER_PATTERN.test(character)) {
      continue;
    }

    const previousCharacter = sanitizedValue.at(-1);

    if (sanitizedValue.length === 0 && !NAME_LETTER_PATTERN.test(character)) {
      continue;
    }

    if (
      previousCharacter !== undefined &&
      NAME_SEPARATOR_PATTERN.test(previousCharacter) &&
      NAME_SEPARATOR_PATTERN.test(character)
    ) {
      continue;
    }

    sanitizedValue += character;
  }

  return formatFirstLetter(sanitizedValue);
}

function normalizeNameOnBlur(value: string): string {
  let normalizedValue = sanitizeNameValue(value);

  while (
    normalizedValue.length > 0 &&
    NAME_TRAILING_FORBIDDEN_PATTERN.test(normalizedValue.at(-1) ?? '')
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

function validateName(value: string): string | undefined {
  if (value.length === 0) {
    return NAME_REQUIRED_ERROR;
  }

  if (!hasPairedBrackets(value)) {
    return NAME_BRACKETS_ERROR;
  }

  return undefined;
}

export function isNameValueValid(value: string): boolean {
  return validateName(normalizeNameOnBlur(value)) === undefined;
}

/**
 * Name input with Cyrillic-only entry, separator filtering and bracket validation on blur.
 */
export function InputName({
  className,
  defaultValue,
  helperText,
  invalid = false,
  label = 'Имя',
  onBlur,
  onChange,
  onValueChange,
  value,
  ...props
}: InputNameProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    sanitizeNameValue(String(defaultValue ?? ''))
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled ? sanitizeNameValue(String(value ?? '')) : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateName(resolvedValue) : undefined;

  useEffect(() => {
    if (!isControlled || value === undefined || resolvedValue === value) {
      return;
    }

    onValueChange?.(resolvedValue);
  }, [isControlled, onValueChange, resolvedValue, value]);

  function updateValue(nextValue: string) {
    const sanitizedValue = sanitizeNameValue(nextValue);

    if (!isControlled) {
      setUncontrolledValue(sanitizedValue);
    }

    onValueChange?.(sanitizedValue);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const normalizedValue = normalizeNameOnBlur(resolvedValue);

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
      className={joinClassNames('rshb-input-name', className)}
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
