import { useEffect, useId, useState, type ChangeEvent, type HTMLAttributes, type ReactNode } from 'react';
import './RadioGroup.scss';
import { Radio } from '../radio/Radio';

export type RadioGroupDirection = 'vertical' | 'horizontal';

export interface RadioGroupOption {
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  value: string;
}

export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  defaultValue?: string;
  direction?: RadioGroupDirection;
  disabled?: boolean;
  name?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  options: RadioGroupOption[];
  required?: boolean;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function resolveSelectedValue(options: RadioGroupOption[], candidate?: string): string | undefined {
  if (candidate && options.some((option) => option.value === candidate)) {
    return candidate;
  }

  return options[0]?.value;
}

/**
 * Single-select radio list that keeps one option selected to match the Figma interaction contract.
 */
export function RadioGroup({
  className,
  defaultValue,
  direction = 'vertical',
  disabled = false,
  name,
  onChange,
  options,
  required = false,
  value,
  ...props
}: RadioGroupProps) {
  const generatedName = useId().replace(/:/g, '');
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(() =>
    resolveSelectedValue(options, defaultValue)
  );

  useEffect(() => {
    if (!isControlled) {
      setInternalValue((currentValue) => resolveSelectedValue(options, defaultValue ?? currentValue));
    }
  }, [defaultValue, isControlled, options]);

  const resolvedName = name ?? `radio-group-${generatedName}`;
  const resolvedValue = resolveSelectedValue(options, isControlled ? value : internalValue);

  function handleOptionChange(nextValue: string, event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue, event);
  }

  return (
    <div
      {...props}
      aria-disabled={disabled || undefined}
      aria-orientation={direction}
      aria-required={required || undefined}
      className={joinClassNames('rshb-radio-group', className)}
      data-direction={direction}
      role={props.role ?? 'radiogroup'}
    >
      {options.map((option, index) => (
        <Radio
          checked={option.value === resolvedValue}
          className="rshb-radio-group__item"
          disabled={disabled || option.disabled}
          id={option.id ?? `${resolvedName}-${index + 1}`}
          key={option.id ?? option.value}
          label={option.label}
          name={resolvedName}
          onChange={(event) => handleOptionChange(option.value, event)}
          required={required}
          value={option.value}
        />
      ))}
    </div>
  );
}
