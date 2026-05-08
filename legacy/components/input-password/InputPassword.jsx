import React, { useEffect, useRef, useState } from 'react';
import { cyrillicToLatin } from '../transliterate.js';
import './styles.css';

const PASSWORD_REQUIRED_ERROR = 'Обязательно для заполнения';
const PASSWORD_ALLOWED_CHARACTER_PATTERN = /^[A-Za-z0-9()~!@#$%^&*_\-+='|"{}[\]<>;:,.?/]$/;

let idCounter = 0;

function generateInputId() {
  return 'rshb-legacy-input-password-' + (++idCounter);
}

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function sanitizePasswordValue(value) {
  let sanitizedValue = '';
  const input = String(value);

  for (let index = 0; index < input.length; index += 1) {
    const rawCharacter = input[index];
    const character = PASSWORD_ALLOWED_CHARACTER_PATTERN.test(rawCharacter)
      ? rawCharacter
      : cyrillicToLatin(rawCharacter);

    if (PASSWORD_ALLOWED_CHARACTER_PATTERN.test(character)) {
      sanitizedValue += character;
    }
  }

  return sanitizedValue;
}

function validatePassword(value) {
  return value.length === 0 ? PASSWORD_REQUIRED_ERROR : undefined;
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

function EyeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 3C4.65567 3 1.98067 5.22591 1 8C1.98067 10.7741 4.65567 13 8 13C11.3443 13 14.0193 10.7741 15 8C14.0193 5.22591 11.3443 3 8 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="8" fill="currentColor" r="2.25" />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 2L14 14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.35645 3.35645C6.88505 3.12213 7.43948 3 8 3C11.3443 3 14.0193 5.22591 15 8C14.6554 8.97515 14.1182 9.85487 13.4369 10.5942M9.87868 11.8787C9.27573 12.0357 8.64282 12.1177 8 12.1177C4.65567 12.1177 1.98067 9.89176 1 7.11765C1.52039 5.64535 2.49803 4.39363 3.76104 3.52672"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.36768 6.36768C5.94081 6.79456 5.67647 7.38456 5.67647 8.03529C5.67647 9.33656 6.73109 10.3912 8.03235 10.3912C8.68308 10.3912 9.27309 10.1268 9.69997 9.69997"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function InputPassword(props) {
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
  const resolvedLabel = label != null ? label : 'Пароль';
  const resolvedShowHelperIcon = Boolean(showHelperIcon);
  const [inputId] = useState(function () {
    return id || generateInputId();
  });
  const [helperId] = useState(function () {
    return inputId + '-helper';
  });
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(function () {
    return sanitizePasswordValue(defaultValue != null ? defaultValue : '');
  });
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef(null);
  const keyboardFocusCandidateRef = useRef(false);
  const resolvedValue = isControlled
    ? sanitizePasswordValue(value != null ? value : '')
    : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validatePassword(resolvedValue) : undefined;
  const resolvedReadOnly =
    readOnly != null
      ? readOnly
      : isControlled && onChange == null && onValueChange == null;
  const isInteractive = previewState == null;
  const visualState = isInteractive
    ? resolveInteractiveState({
        disabled: resolvedDisabled,
        hasKeyboardFocus: hasKeyboardFocus,
        invalid: resolvedInvalid || validationMessage !== undefined,
        isFocused: isFocused,
        value: resolvedValue
      })
    : previewState;
  const isErrorState =
    visualState === 'error' ||
    visualState === 'error-hover' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover';
  const resolvedHelperText = isErrorState ? validationMessage || helperText : undefined;
  const showsClearControl =
    resolvedClearable &&
    !resolvedDisabled &&
    !resolvedReadOnly &&
    (isInteractive ? isFocused && resolvedValue.length > 0 : visualState === 'typing');
  const showsVisibilityToggle = resolvedValue.length > 0;
  const describedBy = resolvedHelperText ? helperId : rest['aria-describedby'];
  const canToggleVisibility = !resolvedDisabled && isInteractive;

  useEffect(
    function () {
      if (!isControlled || value === undefined || resolvedValue === value) {
        return;
      }

      if (onValueChange) {
        onValueChange(resolvedValue);
      }
    },
    [isControlled, onValueChange, resolvedValue, value]
  );

  function updateValue(nextValue) {
    const sanitizedValue = sanitizePasswordValue(nextValue);

    if (!isControlled) {
      setUncontrolledValue(sanitizedValue);
    }

    if (onValueChange) {
      onValueChange(sanitizedValue);
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
    setHasBeenValidated(true);

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

  function handleTogglePasswordVisibility() {
    if (!canToggleVisibility) {
      return;
    }

    const selectionStart = inputRef.current ? inputRef.current.selectionStart : null;
    const selectionEnd = inputRef.current ? inputRef.current.selectionEnd : null;

    setIsPasswordVisible(function (currentValue) {
      return !currentValue;
    });

    requestAnimationFrame(function () {
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
      className={joinClassNames('rshb-legacy-input-text', 'rshb-legacy-input-password', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-has-helper={resolvedHelperText ? 'true' : 'false'}
      data-has-start-icon={startIcon ? 'true' : 'false'}
      data-password-visible={isPasswordVisible ? 'true' : 'false'}
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
            aria-invalid={resolvedInvalid || validationMessage !== undefined || undefined}
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
            type={isPasswordVisible ? 'text' : 'password'}
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
            <span
              aria-hidden="true"
              className="rshb-legacy-input-password__action-icon rshb-legacy-input-password__action-icon--clear"
            >
              <XmarkIcon />
            </span>
          </button>
        ) : null}
        {showsVisibilityToggle ? (
          <button
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            aria-pressed={isPasswordVisible}
            className="rshb-legacy-input-password__visibility-toggle"
            disabled={!canToggleVisibility}
            onClick={handleTogglePasswordVisibility}
            onMouseDown={function (event) {
              event.preventDefault();
            }}
            tabIndex={isInteractive ? 0 : -1}
            type="button"
          >
            <span
              aria-hidden="true"
              className="rshb-legacy-input-password__action-icon rshb-legacy-input-password__action-icon--visibility"
            >
              {isPasswordVisible ? <EyeIcon /> : <EyeSlashIcon />}
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
