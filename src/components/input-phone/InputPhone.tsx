import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import type { InputTextPreviewState } from '../input-text/InputText';
import './InputPhone.scss';
import circleExclamationFillIconUrl from '../../../icons/circle-exclamation-fill.svg';
import xmarkIconUrl from '../../../icons/xmark.svg';

const PHONE_MASK = '(000) 000-00-00';
const PHONE_MAX_DIGITS = 10;
const PHONE_ALLOWED_FIRST_DIGIT = '9';
const PHONE_COUNTRY_PREFIX_DIGITS = new Set(['7', '8']);
const PHONE_REQUIRED_ERROR = 'Обязательно для заполнения';
const PHONE_LENGTH_ERROR = 'Номер телефона должен содержать 11 цифр';
const PHONE_REPEATING_ERROR = 'Некорректный номер телефона';

type InputPhoneIconStyle = CSSProperties & {
  '--rshb-input-phone-icon-url': string;
};

export interface InputPhoneProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'defaultValue' | 'prefix' | 'size' | 'type' | 'value'
  > {
  className?: string;
  clearable?: boolean;
  defaultValue?: string;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  invalid?: boolean;
  label?: ReactNode;
  onValueChange?: (value: string) => void;
  previewState?: InputTextPreviewState;
  showHelperIcon?: boolean;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function getDigitsOnly(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.length > PHONE_MAX_DIGITS && PHONE_COUNTRY_PREFIX_DIGITS.has(digits[0])) {
    digits = digits.slice(1);
  }

  if (digits.length > 0 && digits[0] !== PHONE_ALLOWED_FIRST_DIGIT) {
    return '';
  }

  return digits.slice(0, PHONE_MAX_DIGITS);
}

function formatPhoneNumber(value: string): string {
  const digits = getDigitsOnly(value);
  let formatted = '';

  if (digits.length > 0) {
    formatted = `(${digits.slice(0, 3)}`;
  }

  if (digits.length >= 3) {
    formatted += `) ${digits.slice(3, 6)}`;
  }

  if (digits.length >= 6) {
    formatted += `-${digits.slice(6, 8)}`;
  }

  if (digits.length >= 8) {
    formatted += `-${digits.slice(8, 10)}`;
  }

  return formatted;
}

function buildMaskDisplay(value: string): string {
  const digits = getDigitsOnly(value);
  let result = '';
  let digitIndex = 0;

  for (const character of PHONE_MASK) {
    if (character === '0') {
      if (digitIndex < digits.length) {
        result += digits[digitIndex];
        digitIndex += 1;
      } else {
        result += '0';
      }
    } else {
      result += character;
    }
  }

  return result;
}

function validatePhoneNumber(value: string): string | undefined {
  const digits = getDigitsOnly(value);

  if (digits.length === 0) {
    return PHONE_REQUIRED_ERROR;
  }

  if (digits.length < PHONE_MAX_DIGITS) {
    return PHONE_LENGTH_ERROR;
  }

  if (/^(\d)\1+$/.test(digits)) {
    return PHONE_REPEATING_ERROR;
  }

  return undefined;
}

function resolveInteractiveState({
  disabled,
  hasKeyboardFocus,
  invalid,
  isFocused,
  value
}: {
  disabled: boolean;
  hasKeyboardFocus: boolean;
  invalid: boolean;
  isFocused: boolean;
  value: string;
}): InputTextPreviewState {
  const hasValue = getDigitsOnly(value).length > 0;

  if (disabled) {
    return hasValue ? 'disabled-entered' : 'disabled';
  }

  if (isFocused) {
    if (hasKeyboardFocus && !hasValue) {
      return 'keyboard-focused';
    }

    return hasValue ? 'typing' : 'focused';
  }

  if (invalid) {
    return hasValue ? 'error-entered' : 'error';
  }

  return hasValue ? 'entered' : 'default';
}

/**
 * Phone input with `+7` prefix and a fixed `(000) 000-00-00` mask, adapted from the supplied prototype.
 */
export function InputPhone({
  className,
  clearable = true,
  defaultValue,
  disabled = false,
  helperIcon,
  helperText,
  id,
  invalid = false,
  label = 'Номер телефона',
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  onPaste,
  onPointerDown,
  onValueChange,
  previewState,
  readOnly,
  showHelperIcon = false,
  value,
  ...props
}: InputPhoneProps) {
  const generatedId = useId();
  const helperId = useId();
  const inputId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    formatPhoneNumber(String(defaultValue ?? ''))
  );
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const keyboardFocusCandidateRef = useRef(false);
  const resolvedValue = isControlled ? formatPhoneNumber(String(value ?? '')) : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validatePhoneNumber(resolvedValue) : undefined;
  const resolvedInvalid = invalid || validationMessage !== undefined;
  const resolvedReadOnly = readOnly ?? (isControlled && onChange === undefined && onValueChange === undefined);
  const isInteractive = previewState === undefined;
  const visualState = isInteractive
    ? resolveInteractiveState({
        disabled,
        hasKeyboardFocus,
        invalid: resolvedInvalid,
        isFocused,
        value: resolvedValue
      })
    : previewState;
  const isEnteredState =
    visualState === 'entered' ||
    visualState === 'entered-hover' ||
    visualState === 'typing' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover' ||
    visualState === 'disabled-entered';
  const isFocusedState =
    visualState === 'focused' ||
    visualState === 'typing' ||
    visualState === 'keyboard-focused';
  const isErrorState =
    visualState === 'error' ||
    visualState === 'error-hover' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover';
  const resolvedHelperText = isErrorState ? validationMessage ?? helperText : undefined;
  const showsClearControl =
    clearable &&
    !disabled &&
    !resolvedReadOnly &&
    (isInteractive ? isFocused && getDigitsOnly(resolvedValue).length > 0 : visualState === 'typing');
  const shouldFloatLabel = isEnteredState || isFocusedState;
  const describedBy = resolvedHelperText ? helperId : props['aria-describedby'];
  const helperIconStyle = {
    '--rshb-input-phone-icon-url': `url("${circleExclamationFillIconUrl}")`
  } as InputPhoneIconStyle;
  const clearIconStyle = {
    '--rshb-input-phone-icon-url': `url("${xmarkIconUrl}")`
  } as InputPhoneIconStyle;
  const phoneMask = buildMaskDisplay(resolvedValue);

  function updateValue(nextValue: string) {
    const formattedValue = formatPhoneNumber(nextValue);

    if (!isControlled) {
      setUncontrolledValue(formattedValue);
    }

    onValueChange?.(formattedValue);
  }

  function focusInput() {
    if (disabled) {
      return;
    }

    inputRef.current?.focus();
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    setHasKeyboardFocus(keyboardFocusCandidateRef.current && event.currentTarget.matches(':focus-visible'));
    onFocus?.(event);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    setHasKeyboardFocus(false);
    setHasBeenValidated(true);
    onBlur?.(event);
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    if (!isInteractive || resolvedReadOnly) {
      onPaste?.(event);
      return;
    }

    event.preventDefault();
    updateValue(event.clipboardData.getData('text'));
    onPaste?.(event);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isInteractive || disabled || resolvedReadOnly) {
      onChange?.(event);
      return;
    }

    updateValue(event.target.value);
    onChange?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    keyboardFocusCandidateRef.current = event.key === 'Tab';

    if (!isInteractive || disabled || resolvedReadOnly) {
      onKeyDown?.(event);
      return;
    }

    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End'
    ];

    if (event.key === 'Backspace') {
      event.preventDefault();
      const nextDigits = getDigitsOnly(resolvedValue).slice(0, -1);
      updateValue(nextDigits);
      onKeyDown?.(event);
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      const nextDigits = getDigitsOnly(resolvedValue).slice(1);
      updateValue(nextDigits);
      onKeyDown?.(event);
      return;
    }

    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
      onKeyDown?.(event);
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      updateValue(`${getDigitsOnly(resolvedValue)}${event.key}`);
      onKeyDown?.(event);
      return;
    }

    onKeyDown?.(event);
  }

  function handleClear() {
    updateValue('');
    inputRef.current?.focus();
  }

  return (
    <div
      className={joinClassNames('rshb-input-phone', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-has-helper={resolvedHelperText ? 'true' : 'false'}
      data-state={visualState}
    >
      <div className="rshb-input-phone__field">
        <div className="rshb-input-phone__content">
          <label className="rshb-input-phone__label" htmlFor={inputId}>
            {label}
          </label>
          <div className="rshb-input-phone__value-row">
            {shouldFloatLabel ? <span className="rshb-input-phone__prefix">+7</span> : null}
            <div className="rshb-input-phone__input-shell">
              <input
                {...props}
                aria-describedby={describedBy}
                aria-invalid={resolvedInvalid || undefined}
                className="rshb-input-phone__control"
                disabled={disabled}
                id={inputId}
                inputMode="numeric"
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onPointerDown={(event) => {
                  keyboardFocusCandidateRef.current = false;
                  onPointerDown?.(event);
                }}
                placeholder={undefined}
                readOnly={!isInteractive || resolvedReadOnly}
                ref={inputRef}
                type="text"
                value={resolvedValue}
              />
              {shouldFloatLabel ? (
                <span aria-hidden="true" className="rshb-input-phone__mask">
                  {phoneMask}
                </span>
              ) : null}
            </div>
          </div>
          {!shouldFloatLabel ? (
            <button
              aria-label="Активировать поле телефона"
              className="rshb-input-phone__activator"
              onClick={focusInput}
              onPointerDown={() => {
                keyboardFocusCandidateRef.current = false;
              }}
              tabIndex={-1}
              type="button"
            />
          ) : null}
        </div>
        {showsClearControl ? (
          <button
            aria-label="Очистить поле"
            className="rshb-input-phone__clear"
            onClick={handleClear}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            tabIndex={-1}
            type="button"
          >
            <span aria-hidden="true" className="rshb-input-phone__clear-icon" style={clearIconStyle} />
          </button>
        ) : null}
      </div>
      {resolvedHelperText ? (
        <div className="rshb-input-phone__helper" id={helperId}>
          {showHelperIcon ? (
            <span aria-hidden="true" className="rshb-input-phone__helper-icon-wrapper">
              {helperIcon ?? (
                <span className="rshb-input-phone__helper-icon" style={helperIconStyle} />
              )}
            </span>
          ) : null}
          <span className="rshb-input-phone__helper-text">{resolvedHelperText}</span>
        </div>
      ) : null}
    </div>
  );
}
