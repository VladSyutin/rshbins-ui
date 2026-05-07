import React, { useEffect, useState } from 'react';
import InputText from '../input-text/index.js';
import './styles.css';

const INN_MAX_DIGITS = 12;
const INN_REQUIRED_ERROR = 'Обязательно для заполнения';
const INN_LENGTH_ERROR = 'ИНН должен содержать 10 или 12 цифр.';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function sanitizeInnValue(value) {
  return String(value).replace(/\D/g, '').slice(0, INN_MAX_DIGITS);
}

function validateInn(value) {
  if (value.length === 0) {
    return INN_REQUIRED_ERROR;
  }

  return value.length === 10 || value.length === 12 ? undefined : INN_LENGTH_ERROR;
}

export default function InputInn(props) {
  const {
    className,
    defaultValue,
    helperText,
    invalid,
    label,
    onBlur,
    onChange,
    onValueChange,
    value,
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(function () {
    return sanitizeInnValue(defaultValue != null ? defaultValue : '');
  });
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled ? sanitizeInnValue(value != null ? value : '') : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateInn(resolvedValue) : undefined;

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
    const sanitizedValue = sanitizeInnValue(nextValue);

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
      className={joinClassNames('rshb-legacy-input-inn', className)}
      helperText={validationMessage || helperText}
      inputMode="numeric"
      invalid={Boolean(invalid) || validationMessage !== undefined}
      label={label != null ? label : 'ИНН'}
      maxLength={INN_MAX_DIGITS}
      onBlur={handleBlur}
      onChange={handleChange}
      onValueChange={updateValue}
      type="text"
      value={resolvedValue}
    />
  );
}
