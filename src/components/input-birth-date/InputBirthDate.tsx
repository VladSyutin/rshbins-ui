import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type CSSProperties,
  type FormEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import type { InputTextPreviewState } from '../input-text/InputText';
import { Calendar } from '../calendar/Calendar';
import { runtimeTokenData } from '../../theme/runtimeTokens';
import './InputBirthDate.scss';
import calendarIconUrl from '../../../icons/calendar.svg';
import circleExclamationFillIconUrl from '../../../icons/circle-exclamation-fill.svg';
import xmarkIconUrl from '../../../icons/xmark.svg';

const DATE_MASK = 'дд.мм.гггг';
const DATE_MAX_DIGITS = 8;
const DESKTOP_BREAKPOINT_PX = Number.parseInt(runtimeTokenData.primitive.breakpoint.m, 10);
const MIN_AGE_YEARS = 18;
const MAX_AGE_YEARS = 100;
const DATE_REQUIRED_ERROR = 'Обязательно для заполнения.';
const DATE_OUT_OF_RANGE_ERROR = `Возраст должен быть от ${MIN_AGE_YEARS} до ${MAX_AGE_YEARS} лет.`;

type InputBirthDateIconStyle = CSSProperties & {
  '--rshb-input-birth-date-icon-url': string;
};

type PickerMode = 'auto' | 'desktop' | 'native';

export interface InputBirthDateProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'defaultValue' | 'onChange' | 'prefix' | 'size' | 'type' | 'value'
  > {
  className?: string;
  clearable?: boolean;
  defaultValue?: Date;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  invalid?: boolean;
  label?: ReactNode;
  onValueChange?: (value: Date | undefined) => void;
  pickerMode?: PickerMode;
  previewState?: InputTextPreviewState;
  showHelperIcon?: boolean;
  value?: Date;
}

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function normalizeDate(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function shiftDateByYears(value: Date, years: number): Date {
  const normalizedValue = normalizeDate(value);
  const nextYear = normalizedValue.getFullYear() + years;
  const nextMonth = normalizedValue.getMonth();
  const nextDay = Math.min(normalizedValue.getDate(), getDaysInMonth(nextYear, nextMonth));

  return new Date(nextYear, nextMonth, nextDay);
}

function getAllowedDateRange(today: Date): { maxDate: Date; minDate: Date } {
  return {
    maxDate: shiftDateByYears(today, -MIN_AGE_YEARS),
    minDate: shiftDateByYears(today, -MAX_AGE_YEARS)
  };
}

function padDateSegment(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateValue(value: Date): string {
  const normalizedValue = normalizeDate(value);

  return `${padDateSegment(normalizedValue.getDate())}.${padDateSegment(normalizedValue.getMonth() + 1)}.${normalizedValue.getFullYear()}`;
}

function formatDateDigits(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, DATE_MAX_DIGITS);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

function getDateDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, DATE_MAX_DIGITS);
}

function formatDateToDigits(value: Date): string {
  const normalizedValue = normalizeDate(value);

  return `${padDateSegment(normalizedValue.getDate())}${padDateSegment(normalizedValue.getMonth() + 1)}${normalizedValue.getFullYear()}`;
}

function buildDateMask(value: string): string {
  const formattedValue = formatDateDigits(value);

  return `${formattedValue}${DATE_MASK.slice(formattedValue.length)}`;
}

function parseDateDigits(value: string): Date | null {
  if (value.length !== DATE_MAX_DIGITS) {
    return null;
  }

  const day = Number.parseInt(value.slice(0, 2), 10);
  const month = Number.parseInt(value.slice(2, 4), 10);
  const year = Number.parseInt(value.slice(4, 8), 10);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    month < 1 ||
    month > 12 ||
    day < 1
  ) {
    return null;
  }

  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return normalizeDate(parsedDate);
}

function isDateWithinRange(value: Date, minDate: Date, maxDate: Date): boolean {
  const normalizedValue = normalizeDate(value);

  return normalizedValue >= minDate && normalizedValue <= maxDate;
}

function isBirthDateDigitsValid(value: string, minDate: Date, maxDate: Date): boolean {
  const parsedDate = parseDateDigits(value);

  return parsedDate !== null && isDateWithinRange(parsedDate, minDate, maxDate);
}

function validateBirthDateDigits(value: string, minDate: Date, maxDate: Date): string | undefined {
  if (value.length === 0) {
    return DATE_REQUIRED_ERROR;
  }

  const parsedDate = parseDateDigits(value);

  if (!parsedDate) {
    return '';
  }

  return isDateWithinRange(parsedDate, minDate, maxDate)
    ? undefined
    : DATE_OUT_OF_RANGE_ERROR;
}

export function isBirthDateValueValid(value: Date | undefined): boolean {
  if (!value) {
    return false;
  }

  const allowedDateRange = getAllowedDateRange(normalizeDate(new Date()));

  return isDateWithinRange(value, allowedDateRange.minDate, allowedDateRange.maxDate);
}

function isAllowedDayPrefix(prefix: string): boolean {
  if (prefix.length === 0) {
    return true;
  }

  if (prefix.length === 1) {
    return ['0', '1', '2', '3'].includes(prefix);
  }

  const day = Number.parseInt(prefix, 10);

  return day >= 1 && day <= 31;
}

function isAllowedMonthPrefix(prefix: string): boolean {
  if (prefix.length === 0) {
    return true;
  }

  if (prefix.length === 1) {
    return ['0', '1'].includes(prefix);
  }

  const month = Number.parseInt(prefix, 10);

  return month >= 1 && month <= 12;
}

function canYearPrefixBeCompleted(prefix: string, minYear: number, maxYear: number): boolean {
  if (prefix.length === 0) {
    return true;
  }

  const rangeStart = Number.parseInt(prefix.padEnd(4, '0'), 10);
  const rangeEnd = Number.parseInt(prefix.padEnd(4, '9'), 10);

  return rangeEnd >= minYear && rangeStart <= maxYear;
}

function sanitizeDateDigits(value: string, minDate: Date, maxDate: Date): string {
  const rawDigits = getDateDigits(value);
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();
  let nextDigits = '';

  for (const digit of rawDigits) {
    const candidateDigits = `${nextDigits}${digit}`;
    const dayPrefix = candidateDigits.slice(0, Math.min(2, candidateDigits.length));
    const monthPrefix = candidateDigits.length > 2 ? candidateDigits.slice(2, Math.min(4, candidateDigits.length)) : '';
    const yearPrefix = candidateDigits.length > 4 ? candidateDigits.slice(4) : '';

    if (!isAllowedDayPrefix(dayPrefix)) {
      break;
    }

    if (!isAllowedMonthPrefix(monthPrefix)) {
      break;
    }

    if (!canYearPrefixBeCompleted(yearPrefix, minYear, maxYear)) {
      break;
    }

    if (candidateDigits.length === DATE_MAX_DIGITS) {
      const parsedDate = parseDateDigits(candidateDigits);

      if (!parsedDate || !isDateWithinRange(parsedDate, minDate, maxDate)) {
        break;
      }
    }

    nextDigits = candidateDigits;
  }

  return nextDigits;
}

function toNativeInputValue(value: Date | undefined): string {
  if (!value) {
    return '';
  }

  const normalizedValue = normalizeDate(value);
  const year = normalizedValue.getFullYear();
  const month = padDateSegment(normalizedValue.getMonth() + 1);
  const day = padDateSegment(normalizedValue.getDate());

  return `${year}-${month}-${day}`;
}

function fromNativeInputValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [yearString, monthString, dayString] = value.split('-');

  if (!yearString || !monthString || !dayString) {
    return null;
  }

  const year = Number.parseInt(yearString, 10);
  const month = Number.parseInt(monthString, 10);
  const day = Number.parseInt(dayString, 10);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day)
  ) {
    return null;
  }

  return normalizeDate(new Date(year, month - 1, day));
}

function resolveInteractiveState({
  disabled,
  hasKeyboardFocus,
  invalid,
  isFocused,
  value
}: {
  disabled: boolean;
  hasKeyboardFocus: boolean;
  invalid: boolean;
  isFocused: boolean;
  value: string;
}): InputTextPreviewState {
  const hasValue = value.length > 0;

  if (disabled) {
    return hasValue ? 'disabled-entered' : 'disabled';
  }

  if (isFocused) {
    if (hasKeyboardFocus && !hasValue) {
      return 'keyboard-focused';
    }

    return hasValue ? 'typing' : 'focused';
  }

  if (invalid) {
    return hasValue ? 'error-entered' : 'error';
  }

  return hasValue ? 'entered' : 'default';
}

function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return window.innerWidth >= DESKTOP_BREAKPOINT_PX;
}

export function InputBirthDate({
  className,
  clearable = true,
  defaultValue,
  disabled = false,
  helperIcon,
  helperText,
  id,
  invalid = false,
  label = 'Дата рождения',
  max,
  min,
  onBlur,
  onFocus,
  onKeyDown,
  onPaste,
  onPointerDown,
  onValueChange,
  pickerMode = 'auto',
  previewState,
  readOnly,
  showHelperIcon = false,
  value,
  ...props
}: InputBirthDateProps) {
  const today = useMemo(() => normalizeDate(new Date()), []);
  const allowedDateRange = useMemo(() => getAllowedDateRange(today), [today]);
  const generatedId = useId();
  const helperId = useId();
  const inputId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    defaultValue ? formatDateToDigits(defaultValue) : ''
  );
  const [uncontrolledSelectedDate, setUncontrolledSelectedDate] = useState<Date | undefined>(() =>
    defaultValue ? normalizeDate(defaultValue) : undefined
  );
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    pickerMode === 'auto' ? isDesktopViewport() : pickerMode === 'desktop'
  );
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const nativeInputRef = useRef<HTMLInputElement | null>(null);
  const keyboardFocusCandidateRef = useRef(false);

  const resolvedSelectedDate = isControlled ? normalizeDate(value as Date) : uncontrolledSelectedDate;
  const resolvedValue = isControlled && value ? formatDateToDigits(value) : uncontrolledValue;
  const validationMessage = hasBeenValidated
    ? validateBirthDateDigits(resolvedValue, allowedDateRange.minDate, allowedDateRange.maxDate)
    : undefined;
  const resolvedInvalid = invalid || validationMessage !== undefined;
  const resolvedReadOnly = readOnly ?? (isControlled && onValueChange === undefined);
  const isInteractive = previewState === undefined;
  const resolvedPickerMode = pickerMode === 'auto' ? (isDesktop ? 'desktop' : 'native') : pickerMode;
  const visualState = isInteractive
    ? resolveInteractiveState({
        disabled,
        hasKeyboardFocus,
        invalid: resolvedInvalid,
        isFocused,
        value: resolvedValue
      })
    : previewState;
  const isEnteredState =
    visualState === 'entered' ||
    visualState === 'entered-hover' ||
    visualState === 'typing' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover' ||
    visualState === 'disabled-entered';
  const isFocusedState =
    visualState === 'focused' ||
    visualState === 'typing' ||
    visualState === 'keyboard-focused';
  const isErrorState =
    visualState === 'error' ||
    visualState === 'error-hover' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover';
  const resolvedHelperText = isErrorState ? validationMessage || helperText : undefined;
  const formattedValue = formatDateDigits(resolvedValue);
  const maskValue = buildDateMask(resolvedValue);
  const nativeInputValue = toNativeInputValue(resolvedSelectedDate);
  const displayedValue = resolvedPickerMode === 'native' && resolvedSelectedDate ? formatDateValue(resolvedSelectedDate) : formattedValue;
  const shouldFloatLabel = isEnteredState || isFocusedState;
  const shouldShowMask =
    shouldFloatLabel &&
    !(resolvedPickerMode === 'native' && resolvedSelectedDate);
  const showsClearControl =
    clearable &&
    !disabled &&
    !resolvedReadOnly &&
    (isInteractive ? isFocused && resolvedValue.length > 0 : visualState === 'typing');
  const describedBy = resolvedHelperText ? helperId : props['aria-describedby'];

  const calendarIconStyle = useMemo(
    () =>
      ({
        '--rshb-input-birth-date-icon-url': `url("${calendarIconUrl}")`
      }) as InputBirthDateIconStyle,
    []
  );
  const helperIconStyle = useMemo(
    () =>
      ({
        '--rshb-input-birth-date-icon-url': `url("${circleExclamationFillIconUrl}")`
      }) as InputBirthDateIconStyle,
    []
  );
  const clearIconStyle = useMemo(
    () =>
      ({
        '--rshb-input-birth-date-icon-url': `url("${xmarkIconUrl}")`
      }) as InputBirthDateIconStyle,
    []
  );

  useEffect(() => {
    if (pickerMode !== 'auto' || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT_PX}px)`);

    function handleMediaChange(event: MediaQueryListEvent) {
      setIsDesktop(event.matches);
    }

    setIsDesktop(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleMediaChange);

      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
      };
    }

    mediaQuery.addListener(handleMediaChange);

    return () => {
      mediaQuery.removeListener(handleMediaChange);
    };
  }, [pickerMode]);

  useEffect(() => {
    if (!isDesktop || !isCalendarOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!fieldRef.current?.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }

    function handleKeyEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsCalendarOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyEscape);
    };
  }, [isCalendarOpen, isDesktop]);

  useEffect(() => {
    if (resolvedPickerMode === 'desktop') {
      return;
    }

    setIsCalendarOpen(false);
  }, [resolvedPickerMode]);

  function emitValue(nextDate: Date | undefined) {
    onValueChange?.(nextDate ? normalizeDate(nextDate) : undefined);
  }

  function updateDesktopValue(nextRawValue: string) {
    const nextDigits = sanitizeDateDigits(
      nextRawValue,
      allowedDateRange.minDate,
      allowedDateRange.maxDate
    );
    const parsedDate = parseDateDigits(nextDigits);

    if (!isControlled) {
      setUncontrolledValue(nextDigits);

      if (nextDigits.length === 0) {
        setUncontrolledSelectedDate(undefined);
      } else if (parsedDate) {
        setUncontrolledSelectedDate(parsedDate);
      }
    }

    if (nextDigits.length === 0) {
      emitValue(undefined);
      return;
    }

    if (parsedDate) {
      emitValue(parsedDate);
    }
  }

  function updateNativeValue(nextDate: Date | undefined) {
    const normalizedNextDate = nextDate ? normalizeDate(nextDate) : undefined;

    if (!isControlled) {
      setUncontrolledSelectedDate(normalizedNextDate);
      setUncontrolledValue(normalizedNextDate ? formatDateToDigits(normalizedNextDate) : '');
    }

    emitValue(normalizedNextDate);
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    setHasKeyboardFocus(keyboardFocusCandidateRef.current && event.currentTarget.matches(':focus-visible'));
    onFocus?.(event);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const nextTarget = event.relatedTarget as Node | null;

    if (nextTarget && fieldRef.current?.contains(nextTarget)) {
      return;
    }

    setIsFocused(false);
    setHasKeyboardFocus(false);
    setHasBeenValidated(true);
    onBlur?.(event);
  }

  function handleDesktopChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isInteractive || disabled || resolvedReadOnly) {
      return;
    }

    updateDesktopValue(event.target.value);
  }

  function handleDesktopPaste(event: ClipboardEvent<HTMLInputElement>) {
    if (!isInteractive || disabled || resolvedReadOnly) {
      onPaste?.(event);
      return;
    }

    event.preventDefault();
    updateDesktopValue(event.clipboardData.getData('text'));
    onPaste?.(event);
  }

  function handleDesktopKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    keyboardFocusCandidateRef.current = event.key === 'Tab';

    if (!isInteractive || disabled || resolvedReadOnly) {
      onKeyDown?.(event);
      return;
    }

    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'Escape'
    ];

    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
      onKeyDown?.(event);
      return;
    }

    if (event.key === 'Escape') {
      setIsCalendarOpen(false);
    }

    onKeyDown?.(event);
  }

  function handleNativeChange(event: ChangeEvent<HTMLInputElement>) {
    const parsedDate = fromNativeInputValue(event.target.value);

    updateNativeValue(parsedDate ?? undefined);
  }

  function handleNativeInput(event: FormEvent<HTMLInputElement>) {
    const parsedDate = fromNativeInputValue(event.currentTarget.value);

    updateNativeValue(parsedDate ?? undefined);
  }

  function handleClear() {
    if (resolvedPickerMode === 'native') {
      updateNativeValue(undefined);
      nativeInputRef.current?.focus();
      return;
    }

    updateDesktopValue('');
    desktopInputRef.current?.focus();
  }

  function focusInput() {
    if (disabled) {
      return;
    }

    if (resolvedPickerMode === 'native') {
      nativeInputRef.current?.focus();
      (nativeInputRef.current as HTMLInputElement & { showPicker?: () => void } | null)?.showPicker?.();
      return;
    }

    desktopInputRef.current?.focus();
  }

  function handleCalendarButtonClick() {
    if (disabled || resolvedReadOnly) {
      return;
    }

    if (resolvedPickerMode === 'native') {
      nativeInputRef.current?.focus();
      (nativeInputRef.current as HTMLInputElement & { showPicker?: () => void } | null)?.showPicker?.();
      nativeInputRef.current?.click();
      return;
    }

    desktopInputRef.current?.focus();
    setIsCalendarOpen((currentValue) => !currentValue);
  }

  function handleCalendarChange(nextDate: Date) {
    updateNativeValue(nextDate);
    setIsCalendarOpen(false);
    desktopInputRef.current?.focus();
  }

  return (
    <div
      className={joinClassNames('rshb-input-birth-date', className)}
      data-calendar-open={isCalendarOpen ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-has-helper={resolvedHelperText ? 'true' : 'false'}
      data-picker-mode={resolvedPickerMode}
      data-state={visualState}
      ref={fieldRef}
    >
      <div className="rshb-input-birth-date__field">
        <div className="rshb-input-birth-date__content">
          <label className="rshb-input-birth-date__label" htmlFor={inputId}>
            {label}
          </label>
          <div className="rshb-input-birth-date__value-row">
            <div className="rshb-input-birth-date__input-shell">
              {resolvedPickerMode === 'native' ? (
                <>
                  <input
                    {...props}
                    aria-describedby={describedBy}
                    aria-invalid={resolvedInvalid || undefined}
                    className="rshb-input-birth-date__native-input"
                  disabled={disabled}
                  id={inputId}
                  onBlur={handleBlur}
                  onChange={handleNativeChange}
                  onFocus={handleFocus}
                  onInput={handleNativeInput}
                  onKeyDown={(event) => {
                    keyboardFocusCandidateRef.current = event.key === 'Tab';
                    onKeyDown?.(event);
                    }}
                    onPointerDown={(event) => {
                      keyboardFocusCandidateRef.current = false;
                      onPointerDown?.(event);
                    }}
                    readOnly={!isInteractive || resolvedReadOnly}
                    ref={nativeInputRef}
                    type="date"
                    value={nativeInputValue}
                  />
                  {resolvedSelectedDate ? (
                    <span aria-hidden="true" className="rshb-input-birth-date__control">
                      {displayedValue}
                    </span>
                  ) : null}
                </>
              ) : (
                <input
                  {...props}
                  aria-describedby={describedBy}
                  aria-invalid={resolvedInvalid || undefined}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  className="rshb-input-birth-date__control"
                  disabled={disabled}
                  id={inputId}
                  inputMode="numeric"
                  maxLength={10}
                  onBlur={handleBlur}
                  onChange={handleDesktopChange}
                  onFocus={handleFocus}
                  onKeyDown={handleDesktopKeyDown}
                  onPaste={handleDesktopPaste}
                  onPointerDown={(event) => {
                    keyboardFocusCandidateRef.current = false;
                    onPointerDown?.(event);
                  }}
                  pattern="[0-9.]*"
                  placeholder={undefined}
                  readOnly={!isInteractive || resolvedReadOnly}
                  ref={desktopInputRef}
                  spellCheck={false}
                  type="text"
                  value={displayedValue}
                />
              )}
              {shouldShowMask ? (
                <span aria-hidden="true" className="rshb-input-birth-date__mask">
                  {resolvedPickerMode === 'native' && !resolvedSelectedDate ? DATE_MASK : maskValue}
                </span>
              ) : null}
            </div>
          </div>
          {!shouldFloatLabel ? (
            <button
              aria-label="Активировать поле даты"
              className="rshb-input-birth-date__activator"
              onClick={focusInput}
              onPointerDown={() => {
                keyboardFocusCandidateRef.current = false;
              }}
              tabIndex={-1}
              type="button"
            />
          ) : null}
        </div>
        {showsClearControl ? (
          <button
            aria-label="Очистить поле"
            className="rshb-input-birth-date__action-button"
            onClick={handleClear}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            tabIndex={-1}
            type="button"
          >
            <span
              aria-hidden="true"
              className="rshb-input-birth-date__action-icon rshb-input-birth-date__action-icon--clear"
              style={clearIconStyle}
            />
          </button>
        ) : null}
        <button
          aria-expanded={resolvedPickerMode === 'desktop' ? isCalendarOpen : undefined}
          aria-haspopup={resolvedPickerMode === 'desktop' ? 'dialog' : undefined}
          aria-label="Открыть календарь"
          className="rshb-input-birth-date__action-button"
          data-selected={isCalendarOpen ? 'true' : 'false'}
          disabled={disabled || resolvedReadOnly}
          onClick={handleCalendarButtonClick}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          tabIndex={resolvedPickerMode === 'native' ? -1 : 0}
          type="button"
        >
          <span
            aria-hidden="true"
            className="rshb-input-birth-date__action-icon rshb-input-birth-date__action-icon--calendar"
            style={calendarIconStyle}
          />
        </button>
      </div>
      {resolvedHelperText ? (
        <div className="rshb-input-birth-date__helper" id={helperId}>
          {showHelperIcon ? (
            <span aria-hidden="true" className="rshb-input-birth-date__helper-icon-wrapper">
              {helperIcon ?? (
                <span className="rshb-input-birth-date__helper-icon" style={helperIconStyle} />
              )}
            </span>
          ) : null}
          <span className="rshb-input-birth-date__helper-text">{resolvedHelperText}</span>
        </div>
      ) : null}
      {resolvedPickerMode === 'desktop' && isCalendarOpen ? (
        <div className="rshb-input-birth-date__calendar">
          <Calendar
            maxDate={allowedDateRange.maxDate}
            minDate={allowedDateRange.minDate}
            onChange={handleCalendarChange}
            value={resolvedSelectedDate ?? allowedDateRange.maxDate}
          />
        </div>
      ) : null}
    </div>
  );
}
