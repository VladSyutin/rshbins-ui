import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode
} from 'react';
import type { InputTextPreviewState } from '../input-text/InputText';
import { cyrillicToLatin } from '../transliterate';
import '../input-text/InputText.scss';
import './InputPassword.scss';
import circleExclamationFillIconUrl from '../../../icons/circle-exclamation-fill.svg';
import eyeIconUrl from '../../../icons/eye.svg';
import eyeSlashIconUrl from '../../../icons/eye-slash.svg';
import xmarkIconUrl from '../../../icons/xmark.svg';

type InputPasswordIconStyle = CSSProperties & {
  '--rshb-input-password-icon-url': string;
};

const PASSWORD_REQUIRED_ERROR = 'Обязательно для заполнения';
const PASSWORD_ALLOWED_CHARACTER_PATTERN = /^[A-Za-z0-9()~!@#$%^&*_\-+='|"{}[\]<>;:,.?/]$/;

export interface InputPasswordProps
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

function sanitizePasswordValue(value: string): string {
  let sanitizedValue = '';

  for (const rawCharacter of value) {
    const character = PASSWORD_ALLOWED_CHARACTER_PATTERN.test(rawCharacter)
      ? rawCharacter
      : cyrillicToLatin(rawCharacter);

    if (PASSWORD_ALLOWED_CHARACTER_PATTERN.test(character)) {
      sanitizedValue += character;
    }
  }

  return sanitizedValue;
}

function validatePassword(value: string): string | undefined {
  return value.length === 0 ? PASSWORD_REQUIRED_ERROR : undefined;
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
  const hasValue = value.length > 0;

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
 * Floating-label password input based on the text input states with a trailing visibility toggle.
 */
export function InputPassword({
  className,
  clearable = true,
  defaultValue,
  disabled = false,
  helperIcon,
  helperText,
  id,
  invalid = false,
  label = 'Пароль',
  onBlur,
  onChange,
  onFocus,
  onValueChange,
  previewState,
  readOnly,
  showHelperIcon = false,
  startIcon,
  value,
  ...props
}: InputPasswordProps) {
  const generatedId = useId();
  const helperId = useId();
  const inputId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    sanitizePasswordValue(String(defaultValue ?? ''))
  );
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const keyboardFocusCandidateRef = useRef(false);
  const resolvedValue = isControlled ? sanitizePasswordValue(String(value ?? '')) : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validatePassword(resolvedValue) : undefined;
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
    (isInteractive ? isFocused && resolvedValue.length > 0 : visualState === 'typing');
  const showsVisibilityToggle = resolvedValue.length > 0;
  const describedBy = resolvedHelperText ? helperId : props['aria-describedby'];
  const helperIconStyle = {
    '--rshb-input-password-icon-url': `url("${circleExclamationFillIconUrl}")`
  } as InputPasswordIconStyle;
  const clearIconStyle = {
    '--rshb-input-password-icon-url': `url("${xmarkIconUrl}")`
  } as InputPasswordIconStyle;
  const visibilityIconStyle = {
    '--rshb-input-password-icon-url': `url("${isPasswordVisible ? eyeIconUrl : eyeSlashIconUrl}")`
  } as InputPasswordIconStyle;
  const canToggleVisibility = !disabled && isInteractive;

  useEffect(() => {
    if (!isControlled || value === undefined || resolvedValue === value) {
      return;
    }

    onValueChange?.(resolvedValue);
  }, [isControlled, onValueChange, resolvedValue, value]);

  function updateValue(nextValue: string) {
    const sanitizedValue = sanitizePasswordValue(nextValue);

    if (!isControlled) {
      setUncontrolledValue(sanitizedValue);
    }

    onValueChange?.(sanitizedValue);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateValue(event.target.value);
    onChange?.(event);
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

  function handleClear() {
    updateValue('');
    inputRef.current?.focus();
  }

  function handleTogglePasswordVisibility() {
    if (!canToggleVisibility) {
      return;
    }

    const selectionStart = inputRef.current?.selectionStart ?? null;
    const selectionEnd = inputRef.current?.selectionEnd ?? null;

    setIsPasswordVisible((currentValue) => !currentValue);
    requestAnimationFrame(() => {
      if (!inputRef.current) {
        return;
      }

      inputRef.current.focus();

      if (selectionStart !== null && selectionEnd !== null) {
        inputRef.current.setSelectionRange(selectionStart, selectionEnd);
      }
    });
  }

  return (
    <div
      className={joinClassNames('rshb-input-text', 'rshb-input-password', className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-has-helper={resolvedHelperText ? 'true' : 'false'}
      data-has-start-icon={startIcon ? 'true' : 'false'}
      data-password-visible={isPasswordVisible ? 'true' : 'false'}
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
            aria-describedby={describedBy}
            aria-invalid={resolvedInvalid || undefined}
            className="rshb-input-text__control"
            disabled={disabled}
            id={inputId}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={(event) => {
              keyboardFocusCandidateRef.current = event.key === 'Tab';
              props.onKeyDown?.(event);
            }}
            onPointerDown={(event) => {
              keyboardFocusCandidateRef.current = false;
              props.onPointerDown?.(event);
            }}
            readOnly={!isInteractive || resolvedReadOnly}
            ref={inputRef}
            type={isPasswordVisible ? 'text' : 'password'}
            value={resolvedValue}
          />
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
            <span
              aria-hidden="true"
              className="rshb-input-password__action-icon rshb-input-password__action-icon--clear"
              style={clearIconStyle}
            />
          </button>
        ) : null}
        {showsVisibilityToggle ? (
          <button
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            aria-pressed={isPasswordVisible}
            className="rshb-input-password__visibility-toggle"
            disabled={!canToggleVisibility}
            onClick={handleTogglePasswordVisibility}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            tabIndex={isInteractive ? 0 : -1}
            type="button"
          >
            <span
              aria-hidden="true"
              className="rshb-input-password__action-icon rshb-input-password__action-icon--visibility"
              style={visibilityIconStyle}
            />
          </button>
        ) : null}
      </div>
      {resolvedHelperText ? (
        <div className="rshb-input-text__helper" id={helperId}>
          {showHelperIcon ? (
            <span aria-hidden="true" className="rshb-input-text__helper-icon-wrapper">
              {helperIcon ?? (
                <span className="rshb-input-password__helper-icon" style={helperIconStyle} />
              )}
            </span>
          ) : null}
          <span className="rshb-input-text__helper-text">{resolvedHelperText}</span>
        </div>
      ) : null}
    </div>
  );
}
