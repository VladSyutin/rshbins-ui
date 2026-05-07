import React, { useEffect, useMemo, useRef, useState } from 'react';
import Calendar from '../calendar/index.js';
import './styles.css';

const DESKTOP_BREAKPOINT_PX = 1024;
const DATE_MASK = 'дд.мм.гггг';
const DATE_MAX_DIGITS = 8;
const MIN_AGE_YEARS = 18;
const MAX_AGE_YEARS = 100;
const DATE_REQUIRED_ERROR = 'Обязательно для заполнения.';
const DATE_OUT_OF_RANGE_ERROR = 'Возраст должен быть от ' + MIN_AGE_YEARS + ' до ' + MAX_AGE_YEARS + ' лет.';

let idCounter = 0;

function generateId() {
  return 'rshb-legacy-input-birth-date-' + (++idCounter);
}

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function normalizeDate(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function shiftDateByYears(value, years) {
  const normalizedValue = normalizeDate(value);
  const nextYear = normalizedValue.getFullYear() + years;
  const nextMonth = normalizedValue.getMonth();
  const nextDay = Math.min(normalizedValue.getDate(), getDaysInMonth(nextYear, nextMonth));

  return new Date(nextYear, nextMonth, nextDay);
}

function getAllowedDateRange(today) {
  return {
    maxDate: shiftDateByYears(today, -MIN_AGE_YEARS),
    minDate: shiftDateByYears(today, -MAX_AGE_YEARS)
  };
}

function padDateSegment(value) {
  return String(value).padStart(2, '0');
}

function formatDateValue(value) {
  const normalizedValue = normalizeDate(value);

  return padDateSegment(normalizedValue.getDate()) + '.' + padDateSegment(normalizedValue.getMonth() + 1) + '.' + normalizedValue.getFullYear();
}

function formatDateDigits(value) {
  const digits = value.replace(/\D/g, '').slice(0, DATE_MAX_DIGITS);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return digits.slice(0, 2) + '.' + digits.slice(2);
  }

  return digits.slice(0, 2) + '.' + digits.slice(2, 4) + '.' + digits.slice(4);
}

function getDateDigits(value) {
  return value.replace(/\D/g, '').slice(0, DATE_MAX_DIGITS);
}

function formatDateToDigits(value) {
  const normalizedValue = normalizeDate(value);

  return padDateSegment(normalizedValue.getDate()) + padDateSegment(normalizedValue.getMonth() + 1) + normalizedValue.getFullYear();
}

function buildDateMask(value) {
  const formattedValue = formatDateDigits(value);

  return formattedValue + DATE_MASK.slice(formattedValue.length);
}

function parseDateDigits(value) {
  if (value.length !== DATE_MAX_DIGITS) {
    return null;
  }

  const day = Number.parseInt(value.slice(0, 2), 10);
  const month = Number.parseInt(value.slice(2, 4), 10);
  const year = Number.parseInt(value.slice(4, 8), 10);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year) || month < 1 || month > 12 || day < 1) {
    return null;
  }

  const parsedDate = new Date(year, month - 1, day);

  if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 || parsedDate.getDate() !== day) {
    return null;
  }

  return normalizeDate(parsedDate);
}

function isDateWithinRange(value, minDate, maxDate) {
  const normalizedValue = normalizeDate(value);

  return normalizedValue >= minDate && normalizedValue <= maxDate;
}

function validateBirthDateDigits(value, minDate, maxDate) {
  if (value.length === 0) {
    return DATE_REQUIRED_ERROR;
  }

  const parsedDate = parseDateDigits(value);

  if (!parsedDate) {
    return '';
  }

  return isDateWithinRange(parsedDate, minDate, maxDate) ? undefined : DATE_OUT_OF_RANGE_ERROR;
}

export function isBirthDateValueValid(value) {
  if (!value) {
    return false;
  }

  const allowedDateRange = getAllowedDateRange(normalizeDate(new Date()));

  return isDateWithinRange(value, allowedDateRange.minDate, allowedDateRange.maxDate);
}

function isAllowedDayPrefix(prefix) {
  if (prefix.length === 0) {
    return true;
  }

  if (prefix.length === 1) {
    return ['0', '1', '2', '3'].includes(prefix);
  }

  const day = Number.parseInt(prefix, 10);

  return day >= 1 && day <= 31;
}

function isAllowedMonthPrefix(prefix) {
  if (prefix.length === 0) {
    return true;
  }

  if (prefix.length === 1) {
    return ['0', '1'].includes(prefix);
  }

  const month = Number.parseInt(prefix, 10);

  return month >= 1 && month <= 12;
}

function canYearPrefixBeCompleted(prefix, minYear, maxYear) {
  if (prefix.length === 0) {
    return true;
  }

  const rangeStart = Number.parseInt(prefix.padEnd(4, '0'), 10);
  const rangeEnd = Number.parseInt(prefix.padEnd(4, '9'), 10);

  return rangeEnd >= minYear && rangeStart <= maxYear;
}

function sanitizeDateDigits(value, minDate, maxDate) {
  const rawDigits = getDateDigits(value);
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();
  let nextDigits = '';

  for (let index = 0; index < rawDigits.length; index += 1) {
    const digit = rawDigits[index];
    const candidateDigits = nextDigits + digit;
    const dayPrefix = candidateDigits.slice(0, Math.min(2, candidateDigits.length));
    const monthPrefix =
      candidateDigits.length > 2
        ? candidateDigits.slice(2, Math.min(4, candidateDigits.length))
        : '';
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

function toNativeInputValue(value) {
  if (!value) {
    return '';
  }

  const normalizedValue = normalizeDate(value);

  return normalizedValue.getFullYear() + '-' + padDateSegment(normalizedValue.getMonth() + 1) + '-' + padDateSegment(normalizedValue.getDate());
}

function fromNativeInputValue(value) {
  if (!value) {
    return null;
  }

  const parts = value.split('-');
  const yearString = parts[0];
  const monthString = parts[1];
  const dayString = parts[2];

  if (!yearString || !monthString || !dayString) {
    return null;
  }

  const year = Number.parseInt(yearString, 10);
  const month = Number.parseInt(monthString, 10);
  const day = Number.parseInt(dayString, 10);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return null;
  }

  return normalizeDate(new Date(year, month - 1, day));
}

function parseDateConstraint(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : normalizeDate(value);
  }

  return fromNativeInputValue(value);
}

function resolveDateRange(options) {
  const parsedMinDate = parseDateConstraint(options.min);
  const parsedMaxDate = parseDateConstraint(options.max);
  const nextMinDate =
    parsedMinDate && parsedMinDate > options.fallbackMinDate
      ? parsedMinDate
      : options.fallbackMinDate;
  const nextMaxDate =
    parsedMaxDate && parsedMaxDate < options.fallbackMaxDate
      ? parsedMaxDate
      : options.fallbackMaxDate;

  if (nextMinDate > nextMaxDate) {
    return {
      maxDate: options.fallbackMaxDate,
      minDate: options.fallbackMinDate
    };
  }

  return {
    maxDate: nextMaxDate,
    minDate: nextMinDate
  };
}

function resolveInteractiveState(options) {
  const hasValue = options.value.length > 0;

  if (options.disabled) {
    return hasValue ? 'disabled-entered' : 'disabled';
  }

  if (options.isFocused) {
    if (options.hasKeyboardFocus && !hasValue) {
      return 'keyboard-focused';
    }

    return hasValue ? 'typing' : 'focused';
  }

  if (options.invalid) {
    return hasValue ? 'error-entered' : 'error';
  }

  return hasValue ? 'entered' : 'default';
}

function isDesktopViewport() {
  if (typeof window === 'undefined') {
    return true;
  }

  return window.innerWidth >= DESKTOP_BREAKPOINT_PX;
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <path
        clipRule="evenodd"
        d="M5.25 5.49674C4.83579 5.49674 4.5 5.16095 4.5 4.74674V4.00001C3.67157 4.00001 3 4.67159 3 5.50001V6.50001H13V5.50001C13 4.67159 12.3284 4.00001 11.5 4.00001V4.75003C11.5 5.16425 11.1642 5.50003 10.75 5.50003C10.3358 5.50003 10 5.16425 10 4.75003V4.00001H6V4.74674C6 5.16095 5.66421 5.49674 5.25 5.49674ZM10 2.50001H6V1.74756C6 1.33334 5.66421 0.997559 5.25 0.997559C4.83579 0.997559 4.5 1.33334 4.5 1.74756V2.50001C2.84315 2.50001 1.5 3.84316 1.5 5.50001V11.5C1.5 13.1569 2.84315 14.5 4.5 14.5H11.5C13.1569 14.5 14.5 13.1569 14.5 11.5V5.50001C14.5 3.84316 13.1569 2.50001 11.5 2.50001V1.75001C11.5 1.3358 11.1642 1.00001 10.75 1.00001C10.3358 1.00001 10 1.3358 10 1.75001V2.50001ZM3 8.00001V11.5C3 12.3284 3.67157 13 4.5 13H11.5C12.3284 13 13 12.3284 13 11.5V8.00001H3Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function XmarkIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <path
        clipRule="evenodd"
        d="M3.46967 3.46967C3.76256 3.17678 4.23744 3.17678 4.53033 3.46967L8 6.93934L11.4697 3.46967C11.7626 3.17678 12.2374 3.17678 12.5303 3.46967C12.8232 3.76256 12.8232 4.23744 12.5303 4.53033L9.06066 8L12.5303 11.4697C12.8232 11.7626 12.8232 12.2374 12.5303 12.5303C12.2374 12.8232 11.7626 12.8232 11.4697 12.5303L8 9.06066L4.53033 12.5303C4.23744 12.8232 3.76256 12.8232 3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L6.93934 8L3.46967 4.53033C3.17678 4.23744 3.17678 3.76256 3.46967 3.46967Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function CircleExclamationFillIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <path
        clipRule="evenodd"
        d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94771 7.44772 9.5 8 9.5C8.55228 9.5 9 9.94771 9 10.5ZM8.75 5C8.75 4.58579 8.41421 4.25 8 4.25C7.58579 4.25 7.25 4.58579 7.25 5V7.5C7.25 7.91421 7.58579 8.25 8 8.25C8.41421 8.25 8.75 7.91421 8.75 7.5V5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function InputBirthDate(props) {
  const {
    className,
    clearable,
    defaultValue,
    disabled,
    helperIcon,
    helperText,
    id,
    invalid,
    label,
    max,
    min,
    onBlur,
    onFocus,
    onKeyDown,
    onPaste,
    onPointerDown,
    onValueChange,
    pickerMode,
    previewState,
    readOnly,
    showHelperIcon,
    value,
    ...rest
  } = props;

  const resolvedClearable = clearable != null ? clearable : true;
  const resolvedDisabled = Boolean(disabled);
  const resolvedInvalidProp = Boolean(invalid);
  const resolvedLabel = label != null ? label : 'Дата рождения';
  const resolvedPickerModeProp = pickerMode || 'auto';
  const resolvedShowHelperIcon = Boolean(showHelperIcon);

  const [inputId] = useState(function () {
    return id || generateId();
  });
  const [helperId] = useState(function () {
    return inputId + '-helper';
  });

  const today = useMemo(function () {
    return normalizeDate(new Date());
  }, []);
  const defaultAllowedDateRange = useMemo(function () {
    return getAllowedDateRange(today);
  }, [today]);
  const allowedDateRange = useMemo(function () {
    return resolveDateRange({
      fallbackMaxDate: defaultAllowedDateRange.maxDate,
      fallbackMinDate: defaultAllowedDateRange.minDate,
      max: max,
      min: min
    });
  }, [defaultAllowedDateRange, max, min]);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(function () {
    return defaultValue ? formatDateToDigits(defaultValue) : '';
  });
  const [uncontrolledSelectedDate, setUncontrolledSelectedDate] = useState(function () {
    return defaultValue ? normalizeDate(defaultValue) : undefined;
  });
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(function () {
    return resolvedPickerModeProp === 'auto'
      ? isDesktopViewport()
      : resolvedPickerModeProp === 'desktop';
  });

  const fieldRef = useRef(null);
  const desktopInputRef = useRef(null);
  const nativeInputRef = useRef(null);
  const keyboardFocusCandidateRef = useRef(false);

  const resolvedSelectedDate = isControlled && value ? normalizeDate(value) : uncontrolledSelectedDate;
  const resolvedValue = isControlled && value ? formatDateToDigits(value) : uncontrolledValue;
  const validationMessage = hasBeenValidated
    ? validateBirthDateDigits(
        resolvedValue,
        allowedDateRange.minDate,
        allowedDateRange.maxDate
      )
    : undefined;
  const resolvedInvalid = resolvedInvalidProp || validationMessage !== undefined;
  const resolvedReadOnly =
    readOnly != null
      ? readOnly
      : isControlled && onValueChange == null;
  const isInteractive = previewState == null;
  const resolvedPickerMode =
    resolvedPickerModeProp === 'auto'
      ? (isDesktop ? 'desktop' : 'native')
      : resolvedPickerModeProp;
  const visualState = isInteractive
    ? resolveInteractiveState({
        disabled: resolvedDisabled,
        hasKeyboardFocus: hasKeyboardFocus,
        invalid: resolvedInvalid,
        isFocused: isFocused,
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
  const resolvedHelperText = isErrorState ? (validationMessage || helperText) : undefined;
  const formattedValue = formatDateDigits(resolvedValue);
  const maskValue = buildDateMask(resolvedValue);
  const nativeInputValue = toNativeInputValue(resolvedSelectedDate);
  const nativeMinValue = toNativeInputValue(allowedDateRange.minDate);
  const nativeMaxValue = toNativeInputValue(allowedDateRange.maxDate);
  const displayedValue =
    resolvedPickerMode === 'native' && resolvedSelectedDate
      ? formatDateValue(resolvedSelectedDate)
      : formattedValue;
  const shouldFloatLabel = isEnteredState || isFocusedState;
  const shouldShowMask =
    shouldFloatLabel &&
    !(resolvedPickerMode === 'native' && resolvedSelectedDate);
  const showsClearControl =
    resolvedClearable &&
    !resolvedDisabled &&
    !resolvedReadOnly &&
    (isInteractive ? isFocused && resolvedValue.length > 0 : visualState === 'typing');
  const describedBy = resolvedHelperText ? helperId : rest['aria-describedby'];

  useEffect(function () {
    if (resolvedPickerModeProp !== 'auto' || typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(min-width: ' + DESKTOP_BREAKPOINT_PX + 'px)');

    function handleMediaChange(event) {
      setIsDesktop(event.matches);
    }

    setIsDesktop(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleMediaChange);

      return function () {
        mediaQuery.removeEventListener('change', handleMediaChange);
      };
    }

    mediaQuery.addListener(handleMediaChange);

    return function () {
      mediaQuery.removeListener(handleMediaChange);
    };
  }, [resolvedPickerModeProp]);

  useEffect(function () {
    if (!isDesktop || !isCalendarOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (fieldRef.current && !fieldRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }

    function handleKeyEscape(event) {
      if (event.key === 'Escape') {
        setIsCalendarOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyEscape);

    return function () {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyEscape);
    };
  }, [isCalendarOpen, isDesktop]);

  useEffect(function () {
    if (resolvedPickerMode === 'desktop') {
      return;
    }

    setIsCalendarOpen(false);
  }, [resolvedPickerMode]);

  function emitValue(nextDate) {
    if (onValueChange) {
      onValueChange(nextDate ? normalizeDate(nextDate) : undefined);
    }
  }

  function updateDesktopValue(nextRawValue) {
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

  function updateNativeValue(nextDate) {
    const normalizedNextDate = nextDate ? normalizeDate(nextDate) : undefined;

    if (!isControlled) {
      setUncontrolledSelectedDate(normalizedNextDate);
      setUncontrolledValue(
        normalizedNextDate ? formatDateToDigits(normalizedNextDate) : ''
      );
    }

    emitValue(normalizedNextDate);
  }

  function handleFocus(event) {
    setIsFocused(true);
    setHasKeyboardFocus(
      keyboardFocusCandidateRef.current && event.currentTarget.matches(':focus-visible')
    );

    if (onFocus) {
      onFocus(event);
    }
  }

  function handleBlur(event) {
    const nextTarget = event.relatedTarget;

    if (nextTarget && fieldRef.current && fieldRef.current.contains(nextTarget)) {
      return;
    }

    setIsFocused(false);
    setHasKeyboardFocus(false);
    setHasBeenValidated(true);

    if (onBlur) {
      onBlur(event);
    }
  }

  function handleDesktopChange(event) {
    if (!isInteractive || resolvedDisabled || resolvedReadOnly) {
      return;
    }

    updateDesktopValue(event.target.value);
  }

  function handleDesktopPaste(event) {
    if (!isInteractive || resolvedDisabled || resolvedReadOnly) {
      if (onPaste) {
        onPaste(event);
      }

      return;
    }

    event.preventDefault();
    updateDesktopValue(event.clipboardData.getData('text'));

    if (onPaste) {
      onPaste(event);
    }
  }

  function handleDesktopKeyDown(event) {
    keyboardFocusCandidateRef.current = event.key === 'Tab';

    if (!isInteractive || resolvedDisabled || resolvedReadOnly) {
      if (onKeyDown) {
        onKeyDown(event);
      }

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

      if (onKeyDown) {
        onKeyDown(event);
      }

      return;
    }

    if (event.key === 'Escape') {
      setIsCalendarOpen(false);
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  function handleNativeChange(event) {
    const parsedDate = fromNativeInputValue(event.target.value);

    updateNativeValue(parsedDate || undefined);
  }

  function handleNativeInput(event) {
    const parsedDate = fromNativeInputValue(event.currentTarget.value);

    updateNativeValue(parsedDate || undefined);
  }

  function handleClear() {
    if (resolvedPickerMode === 'native') {
      updateNativeValue(undefined);

      if (nativeInputRef.current) {
        nativeInputRef.current.focus();
      }

      return;
    }

    updateDesktopValue('');

    if (desktopInputRef.current) {
      desktopInputRef.current.focus();
    }
  }

  function focusInput() {
    if (resolvedDisabled) {
      return;
    }

    if (resolvedPickerMode === 'native') {
      if (nativeInputRef.current) {
        nativeInputRef.current.focus();

        if (nativeInputRef.current.showPicker) {
          nativeInputRef.current.showPicker();
        }
      }

      return;
    }

    if (desktopInputRef.current) {
      desktopInputRef.current.focus();
    }
  }

  function handleCalendarButtonClick() {
    if (resolvedDisabled || resolvedReadOnly) {
      return;
    }

    if (resolvedPickerMode === 'native') {
      if (nativeInputRef.current) {
        nativeInputRef.current.focus();

        if (nativeInputRef.current.showPicker) {
          nativeInputRef.current.showPicker();
        }

        nativeInputRef.current.click();
      }

      return;
    }

    if (desktopInputRef.current) {
      desktopInputRef.current.focus();
    }

    setIsCalendarOpen(function (currentValue) {
      return !currentValue;
    });
  }

  function handleCalendarChange(nextDate) {
    updateNativeValue(nextDate);
    setIsCalendarOpen(false);

    if (desktopInputRef.current) {
      desktopInputRef.current.focus();
    }
  }

  return (
    <div
      className={joinClassNames('rshb-legacy-input-birth-date', className)}
      data-calendar-open={isCalendarOpen ? 'true' : 'false'}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-has-helper={resolvedHelperText ? 'true' : 'false'}
      data-picker-mode={resolvedPickerMode}
      data-state={visualState}
      ref={fieldRef}
    >
      <div className="rshb-legacy-input-birth-date__field">
        <div className="rshb-legacy-input-birth-date__content">
          <label className="rshb-legacy-input-birth-date__label" htmlFor={inputId}>
            {resolvedLabel}
          </label>
          <div className="rshb-legacy-input-birth-date__value-row">
            <div className="rshb-legacy-input-birth-date__input-shell">
              {resolvedPickerMode === 'native' ? (
                <>
                  <input
                    {...rest}
                    aria-describedby={describedBy}
                    aria-invalid={resolvedInvalid || undefined}
                    className="rshb-legacy-input-birth-date__native-input"
                    disabled={resolvedDisabled}
                    id={inputId}
                    max={nativeMaxValue}
                    min={nativeMinValue}
                    onBlur={handleBlur}
                    onChange={handleNativeChange}
                    onFocus={handleFocus}
                    onInput={handleNativeInput}
                    onKeyDown={function (event) {
                      keyboardFocusCandidateRef.current = event.key === 'Tab';

                      if (onKeyDown) {
                        onKeyDown(event);
                      }
                    }}
                    onPointerDown={function (event) {
                      keyboardFocusCandidateRef.current = false;

                      if (onPointerDown) {
                        onPointerDown(event);
                      }
                    }}
                    readOnly={!isInteractive || resolvedReadOnly}
                    ref={nativeInputRef}
                    type="date"
                    value={nativeInputValue}
                  />
                  {resolvedSelectedDate ? (
                    <span aria-hidden="true" className="rshb-legacy-input-birth-date__control">
                      {displayedValue}
                    </span>
                  ) : null}
                </>
              ) : (
                <input
                  {...rest}
                  aria-describedby={describedBy}
                  aria-invalid={resolvedInvalid || undefined}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  className="rshb-legacy-input-birth-date__control"
                  disabled={resolvedDisabled}
                  id={inputId}
                  inputMode="numeric"
                  maxLength={10}
                  onBlur={handleBlur}
                  onChange={handleDesktopChange}
                  onFocus={handleFocus}
                  onKeyDown={handleDesktopKeyDown}
                  onPaste={handleDesktopPaste}
                  onPointerDown={function (event) {
                    keyboardFocusCandidateRef.current = false;

                    if (onPointerDown) {
                      onPointerDown(event);
                    }
                  }}
                  pattern="[0-9.]*"
                  readOnly={!isInteractive || resolvedReadOnly}
                  ref={desktopInputRef}
                  spellCheck={false}
                  type="text"
                  value={displayedValue}
                />
              )}
              {shouldShowMask ? (
                <span aria-hidden="true" className="rshb-legacy-input-birth-date__mask">
                  {resolvedPickerMode === 'native' && !resolvedSelectedDate ? DATE_MASK : maskValue}
                </span>
              ) : null}
            </div>
          </div>
          {!shouldFloatLabel ? (
            <button
              aria-label="Активировать поле даты"
              className="rshb-legacy-input-birth-date__activator"
              onClick={focusInput}
              onPointerDown={function () {
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
            className="rshb-legacy-input-birth-date__action-button"
            onClick={handleClear}
            onMouseDown={function (event) {
              event.preventDefault();
            }}
            tabIndex={-1}
            type="button"
          >
            <span aria-hidden="true" className="rshb-legacy-input-birth-date__action-icon rshb-legacy-input-birth-date__action-icon--clear">
              <XmarkIcon />
            </span>
          </button>
        ) : null}
        <button
          aria-expanded={resolvedPickerMode === 'desktop' ? isCalendarOpen : undefined}
          aria-haspopup={resolvedPickerMode === 'desktop' ? 'dialog' : undefined}
          aria-label="Открыть календарь"
          className="rshb-legacy-input-birth-date__action-button"
          data-selected={isCalendarOpen ? 'true' : 'false'}
          disabled={resolvedDisabled || resolvedReadOnly}
          onClick={handleCalendarButtonClick}
          onMouseDown={function (event) {
            event.preventDefault();
          }}
          tabIndex={resolvedPickerMode === 'native' ? -1 : 0}
          type="button"
        >
          <span aria-hidden="true" className="rshb-legacy-input-birth-date__action-icon rshb-legacy-input-birth-date__action-icon--calendar">
            <CalendarIcon />
          </span>
        </button>
      </div>
      {resolvedHelperText ? (
        <div className="rshb-legacy-input-birth-date__helper" id={helperId}>
          {resolvedShowHelperIcon ? (
            <span aria-hidden="true" className="rshb-legacy-input-birth-date__helper-icon-wrapper">
              {helperIcon != null ? helperIcon : (
                <span className="rshb-legacy-input-birth-date__helper-icon">
                  <CircleExclamationFillIcon />
                </span>
              )}
            </span>
          ) : null}
          <span className="rshb-legacy-input-birth-date__helper-text">{resolvedHelperText}</span>
        </div>
      ) : null}
      {resolvedPickerMode === 'desktop' && isCalendarOpen ? (
        <div className="rshb-legacy-input-birth-date__calendar">
          <Calendar
            maxDate={allowedDateRange.maxDate}
            minDate={allowedDateRange.minDate}
            onChange={handleCalendarChange}
            value={resolvedSelectedDate || allowedDateRange.maxDate}
          />
        </div>
      ) : null}
    </div>
  );
}
