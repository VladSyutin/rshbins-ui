import React, { useEffect, useState } from 'react';
import InputText from '../input-text/index.js';
import Switch from '../switch/index.js';
import './styles.css';

const MIDDLE_NAME_REQUIRED_ERROR = 'Обязательно для заполнения';
const MIDDLE_NAME_BRACKETS_ERROR = 'Скобки должны быть парными.';
const MIDDLE_NAME_ALLOWED_CHARACTER_PATTERN = /^[А-Яа-яЁё.\-’,()]$/;
const MIDDLE_NAME_LETTER_PATTERN = /^[А-Яа-яЁё]$/;
const MIDDLE_NAME_SEPARATOR_PATTERN = /^[.\-’,() ]$/;
const MIDDLE_NAME_TRAILING_FORBIDDEN_PATTERN = /^[.\-’, ]$/;

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function formatFirstLetter(value) {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toLocaleUpperCase('ru-RU') + value.slice(1);
}

function sanitizeMiddleNameValue(value) {
  let sanitizedValue = '';
  const input = String(value);

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (!MIDDLE_NAME_ALLOWED_CHARACTER_PATTERN.test(character)) {
      continue;
    }

    const previousCharacter = sanitizedValue.charAt(sanitizedValue.length - 1);

    if (sanitizedValue.length === 0 && !MIDDLE_NAME_LETTER_PATTERN.test(character)) {
      continue;
    }

    if (
      previousCharacter &&
      MIDDLE_NAME_SEPARATOR_PATTERN.test(previousCharacter) &&
      MIDDLE_NAME_SEPARATOR_PATTERN.test(character)
    ) {
      continue;
    }

    sanitizedValue += character;
  }

  return formatFirstLetter(sanitizedValue);
}

function normalizeMiddleNameOnBlur(value) {
  let normalizedValue = sanitizeMiddleNameValue(value);

  while (
    normalizedValue.length > 0 &&
    MIDDLE_NAME_TRAILING_FORBIDDEN_PATTERN.test(
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

function validateMiddleName(value) {
  if (value.length === 0) {
    return MIDDLE_NAME_REQUIRED_ERROR;
  }

  if (!hasPairedBrackets(value)) {
    return MIDDLE_NAME_BRACKETS_ERROR;
  }

  return undefined;
}

export function isMiddleNameValueValid(value) {
  return validateMiddleName(normalizeMiddleNameOnBlur(value)) === undefined;
}

export default function InputMiddleName(props) {
  const {
    className,
    defaultValue,
    defaultWithoutMiddleName,
    disabled,
    helperText,
    invalid,
    onBlur,
    onChange,
    onValueChange,
    onWithoutMiddleNameChange,
    switchLabel,
    value,
    withoutMiddleName,
    ...rest
  } = props;

  const resolvedDefaultWithoutMiddleName = Boolean(defaultWithoutMiddleName);
  const resolvedDisabled = Boolean(disabled);
  const resolvedSwitchLabel = switchLabel != null ? switchLabel : 'Нет отчества';
  const isControlled = withoutMiddleName !== undefined;
  const isValueControlled = value !== undefined;
  const [uncontrolledWithoutMiddleName, setUncontrolledWithoutMiddleName] = useState(
    resolvedDefaultWithoutMiddleName
  );
  const [uncontrolledValue, setUncontrolledValue] = useState(function () {
    return sanitizeMiddleNameValue(defaultValue != null ? defaultValue : '');
  });
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const isWithoutMiddleName = isControlled
    ? Boolean(withoutMiddleName)
    : uncontrolledWithoutMiddleName;
  const resolvedValue = isValueControlled
    ? sanitizeMiddleNameValue(value != null ? value : '')
    : uncontrolledValue;
  const validationMessage =
    hasBeenValidated && !isWithoutMiddleName ? validateMiddleName(resolvedValue) : undefined;

  useEffect(
    function () {
      if (!isControlled) {
        setUncontrolledWithoutMiddleName(resolvedDefaultWithoutMiddleName);
      }
    },
    [isControlled, resolvedDefaultWithoutMiddleName]
  );

  useEffect(
    function () {
      if (!isValueControlled || value === undefined || resolvedValue === value) {
        return;
      }

      if (onValueChange) {
        onValueChange(resolvedValue);
      }
    },
    [isValueControlled, onValueChange, resolvedValue, value]
  );

  function updateValue(nextValue) {
    const sanitizedValue = sanitizeMiddleNameValue(nextValue);

    if (!isValueControlled) {
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
    const normalizedValue = normalizeMiddleNameOnBlur(resolvedValue);

    if (normalizedValue !== resolvedValue) {
      if (!isValueControlled) {
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

  function handleSwitchChange(event) {
    const nextChecked = event.target.checked;

    if (!isControlled) {
      setUncontrolledWithoutMiddleName(nextChecked);
    }

    if (onWithoutMiddleNameChange) {
      onWithoutMiddleNameChange(nextChecked);
    }
  }

  return (
    <div className={joinClassNames('rshb-legacy-input-middle-name', className)}>
      <InputText
        {...rest}
        disabled={resolvedDisabled || isWithoutMiddleName}
        helperText={validationMessage || helperText}
        inputMode="text"
        invalid={Boolean(invalid) || validationMessage !== undefined}
        label="Отчество"
        onBlur={handleBlur}
        onChange={handleChange}
        onValueChange={updateValue}
        type="text"
        value={resolvedValue}
      />
      <Switch
        checked={isWithoutMiddleName}
        className="rshb-legacy-input-middle-name__switch"
        disabled={resolvedDisabled}
        label={resolvedSwitchLabel}
        onChange={handleSwitchChange}
      />
    </div>
  );
}
