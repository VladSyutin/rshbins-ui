import React, { useEffect, useState } from 'react';
import './styles.css';
import Segment from '../segment/index.js';

let idCounter = 0;

function generateGroupName() {
  return 'rshb-legacy-segmented-control-' + (++idCounter);
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

export default function SegmentedControl(props) {
  const {
    className,
    defaultValue,
    disabled,
    name,
    onChange,
    options,
    required,
    role,
    value,
    ...rest
  } = props;

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
      aria-orientation="horizontal"
      aria-required={resolvedRequired || undefined}
      className={joinClassNames('rshb-legacy-segmented-control', className)}
      role={role !== undefined ? role : 'radiogroup'}
    >
      {options.map(function (option, index) {
        return (
          <Segment
            checked={option.value === resolvedValue}
            className="rshb-legacy-segmented-control__item"
            disabled={resolvedDisabled || option.disabled}
            id={option.id != null ? option.id : resolvedName + '-' + (index + 1)}
            key={option.id != null ? option.id : option.value}
            label={option.label}
            leadingIcon={option.leadingIcon}
            name={resolvedName}
            onChange={function (event) {
              handleOptionChange(option.value, event);
            }}
            required={resolvedRequired}
            trailingIcon={option.trailingIcon}
            value={option.value}
          />
        );
      })}
    </div>
  );
}
