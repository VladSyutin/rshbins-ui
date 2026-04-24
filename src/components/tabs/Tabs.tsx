import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode
} from 'react';
import './Tabs.scss';
import { Tab } from '../tab/Tab';

export type TabsActivationMode = 'automatic' | 'manual';
export type TabsChangeEvent = KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>;

export interface TabsOption {
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  leadingIcon?: ReactNode;
  panelId?: string;
  trailingIcon?: ReactNode;
  value: string;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  activationMode?: TabsActivationMode;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string, event: TabsChangeEvent) => void;
  options: TabsOption[];
  tabProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled' | 'role'>;
  value?: string;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function resolveSelectedValue(options: TabsOption[], candidate?: string): string | undefined {
  if (candidate && options.some((option) => option.value === candidate)) {
    return candidate;
  }

  return options.find((option) => !option.disabled)?.value ?? options[0]?.value;
}

function getEnabledIndexes(options: TabsOption[], disabled: boolean): number[] {
  if (disabled) {
    return [];
  }

  return options.reduce<number[]>((indexes, option, index) => {
    if (!option.disabled) {
      indexes.push(index);
    }

    return indexes;
  }, []);
}

function getNextIndex(indexes: number[], currentIndex: number, direction: 1 | -1): number | undefined {
  if (indexes.length === 0) {
    return undefined;
  }

  const enabledPosition = indexes.includes(currentIndex) ? indexes.indexOf(currentIndex) : 0;
  const nextPosition = (enabledPosition + direction + indexes.length) % indexes.length;

  return indexes[nextPosition];
}

/**
 * Horizontal tab list composed from Figma-matched Tab items.
 */
export function Tabs({
  activationMode = 'automatic',
  className,
  defaultValue,
  disabled = false,
  onChange,
  onKeyDown,
  options,
  tabProps,
  value,
  ...props
}: TabsProps) {
  const generatedId = useId().replace(/:/g, '');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(() =>
    resolveSelectedValue(options, defaultValue)
  );

  useEffect(() => {
    if (!isControlled) {
      setInternalValue((currentValue) => resolveSelectedValue(options, defaultValue ?? currentValue));
    }
  }, [defaultValue, isControlled, options]);

  const resolvedValue = resolveSelectedValue(options, isControlled ? value : internalValue);
  const enabledIndexes = getEnabledIndexes(options, disabled);

  function selectTab(nextValue: string, event: TabsChangeEvent) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue, event);
  }

  function focusTab(index: number, event: KeyboardEvent<HTMLDivElement>) {
    const option = options[index];

    tabRefs.current[index]?.focus();

    if (activationMode === 'automatic' && option && option.value !== resolvedValue) {
      selectTab(option.value, event as unknown as KeyboardEvent<HTMLButtonElement>);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const focusedIndex = tabRefs.current.findIndex((node) => node === event.target);
    const activeIndex =
      focusedIndex >= 0 ? focusedIndex : options.findIndex((option) => option.value === resolvedValue);
    let nextIndex: number | undefined;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = getNextIndex(enabledIndexes, activeIndex, 1);
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = getNextIndex(enabledIndexes, activeIndex, -1);
    }

    if (event.key === 'Home') {
      nextIndex = enabledIndexes[0];
    }

    if (event.key === 'End') {
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    }

    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    focusTab(nextIndex, event);
  }

  return (
    <div
      {...props}
      aria-disabled={disabled || undefined}
      aria-orientation="horizontal"
      className={joinClassNames('rshb-tabs', className)}
      onKeyDown={handleKeyDown}
      role={props.role ?? 'tablist'}
    >
      {options.map((option, index) => {
        const selected = option.value === resolvedValue;
        const tabId = option.id ?? `tabs-${generatedId}-${index + 1}`;

        return (
          <Tab
            {...tabProps}
            aria-controls={option.panelId}
            className={joinClassNames('rshb-tabs__item', tabProps?.className)}
            disabled={disabled || option.disabled}
            id={tabId}
            key={option.id ?? option.value}
            label={option.label}
            leadingIcon={option.leadingIcon}
            onClick={(event) => {
              tabProps?.onClick?.(event);

              if (!event.defaultPrevented && !disabled && !option.disabled) {
                selectTab(option.value, event);
              }
            }}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            selected={selected}
            tabIndex={selected ? 0 : -1}
            trailingIcon={option.trailingIcon}
          />
        );
      })}
    </div>
  );
}
