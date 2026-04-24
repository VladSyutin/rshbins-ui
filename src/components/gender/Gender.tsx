import { useEffect, useId, useState, type ChangeEvent, type HTMLAttributes, type ReactNode } from 'react';
import './Gender.scss';
import { GenderItem } from '../gender-item/GenderItem';

export type GenderValue = 'male' | 'female';

export interface GenderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  defaultValue?: GenderValue;
  disabled?: boolean;
  femaleLabel?: ReactNode;
  invalid?: boolean;
  maleLabel?: ReactNode;
  name?: string;
  onChange?: (value: GenderValue, event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: GenderValue;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Gender selection control composed from two side-specific segmented radio items.
 */
export function Gender({
  className,
  defaultValue,
  disabled = false,
  femaleLabel = 'Жен',
  invalid = false,
  maleLabel = 'Муж',
  name,
  onChange,
  required = false,
  value,
  ...props
}: GenderProps) {
  const generatedName = useId().replace(/:/g, '');
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<GenderValue | undefined>(defaultValue);

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const resolvedName = name ?? `gender-${generatedName}`;
  const resolvedValue = isControlled ? value : internalValue;
  const showInvalid = invalid && resolvedValue === undefined;

  function handleItemChange(nextValue: GenderValue, event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue, event);
  }

  return (
    <div
      {...props}
      aria-invalid={showInvalid || undefined}
      className={joinClassNames('rshb-gender', className)}
      role={props.role ?? 'radiogroup'}
    >
      <GenderItem
        checked={resolvedValue === 'male'}
        disabled={disabled}
        grouped
        invalid={showInvalid}
        label={maleLabel}
        name={resolvedName}
        onChange={(event) => handleItemChange('male', event)}
        position="left"
        required={required}
        value="male"
      />
      <GenderItem
        checked={resolvedValue === 'female'}
        disabled={disabled}
        grouped
        invalid={showInvalid}
        label={femaleLabel}
        name={resolvedName}
        onChange={(event) => handleItemChange('female', event)}
        position="right"
        required={required}
        value="female"
      />
    </div>
  );
}
