import React, { useEffect, useState } from 'react';
import InputText from '../input-text/index.js';
import { cyrillicToLatin } from '../transliterate.js';
import './styles.css';

const EMAIL_MAX_LENGTH = 254;
const EMAIL_LOCAL_MAX_LENGTH = 64;
const EMAIL_REQUIRED_ERROR = 'Обязательно для заполнения';
const EMAIL_AT_SIGN_ERROR = 'Адрес электронной почты должен содержать знак “@”';
const EMAIL_DOMAIN_ERROR =
  'Адрес электронной почты должен содержать доменную часть (например, example.ru)';
const EMAIL_DOMAIN_DOT_ERROR =
  'Адрес электронной почты должен содержать “.” (например, example.ru)';
const EMAIL_ALLOWED_CHARACTER_PATTERN = /^[a-z0-9._+@-]$/;
const EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN = /^[._-]$/;

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function sanitizeEmailValue(value) {
  let sanitizedValue = '';
  let hasAtSign = false;
  let localLength = 0;
  const input = String(value).toLowerCase();

  for (let index = 0; index < input.length; index += 1) {
    const inputCharacter = input[index];

    if (sanitizedValue.length >= EMAIL_MAX_LENGTH) {
      break;
    }

    const rawCharacter = EMAIL_ALLOWED_CHARACTER_PATTERN.test(inputCharacter)
      ? inputCharacter
      : cyrillicToLatin(inputCharacter);

    if (!EMAIL_ALLOWED_CHARACTER_PATTERN.test(rawCharacter)) {
      continue;
    }

    if (rawCharacter === '@') {
      const lastCharacter = sanitizedValue.charAt(sanitizedValue.length - 1);

      if (
        hasAtSign ||
        localLength === 0 ||
        EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN.test(lastCharacter)
      ) {
        continue;
      }

      hasAtSign = true;
      sanitizedValue += rawCharacter;
      continue;
    }

    if (rawCharacter === '.' && sanitizedValue.charAt(sanitizedValue.length - 1) === '.') {
      continue;
    }

    if (!hasAtSign) {
      if (localLength >= EMAIL_LOCAL_MAX_LENGTH) {
        continue;
      }

      if (localLength === 0 && EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN.test(rawCharacter)) {
        continue;
      }

      localLength += 1;
    }

    sanitizedValue += rawCharacter;
  }

  return sanitizedValue;
}

function validateEmail(value) {
  if (value.length === 0) {
    return EMAIL_REQUIRED_ERROR;
  }

  if (value.indexOf('@') === -1) {
    return EMAIL_AT_SIGN_ERROR;
  }

  const domain = value.split('@')[1] || '';

  if (domain.length < 3) {
    return EMAIL_DOMAIN_ERROR;
  }

  if (domain.indexOf('.') === -1 || domain.charAt(0) === '.' || domain.charAt(domain.length - 1) === '.') {
    return EMAIL_DOMAIN_DOT_ERROR;
  }

  return undefined;
}

export function isEmailValueValid(value) {
  return validateEmail(sanitizeEmailValue(value)) === undefined;
}

export default function InputEmail(props) {
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
    return sanitizeEmailValue(defaultValue != null ? defaultValue : '');
  });
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled
    ? sanitizeEmailValue(value != null ? value : '')
    : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateEmail(resolvedValue) : undefined;

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
    const sanitizedValue = sanitizeEmailValue(nextValue);

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
      className={joinClassNames('rshb-legacy-input-email', className)}
      helperText={validationMessage || helperText}
      inputMode="email"
      invalid={Boolean(invalid) || validationMessage !== undefined}
      label={label != null ? label : 'Электронная почта'}
      maxLength={EMAIL_MAX_LENGTH}
      onBlur={handleBlur}
      onChange={handleChange}
      onValueChange={updateValue}
      spellCheck={spellCheck != null ? spellCheck : false}
      type="text"
      value={resolvedValue}
    />
  );
}
