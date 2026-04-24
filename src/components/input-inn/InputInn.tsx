import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode
} from 'react';
import { InputText, type InputTextProps } from '../input-text/InputText';
import './InputInn.scss';

const INN_MAX_DIGITS = 12;
const INN_REQUIRED_ERROR = 'Обязательно для заполнения';
const INN_LENGTH_ERROR = 'ИНН должен содержать 10 или 12 цифр.';

export interface InputInnProps
  extends Omit<InputTextProps, 'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'> {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function sanitizeInnValue(value: string): string {
  return value.replace(/\D/g, '').slice(0, INN_MAX_DIGITS);
}

function validateInn(value: string): string | undefined {
  if (value.length === 0) {
    return INN_REQUIRED_ERROR;
  }

  return value.length === 10 || value.length === 12 ? undefined : INN_LENGTH_ERROR;
}

/**
 * INN input that accepts only digits and validates 10 or 12 digit identifiers on blur.
 */
export function InputInn({
  className,
  defaultValue,
  helperText,
  invalid = false,
  label = 'ИНН',
  onBlur,
  onChange,
  onValueChange,
  value,
  ...props
}: InputInnProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    sanitizeInnValue(String(defaultValue ?? ''))
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled ? sanitizeInnValue(String(value ?? '')) : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateInn(resolvedValue) : undefined;

  useEffect(() => {
    if (!isControlled || value === undefined || resolvedValue === value) {
      return;
    }

    onValueChange?.(resolvedValue);
  }, [isControlled, onValueChange, resolvedValue, value]);

  function updateValue(nextValue: string) {
    const sanitizedValue = sanitizeInnValue(nextValue);

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
      className={joinClassNames('rshb-input-inn', className)}
      helperText={validationMessage ?? helperText}
      inputMode="numeric"
      invalid={invalid || validationMessage !== undefined}
      label={label}
      maxLength={INN_MAX_DIGITS}
      onBlur={handleBlur}
      onChange={handleChange}
      onValueChange={updateValue}
      type="text"
      value={resolvedValue}
    />
  );
}
