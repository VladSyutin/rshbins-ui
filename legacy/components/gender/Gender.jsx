import React, { useEffect, useState } from 'react';
import './styles.css';
import GenderItem from '../gender-item/index.js';

var idCounter = 0;

function generateGroupName() {
  return 'rshb-legacy-gender-' + (++idCounter);
}

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

export default function Gender(props) {
  const {
    className,
    defaultValue,
    disabled,
    femaleLabel,
    invalid,
    maleLabel,
    name,
    onChange,
    required,
    role,
    value,
    ...rest
  } = props;

  const resolvedDisabled = Boolean(disabled);
  const resolvedInvalid = Boolean(invalid);
  const resolvedRequired = Boolean(required);
  const resolvedFemaleLabel = femaleLabel !== undefined ? femaleLabel : 'Жен';
  const resolvedMaleLabel = maleLabel !== undefined ? maleLabel : 'Муж';

  const [generatedName] = useState(generateGroupName);
  const resolvedName = name !== undefined ? name : generatedName;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);

  useEffect(function () {
    if (!isControlled) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const resolvedValue = isControlled ? value : internalValue;
  const showInvalid = resolvedInvalid && resolvedValue === undefined;

  function handleItemChange(nextValue, event) {
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
      aria-invalid={showInvalid || undefined}
      className={joinClassNames('rshb-legacy-gender', className)}
      role={role !== undefined ? role : 'radiogroup'}
    >
      <GenderItem
        checked={resolvedValue === 'male'}
        disabled={resolvedDisabled}
        grouped
        invalid={showInvalid}
        label={resolvedMaleLabel}
        name={resolvedName}
        onChange={function (event) { handleItemChange('male', event); }}
        position="left"
        required={resolvedRequired}
        value="male"
      />
      <GenderItem
        checked={resolvedValue === 'female'}
        disabled={resolvedDisabled}
        grouped
        invalid={showInvalid}
        label={resolvedFemaleLabel}
        name={resolvedName}
        onChange={function (event) { handleItemChange('female', event); }}
        position="right"
        required={resolvedRequired}
        value="female"
      />
    </div>
  );
}
