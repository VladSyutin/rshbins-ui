import React, { useEffect, useState } from 'react';
import InputText from '../input-text/index.js';
import './styles.css';

const CAPTCHA_REQUIRED_ERROR = 'Обязательно для заполнения';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function sanitizeCaptchaValue(value) {
  return String(value).replace(/\s/g, '');
}

function validateCaptcha(value) {
  return value.length === 0 ? CAPTCHA_REQUIRED_ERROR : undefined;
}

export function isCaptchaValueValid(value) {
  return validateCaptcha(sanitizeCaptchaValue(value)) === undefined;
}

export default function InputCaptcha(props) {
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
    return sanitizeCaptchaValue(defaultValue != null ? defaultValue : '');
  });
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled
    ? sanitizeCaptchaValue(value != null ? value : '')
    : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateCaptcha(resolvedValue) : undefined;

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
    const sanitizedValue = sanitizeCaptchaValue(nextValue);

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
      className={joinClassNames('rshb-legacy-input-captcha', className)}
      helperText={validationMessage || helperText}
      inputMode="text"
      invalid={Boolean(invalid) || validationMessage !== undefined}
      label={label != null ? label : 'Код с картинки'}
      onBlur={handleBlur}
      onChange={handleChange}
      onValueChange={updateValue}
      type="text"
      value={resolvedValue}
    />
  );
}
