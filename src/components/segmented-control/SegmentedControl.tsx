import { useEffect, useId, useState, type ChangeEvent, type HTMLAttributes, type ReactNode } from 'react';
import './SegmentedControl.scss';
import { Segment } from '../segment/Segment';

export interface SegmentedControlOption {
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  value: string;
}

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  options: SegmentedControlOption[];
  required?: boolean;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function resolveSelectedValue(options: SegmentedControlOption[], candidate?: string): string | undefined {
  if (candidate && options.some((option) => option.value === candidate)) {
    return candidate;
  }

  return options[0]?.value;
}

/**
 * Horizontal single-select segmented control composed from token-driven Segment items.
 */
export function SegmentedControl({
  className,
  defaultValue,
  disabled = false,
  name,
  onChange,
  options,
  required = false,
  value,
  ...props
}: SegmentedControlProps) {
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

  const resolvedName = name ?? `segmented-control-${generatedName}`;
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
      aria-orientation="horizontal"
      aria-required={required || undefined}
      className={joinClassNames('rshb-segmented-control', className)}
      role={props.role ?? 'radiogroup'}
    >
      {options.map((option, index) => (
        <Segment
          checked={option.value === resolvedValue}
          className="rshb-segmented-control__item"
          disabled={disabled || option.disabled}
          id={option.id ?? `${resolvedName}-${index + 1}`}
          key={option.id ?? option.value}
          label={option.label}
          leadingIcon={option.leadingIcon}
          name={resolvedName}
          onChange={(event) => handleOptionChange(option.value, event)}
          required={required}
          trailingIcon={option.trailingIcon}
          value={option.value}
        />
      ))}
    </div>
  );
}
