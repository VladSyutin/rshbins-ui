import React, { useEffect, useState } from 'react';
import InputText from '../input-text/index.js';
import './styles.css';

const LOGIN_REQUIRED_ERROR = 'Обязательно для заполнения';
const LOGIN_ALLOWED_CHARACTER_PATTERN = /^[A-Za-z0-9._-]$/;
const LOGIN_SEPARATOR_PATTERN = /^[._-]$/;

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function sanitizeLoginValue(value) {
  let sanitizedValue = '';
  const input = String(value);

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (!LOGIN_ALLOWED_CHARACTER_PATTERN.test(character)) {
      continue;
    }

    const previousCharacter = sanitizedValue.charAt(sanitizedValue.length - 1);

    if (
      previousCharacter &&
      LOGIN_SEPARATOR_PATTERN.test(previousCharacter) &&
      LOGIN_SEPARATOR_PATTERN.test(character)
    ) {
      continue;
    }

    sanitizedValue += character;
  }

  return sanitizedValue;
}

function validateLogin(value) {
  return value.length === 0 ? LOGIN_REQUIRED_ERROR : undefined;
}

export default function InputLogin(props) {
  const {
    autoCapitalize,
    autoCorrect,
    className,
    defaultValue,
    helperText,
    invalid,
    label,
    onBlur,
    onChange,
    onValueChange,
    spellCheck,
    value,
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(function () {
    return sanitizeLoginValue(defaultValue != null ? defaultValue : '');
  });
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled
    ? sanitizeLoginValue(value != null ? value : '')
    : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateLogin(resolvedValue) : undefined;

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
    const sanitizedValue = sanitizeLoginValue(nextValue);

    if (!isControlled) {
      setUncontrolledValue(sanitizedValue);
    }

    if (onValueChange) {
      onValueChange(sanitizedValue);
    }
  }

  function handleChange(event) {
    if (onChange) {
      onChange(event);
    }
  }

  function handleBlur(event) {
    setHasBeenValidated(true);

    if (onBlur) {
      onBlur(event);
    }
  }

  return (
    <InputText
      {...rest}
      autoCapitalize={autoCapitalize != null ? autoCapitalize : 'none'}
      autoCorrect={autoCorrect != null ? autoCorrect : 'off'}
      className={joinClassNames('rshb-legacy-input-login', className)}
      helperText={validationMessage || helperText}
      inputMode="email"
      invalid={Boolean(invalid) || validationMessage !== undefined}
      label={label != null ? label : 'Логин'}
      onBlur={handleBlur}
      onChange={handleChange}
      onValueChange={updateValue}
      spellCheck={spellCheck != null ? spellCheck : false}
      type="text"
      value={resolvedValue}
    />
  );
}
