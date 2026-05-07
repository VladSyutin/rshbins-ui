import React, { useEffect, useState } from 'react';
import InputText from '../input-text/index.js';
import './styles.css';

const SURNAME_REQUIRED_ERROR = 'Обязательно для заполнения';
const SURNAME_BRACKETS_ERROR = 'Скобки должны быть парными.';
const SURNAME_ALLOWED_CHARACTER_PATTERN = /^[А-Яа-яЁё.\-’,() ]$/;
const SURNAME_LETTER_PATTERN = /^[А-Яа-яЁё]$/;
const SURNAME_SEPARATOR_PATTERN = /^[.\-’,() ]$/;
const SURNAME_TRAILING_FORBIDDEN_PATTERN = /^[.\-’, ]$/;

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function formatFirstLetter(value) {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toLocaleUpperCase('ru-RU') + value.slice(1);
}

function sanitizeSurnameValue(value) {
  let sanitizedValue = '';
  const input = String(value);

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (!SURNAME_ALLOWED_CHARACTER_PATTERN.test(character)) {
      continue;
    }

    const previousCharacter = sanitizedValue.charAt(sanitizedValue.length - 1);

    if (sanitizedValue.length === 0 && !SURNAME_LETTER_PATTERN.test(character)) {
      continue;
    }

    if (
      previousCharacter &&
      SURNAME_SEPARATOR_PATTERN.test(previousCharacter) &&
      SURNAME_SEPARATOR_PATTERN.test(character)
    ) {
      continue;
    }

    sanitizedValue += character;
  }

  return formatFirstLetter(sanitizedValue);
}

function normalizeSurnameOnBlur(value) {
  let normalizedValue = sanitizeSurnameValue(value);

  while (
    normalizedValue.length > 0 &&
    SURNAME_TRAILING_FORBIDDEN_PATTERN.test(
      normalizedValue.charAt(normalizedValue.length - 1)
    )
  ) {
    normalizedValue = normalizedValue.slice(0, -1);
  }

  return normalizedValue;
}

function hasPairedBrackets(value) {
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (character === '(') {
      depth += 1;
    }

    if (character === ')') {
      depth -= 1;
    }

    if (depth < 0) {
      return false;
    }
  }

  return depth === 0;
}

function validateSurname(value) {
  if (value.length === 0) {
    return SURNAME_REQUIRED_ERROR;
  }

  if (!hasPairedBrackets(value)) {
    return SURNAME_BRACKETS_ERROR;
  }

  return undefined;
}

export function isSurnameValueValid(value) {
  return validateSurname(normalizeSurnameOnBlur(value)) === undefined;
}

export default function InputSurname(props) {
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
    return sanitizeSurnameValue(defaultValue != null ? defaultValue : '');
  });
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const resolvedValue = isControlled
    ? sanitizeSurnameValue(value != null ? value : '')
    : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateSurname(resolvedValue) : undefined;

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
    const sanitizedValue = sanitizeSurnameValue(nextValue);

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
    const normalizedValue = normalizeSurnameOnBlur(resolvedValue);

    if (normalizedValue !== resolvedValue) {
      if (!isControlled) {
        setUncontrolledValue(normalizedValue);
      }

      if (onValueChange) {
        onValueChange(normalizedValue);
      }
    }

    setHasBeenValidated(true);

    if (onBlur) {
      onBlur(event);
    }
  }

  return (
    <InputText
      {...rest}
      className={joinClassNames('rshb-legacy-input-surname', className)}
      helperText={validationMessage || helperText}
      inputMode="text"
      invalid={Boolean(invalid) || validationMessage !== undefined}
      label={label != null ? label : 'Фамилия'}
      onBlur={handleBlur}
      onChange={handleChange}
      onValueChange={updateValue}
      type="text"
      value={resolvedValue}
    />
  );
}
