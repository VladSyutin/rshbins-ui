import React, { useRef, useState } from 'react';
import './styles.css';

let idCounter = 0;

function generateInputId() {
  return 'rshb-legacy-input-text-' + (++idCounter);
}

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function resolveInteractiveState(_ref) {
  const disabled = _ref.disabled;
  const hasKeyboardFocus = _ref.hasKeyboardFocus;
  const invalid = _ref.invalid;
  const isFocused = _ref.isFocused;
  const value = _ref.value;

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

function XmarkIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M3.46967 3.46967C3.76256 3.17678 4.23744 3.17678 4.53033 3.46967L8 6.93934L11.4697 3.46967C11.7626 3.17678 12.2374 3.17678 12.5303 3.46967C12.8232 3.76256 12.8232 4.23744 12.5303 4.53033L9.06066 8L12.5303 11.4697C12.8232 11.7626 12.8232 12.2374 12.5303 12.5303C12.2374 12.8232 11.7626 12.8232 11.4697 12.5303L8 9.06066L4.53033 12.5303C4.23744 12.8232 3.76256 12.8232 3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L6.93934 8L3.46967 4.53033C3.17678 4.23744 3.17678 3.76256 3.46967 3.46967Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function CircleExclamationFillIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94771 7.44772 9.5 8 9.5C8.55228 9.5 9 9.94771 9 10.5ZM8.75 5C8.75 4.58579 8.41421 4.25 8 4.25C7.58579 4.25 7.25 4.58579 7.25 5V7.5C7.25 7.91421 7.58579 8.25 8 8.25C8.41421 8.25 8.75 7.91421 8.75 7.5V5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function InputText(props) {
  const {
    className,
    clearable,
    defaultValue,
    disabled,
    helperIcon,
    helperText,
    id,
    invalid,
    label,
    onBlur,
    onChange,
    onFocus,
    onValueChange,
    previewState,
    readOnly,
    showHelperIcon,
    startIcon,
    value,
    ...rest
  } = props;

  const resolvedClearable = clearable != null ? clearable : true;
  const resolvedDisabled = Boolean(disabled);
  const resolvedInvalid = Boolean(invalid);
  const resolvedLabel = label != null ? label : 'Название';
  const resolvedShowHelperIcon = Boolean(showHelperIcon);

  const [inputId] = useState(function () {
    return id || generateInputId();
  });
  const [helperId] = useState(function () {
    return inputId + '-helper';
  });

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    String(defaultValue != null ? defaultValue : '')
  );
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const inputRef = useRef(null);
  const keyboardFocusCandidateRef = useRef(false);

  const resolvedValue = isControlled ? String(value != null ? value : '') : uncontrolledValue;
  const resolvedReadOnly =
    readOnly != null
      ? readOnly
      : isControlled && onChange == null && onValueChange == null;
  const isInteractive = previewState == null;

  const visualState = isInteractive
    ? resolveInteractiveState({
        disabled: resolvedDisabled,
        hasKeyboardFocus: hasKeyboardFocus,
        invalid: resolvedInvalid,
        isFocused: isFocused,
        value: resolvedValue
      })
    : previewState;

  const isErrorState =
    visualState === 'error' ||
    visualState === 'error-hover' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover';

  const resolvedHelperText = isErrorState ? helperText : undefined;

  const showsClearControl =
    resolvedClearable &&
    !resolvedDisabled &&
    !resolvedReadOnly &&
    (isInteractive ? isFocused && resolvedValue.length > 0 : visualState === 'typing');

  const describedBy = resolvedHelperText ? helperId : rest['aria-describedby'];

  function updateValue(nextValue) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    if (onValueChange) {
      onValueChange(nextValue);
    }
  }

  function handleChange(event) {
    updateValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  }

  function handleFocus(event) {
    setIsFocused(true);
    setHasKeyboardFocus(
      keyboardFocusCandidateRef.current && event.currentTarget.matches(':focus-visible')
    );
    if (onFocus) {
      onFocus(event);
    }
  }

  function handleBlur(event) {
    setIsFocused(false);
    setHasKeyboardFocus(false);
    if (onBlur) {
      onBlur(event);
    }
  }

  function handleClear() {
    updateValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <div
      className={joinClassNames('rshb-legacy-input-text', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-has-helper={resolvedHelperText ? 'true' : 'false'}
      data-has-start-icon={startIcon ? 'true' : 'false'}
      data-state={visualState}
    >
      <div className="rshb-legacy-input-text__field">
        {startIcon ? (
          <span aria-hidden="true" className="rshb-legacy-input-text__start-icon">
            {startIcon}
          </span>
        ) : null}
        <div className="rshb-legacy-input-text__content">
          <label className="rshb-legacy-input-text__label" htmlFor={inputId}>
            {resolvedLabel}
          </label>
          <input
            {...rest}
            aria-describedby={describedBy}
            aria-invalid={resolvedInvalid || undefined}
            className="rshb-legacy-input-text__control"
            disabled={resolvedDisabled}
            id={inputId}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={function (event) {
              keyboardFocusCandidateRef.current = event.key === 'Tab';
              if (rest.onKeyDown) {
                rest.onKeyDown(event);
              }
            }}
            onPointerDown={function (event) {
              keyboardFocusCandidateRef.current = false;
              if (rest.onPointerDown) {
                rest.onPointerDown(event);
              }
            }}
            readOnly={!isInteractive || resolvedReadOnly}
            ref={inputRef}
            value={resolvedValue}
          />
        </div>
        {showsClearControl ? (
          <button
            aria-label="Очистить поле"
            className="rshb-legacy-input-text__clear"
            onClick={handleClear}
            onMouseDown={function (event) {
              event.preventDefault();
            }}
            tabIndex={-1}
            type="button"
          >
            <span aria-hidden="true" className="rshb-legacy-input-text__clear-icon">
              <XmarkIcon />
            </span>
          </button>
        ) : null}
      </div>
      {resolvedHelperText ? (
        <div className="rshb-legacy-input-text__helper" id={helperId}>
          {resolvedShowHelperIcon ? (
            <span aria-hidden="true" className="rshb-legacy-input-text__helper-icon-wrapper">
              {helperIcon != null ? helperIcon : <CircleExclamationFillIcon />}
            </span>
          ) : null}
          <span className="rshb-legacy-input-text__helper-text">{resolvedHelperText}</span>
        </div>
      ) : null}
    </div>
  );
}
