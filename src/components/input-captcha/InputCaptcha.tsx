import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode
} from 'react';
import { InputText, type InputTextProps } from '../input-text/InputText';
import './InputCaptcha.scss';

const CAPTCHA_REQUIRED_ERROR = 'Обязательно для заполнения';

export interface InputCaptchaProps
  extends Omit<InputTextProps, 'defaultValue' | 'helperText' | 'inputMode' | 'label' | 'type' | 'value'> {
  defaultValue?: string;
  helperText?: ReactNode;
  label?: ReactNode;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function sanitizeCaptchaValue(value: string): string {
  return value.replace(/\s/g, '');
}

function validateCaptcha(value: string): string | undefined {
  return value.length === 0 ? CAPTCHA_REQUIRED_ERROR : undefined;
}

export function isCaptchaValueValid(value: string): boolean {
  return validateCaptcha(sanitizeCaptchaValue(value)) === undefined;
}

/**
 * Captcha input that accepts any non-space characters and validates required value on blur.
 */
export function InputCaptcha({
  className,
  defaultValue,
  helperText,
  invalid = false,
  label = 'Код с картинки',
  onBlur,
  onChange,
  onValueChange,
  value,
  ...props
}: InputCaptchaProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    sanitizeCaptchaValue(String(defaultValue ?? ''))
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled ? sanitizeCaptchaValue(String(value ?? '')) : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateCaptcha(resolvedValue) : undefined;

  useEffect(() => {
    if (!isControlled || value === undefined || resolvedValue === value) {
      return;
    }

    onValueChange?.(resolvedValue);
  }, [isControlled, onValueChange, resolvedValue, value]);

  function updateValue(nextValue: string) {
    const sanitizedValue = sanitizeCaptchaValue(nextValue);

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
      className={joinClassNames('rshb-input-captcha', className)}
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
