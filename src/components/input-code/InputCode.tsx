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
import '../input-text/InputText.scss';
import './InputCode.scss';
import circleExclamationFillIconUrl from '../../../icons/circle-exclamation-fill.svg';
import xmarkIconUrl from '../../../icons/xmark.svg';

const CODE_MASK = '0000';
const CODE_MAX_DIGITS = 4;
const CODE_REQUIRED_ERROR = 'Обязательно для заполнения';

type InputCodeIconStyle = CSSProperties & {
  '--rshb-input-code-icon-url': string;
};

type InputTextClearIconStyle = CSSProperties & {
  '--rshb-input-text-icon-url': string;
};

export interface InputCodeProps
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
  startIcon?: ReactNode;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function getDigitsOnly(value: string): string {
  return value.replace(/\D/g, '').slice(0, CODE_MAX_DIGITS);
}

function validateCode(value: string): string | undefined {
  return getDigitsOnly(value).length === 0 ? CODE_REQUIRED_ERROR : undefined;
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

export function InputCode({
  className,
  clearable = true,
  defaultValue,
  disabled = false,
  helperIcon,
  helperText,
  id,
  invalid = false,
  label = 'Проверочный код',
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
  startIcon,
  value,
  ...props
}: InputCodeProps) {
  const generatedId = useId();
  const helperId = useId();
  const inputId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    getDigitsOnly(String(defaultValue ?? ''))
  );
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const keyboardFocusCandidateRef = useRef(false);
  const resolvedValue = isControlled ? getDigitsOnly(String(value ?? '')) : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateCode(resolvedValue) : undefined;
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
  const describedBy = resolvedHelperText ? helperId : props['aria-describedby'];
  const helperIconStyle = {
    '--rshb-input-code-icon-url': `url("${circleExclamationFillIconUrl}")`
  } as InputCodeIconStyle;
  const clearIconStyle = {
    '--rshb-input-text-icon-url': `url("${xmarkIconUrl}")`
  } as InputTextClearIconStyle;
  const shouldShowMask = isEnteredState || isFocusedState;
  const filledMaskValue = getDigitsOnly(resolvedValue);
  const remainingMaskValue = CODE_MASK.slice(filledMaskValue.length);

  function updateValue(nextValue: string) {
    const digitsValue = getDigitsOnly(nextValue);

    if (!isControlled) {
      setUncontrolledValue(digitsValue);
    }

    onValueChange?.(digitsValue);
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

    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
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
      className={joinClassNames('rshb-input-text', 'rshb-input-code', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-has-helper={resolvedHelperText ? 'true' : 'false'}
      data-has-start-icon={startIcon ? 'true' : 'false'}
      data-state={visualState}
    >
      <div className="rshb-input-text__field">
        {startIcon ? (
          <span aria-hidden="true" className="rshb-input-text__start-icon">
            {startIcon}
          </span>
        ) : null}
        <div className="rshb-input-text__content">
          <label className="rshb-input-text__label" htmlFor={inputId}>
            {label}
          </label>
          <input
            {...props}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-describedby={describedBy}
            aria-invalid={resolvedInvalid || undefined}
            className="rshb-input-text__control rshb-input-code__control"
            disabled={disabled}
            id={inputId}
            inputMode="numeric"
            maxLength={CODE_MAX_DIGITS}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onPointerDown={(event) => {
              keyboardFocusCandidateRef.current = false;
              onPointerDown?.(event);
            }}
            pattern="[0-9]*"
            placeholder={undefined}
            readOnly={!isInteractive || resolvedReadOnly}
            ref={inputRef}
            spellCheck={false}
            type="text"
            value={resolvedValue}
          />
          {shouldShowMask ? (
            <span aria-hidden="true" className="rshb-input-code__mask">
              <span className="rshb-input-code__mask-filled">{filledMaskValue}</span>
              <span className="rshb-input-code__mask-placeholder">{remainingMaskValue}</span>
            </span>
          ) : null}
        </div>
        {showsClearControl ? (
          <button
            aria-label="Очистить поле"
            className="rshb-input-text__clear"
            onClick={handleClear}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            tabIndex={-1}
            type="button"
          >
            <span aria-hidden="true" className="rshb-input-text__clear-icon" style={clearIconStyle} />
          </button>
        ) : null}
      </div>
      {resolvedHelperText ? (
        <div className="rshb-input-text__helper" id={helperId}>
          {showHelperIcon ? (
            <span aria-hidden="true" className="rshb-input-text__helper-icon-wrapper">
              {helperIcon ?? <span className="rshb-input-code__helper-icon" style={helperIconStyle} />}
            </span>
          ) : null}
          <span className="rshb-input-text__helper-text">{resolvedHelperText}</span>
        </div>
      ) : null}
    </div>
  );
}
