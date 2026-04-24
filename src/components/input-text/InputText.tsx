import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode
} from 'react';
import './InputText.scss';
import circleExclamationFillIconUrl from '../../../icons/circle-exclamation-fill.svg';
import xmarkIconUrl from '../../../icons/xmark.svg';

export type InputTextPreviewState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'typing'
  | 'entered'
  | 'entered-hover'
  | 'error'
  | 'error-hover'
  | 'error-entered'
  | 'error-entered-hover'
  | 'disabled'
  | 'disabled-entered'
  | 'keyboard-focused';

type InputTextIconStyle = CSSProperties & {
  '--rshb-input-text-icon-url': string;
};

export interface InputTextProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'defaultValue' | 'prefix' | 'size' | 'value'
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
 * Floating-label text input translated from the Figma state matrix and aligned with the provided prototype behavior.
 */
export function InputText({
  className,
  clearable = true,
  defaultValue,
  disabled = false,
  helperIcon,
  helperText,
  id,
  invalid = false,
  label = 'Название',
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
}: InputTextProps) {
  const generatedId = useId();
  const helperId = useId();
  const inputId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue ?? ''));
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const keyboardFocusCandidateRef = useRef(false);
  const resolvedValue = isControlled ? String(value ?? '') : uncontrolledValue;
  const resolvedReadOnly = readOnly ?? (isControlled && onChange === undefined && onValueChange === undefined);
  const isInteractive = previewState === undefined;
  const visualState = isInteractive
    ? resolveInteractiveState({
        disabled,
        hasKeyboardFocus,
        invalid,
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
  const resolvedHelperText = isErrorState ? helperText : undefined;
  const showsClearControl =
    clearable &&
    !disabled &&
    !resolvedReadOnly &&
    (isInteractive ? isFocused && resolvedValue.length > 0 : visualState === 'typing');
  const describedBy = resolvedHelperText ? helperId : props['aria-describedby'];
  const helperIconStyle = {
    '--rshb-input-text-icon-url': `url("${circleExclamationFillIconUrl}")`
  } as InputTextIconStyle;
  const clearIconStyle = {
    '--rshb-input-text-icon-url': `url("${xmarkIconUrl}")`
  } as InputTextIconStyle;

  function updateValue(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
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
    onBlur?.(event);
  }

  function handleClear() {
    updateValue('');
    inputRef.current?.focus();
  }

  return (
    <div
      className={joinClassNames('rshb-input-text', className)}
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
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
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
            <span aria-hidden="true" className="rshb-input-text__clear-icon" style={clearIconStyle} />
          </button>
        ) : null}
      </div>
      {resolvedHelperText ? (
        <div className="rshb-input-text__helper" id={helperId}>
          {showHelperIcon ? (
            <span aria-hidden="true" className="rshb-input-text__helper-icon-wrapper">
              {helperIcon ?? (
                <span className="rshb-input-text__helper-icon" style={helperIconStyle} />
              )}
            </span>
          ) : null}
          <span className="rshb-input-text__helper-text">{resolvedHelperText}</span>
        </div>
      ) : null}
    </div>
  );
}
