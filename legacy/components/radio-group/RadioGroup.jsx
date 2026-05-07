import React, { useEffect, useState } from 'react';
import './styles.css';
import Radio from '../radio/index.js';

let idCounter = 0;

function generateGroupName() {
  return 'rshb-legacy-radio-group-' + (++idCounter);
}

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function resolveSelectedValue(options, candidate) {
  if (candidate && options.some(function (option) { return option.value === candidate; })) {
    return candidate;
  }

  return options[0] ? options[0].value : undefined;
}

export default function RadioGroup(props) {
  const {
    className,
    defaultValue,
    direction,
    disabled,
    name,
    onChange,
    options,
    required,
    role,
    value,
    ...rest
  } = props;

  const resolvedDirection = direction || 'vertical';
  const resolvedDisabled = Boolean(disabled);
  const resolvedRequired = Boolean(required);
  const [generatedName] = useState(generateGroupName);
  const resolvedName = name !== undefined ? name : generatedName;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(function () {
    return resolveSelectedValue(options, defaultValue);
  });

  useEffect(function () {
    if (!isControlled) {
      setInternalValue(function (currentValue) {
        return resolveSelectedValue(options, defaultValue !== undefined ? defaultValue : currentValue);
      });
    }
  }, [defaultValue, isControlled, options]);

  const resolvedValue = resolveSelectedValue(options, isControlled ? value : internalValue);

  function handleOptionChange(nextValue, event) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    if (onChange) {
      onChange(nextValue, event);
    }
  }

  return (
    <div
      {...rest}
      aria-disabled={resolvedDisabled || undefined}
      aria-orientation={resolvedDirection}
      aria-required={resolvedRequired || undefined}
      className={joinClassNames('rshb-legacy-radio-group', className)}
      data-direction={resolvedDirection}
      role={role !== undefined ? role : 'radiogroup'}
    >
      {options.map(function (option, index) {
        return (
          <Radio
            checked={option.value === resolvedValue}
            className="rshb-legacy-radio-group__item"
            disabled={resolvedDisabled || option.disabled}
            id={option.id != null ? option.id : resolvedName + '-' + (index + 1)}
            key={option.id != null ? option.id : option.value}
            label={option.label}
            name={resolvedName}
            onChange={function (event) {
              handleOptionChange(option.value, event);
            }}
            required={resolvedRequired}
            value={option.value}
          />
        );
      })}
    </div>
  );
}
