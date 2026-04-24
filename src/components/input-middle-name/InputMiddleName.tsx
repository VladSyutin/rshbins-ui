import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode
} from 'react';
import { InputText, type InputTextProps } from '../input-text/InputText';
import { Switch } from '../switch/Switch';
import './InputMiddleName.scss';

const MIDDLE_NAME_REQUIRED_ERROR = 'Обязательно для заполнения';
const MIDDLE_NAME_BRACKETS_ERROR = 'Скобки должны быть парными.';
const MIDDLE_NAME_ALLOWED_CHARACTER_PATTERN = /^[А-Яа-яЁё.\-’,()]$/;
const MIDDLE_NAME_LETTER_PATTERN = /^[А-Яа-яЁё]$/;
const MIDDLE_NAME_SEPARATOR_PATTERN = /^[.\-’,() ]$/;
const MIDDLE_NAME_TRAILING_FORBIDDEN_PATTERN = /^[.\-’, ]$/;

export interface InputMiddleNameProps
  extends Omit<InputTextProps, 'disabled' | 'helperText' | 'inputMode' | 'label' | 'type'> {
  defaultWithoutMiddleName?: boolean;
  disabled?: boolean;
  helperText?: ReactNode;
  onWithoutMiddleNameChange?: (checked: boolean) => void;
  switchLabel?: string;
  withoutMiddleName?: boolean;
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

function sanitizeMiddleNameValue(value: string): string {
  let sanitizedValue = '';

  for (const character of value) {
    if (!MIDDLE_NAME_ALLOWED_CHARACTER_PATTERN.test(character)) {
      continue;
    }

    const previousCharacter = sanitizedValue.at(-1);

    if (sanitizedValue.length === 0 && !MIDDLE_NAME_LETTER_PATTERN.test(character)) {
      continue;
    }

    if (
      previousCharacter !== undefined &&
      MIDDLE_NAME_SEPARATOR_PATTERN.test(previousCharacter) &&
      MIDDLE_NAME_SEPARATOR_PATTERN.test(character)
    ) {
      continue;
    }

    sanitizedValue += character;
  }

  return formatFirstLetter(sanitizedValue);
}

function normalizeMiddleNameOnBlur(value: string): string {
  let normalizedValue = sanitizeMiddleNameValue(value);

  while (
    normalizedValue.length > 0 &&
    MIDDLE_NAME_TRAILING_FORBIDDEN_PATTERN.test(normalizedValue.at(-1) ?? '')
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

function validateMiddleName(value: string): string | undefined {
  if (value.length === 0) {
    return MIDDLE_NAME_REQUIRED_ERROR;
  }

  if (!hasPairedBrackets(value)) {
    return MIDDLE_NAME_BRACKETS_ERROR;
  }

  return undefined;
}

export function isMiddleNameValueValid(value: string): boolean {
  return validateMiddleName(normalizeMiddleNameOnBlur(value)) === undefined;
}

export function InputMiddleName({
  className,
  defaultValue,
  defaultWithoutMiddleName = false,
  disabled = false,
  helperText,
  invalid = false,
  onBlur,
  onChange,
  onValueChange,
  onWithoutMiddleNameChange,
  switchLabel = 'Нет отчества',
  value,
  withoutMiddleName,
  ...props
}: InputMiddleNameProps) {
  const isControlled = withoutMiddleName !== undefined;
  const isValueControlled = value !== undefined;
  const [uncontrolledWithoutMiddleName, setUncontrolledWithoutMiddleName] = useState(defaultWithoutMiddleName);
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    sanitizeMiddleNameValue(String(defaultValue ?? ''))
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const isWithoutMiddleName = isControlled ? Boolean(withoutMiddleName) : uncontrolledWithoutMiddleName;
  const resolvedValue = isValueControlled
    ? sanitizeMiddleNameValue(String(value ?? ''))
    : uncontrolledValue;
  const validationMessage =
    hasBeenValidated && !isWithoutMiddleName ? validateMiddleName(resolvedValue) : undefined;

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledWithoutMiddleName(defaultWithoutMiddleName);
    }
  }, [defaultWithoutMiddleName, isControlled]);

  useEffect(() => {
    if (!isValueControlled || value === undefined || resolvedValue === value) {
      return;
    }

    onValueChange?.(resolvedValue);
  }, [isValueControlled, onValueChange, resolvedValue, value]);

  function updateValue(nextValue: string) {
    const sanitizedValue = sanitizeMiddleNameValue(nextValue);

    if (!isValueControlled) {
      setUncontrolledValue(sanitizedValue);
    }

    onValueChange?.(sanitizedValue);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const normalizedValue = normalizeMiddleNameOnBlur(resolvedValue);

    if (normalizedValue !== resolvedValue) {
      if (!isValueControlled) {
        setUncontrolledValue(normalizedValue);
      }

      onValueChange?.(normalizedValue);
    }

    setHasBeenValidated(true);
    onBlur?.(event);
  }

  function handleSwitchChange(event: ChangeEvent<HTMLInputElement>) {
    const nextChecked = event.target.checked;

    if (!isControlled) {
      setUncontrolledWithoutMiddleName(nextChecked);
    }

    onWithoutMiddleNameChange?.(nextChecked);
  }

  return (
    <div className={joinClassNames('rshb-input-middle-name', className)}>
      <InputText
        {...props}
        disabled={disabled || isWithoutMiddleName}
        helperText={validationMessage ?? helperText}
        inputMode="text"
        invalid={invalid || validationMessage !== undefined}
        label="Отчество"
        onBlur={handleBlur}
        onChange={handleChange}
        onValueChange={updateValue}
        type="text"
        value={resolvedValue}
      />
      <Switch
        checked={isWithoutMiddleName}
        className="rshb-input-middle-name__switch"
        disabled={disabled}
        label={switchLabel}
        onChange={handleSwitchChange}
      />
    </div>
  );
}
