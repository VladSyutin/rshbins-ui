import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import './Calendar.scss';
import chevronDownIconUrl from '../../../icons/chevron-down.svg';
import previousIconUrl from '../../../icons/chevron-left.svg';
import nextIconUrl from '../../../icons/chevron-right.svg';

export type CalendarView = 'day' | 'month' | 'year';
export type CalendarItemPreviewState = 'default' | 'hover' | 'focused';

export interface CalendarDayItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  anotherMonth?: boolean;
  day: number;
  previewState?: CalendarItemPreviewState;
  selected?: boolean;
}

export interface CalendarPeriodItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  previewState?: CalendarItemPreviewState;
  selected?: boolean;
}

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'value'> {
  defaultValue?: Date;
  initialView?: CalendarView;
  maxDate?: Date;
  minDate?: Date;
  onChange?: (value: Date) => void;
  value?: Date;
}

interface CalendarState {
  displayDate: Date;
  selectedDate: Date;
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  view: CalendarView;
  yearRangeStart: number;
}

interface CalendarSnapshot {
  displayDate: Date;
  view: CalendarView;
  yearRangeStart: number;
}

interface CalendarAnimationState {
  direction: -1 | 1;
  outgoingSnapshot: CalendarSnapshot | null;
  running: boolean;
}

interface DayCell {
  anotherMonth: boolean;
  day: number;
  month: number;
  year: number;
}

type CalendarIconStyle = CSSProperties & {
  '--rshb-calendar-icon-url': string;
};

const NAVIGATION_ANIMATION_DURATION_MS = 150;

const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
] as const;

const MONTH_NAMES_SHORT = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек'
] as const;

const MONTH_NAMES_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'
] as const;

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;

function joinClassNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function normalizeDate(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const dayOfWeek = new Date(year, month, 1).getDay();

  return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
}

function getYearRangeStart(year: number): number {
  return Math.floor(year / 12) * 12;
}

function getMonthBoundary(year: number, month: number, boundary: 'start' | 'end'): Date {
  if (boundary === 'start') {
    return normalizeDate(new Date(year, month, 1));
  }

  return normalizeDate(new Date(year, month + 1, 0));
}

function getYearBoundary(year: number, boundary: 'start' | 'end'): Date {
  if (boundary === 'start') {
    return normalizeDate(new Date(year, 0, 1));
  }

  return normalizeDate(new Date(year, 11, 31));
}

function rangesIntersect(rangeAStart: Date, rangeAEnd: Date, rangeBStart: Date, rangeBEnd: Date): boolean {
  return rangeAStart <= rangeBEnd && rangeAEnd >= rangeBStart;
}

function getEffectiveRangeStart(minDate: Date | null): Date {
  return minDate ?? new Date(-8640000000000000);
}

function getEffectiveRangeEnd(maxDate: Date | null): Date {
  return maxDate ?? new Date(8640000000000000);
}

function hasSelectableMonth(
  year: number,
  month: number,
  minDate: Date | null,
  maxDate: Date | null
): boolean {
  return rangesIntersect(
    getMonthBoundary(year, month, 'start'),
    getMonthBoundary(year, month, 'end'),
    getEffectiveRangeStart(minDate),
    getEffectiveRangeEnd(maxDate)
  );
}

function hasSelectableYear(year: number, minDate: Date | null, maxDate: Date | null): boolean {
  return rangesIntersect(
    getYearBoundary(year, 'start'),
    getYearBoundary(year, 'end'),
    getEffectiveRangeStart(minDate),
    getEffectiveRangeEnd(maxDate)
  );
}

function hasSelectableYearRange(
  yearRangeStart: number,
  minDate: Date | null,
  maxDate: Date | null
): boolean {
  return rangesIntersect(
    getYearBoundary(yearRangeStart, 'start'),
    getYearBoundary(yearRangeStart + 11, 'end'),
    getEffectiveRangeStart(minDate),
    getEffectiveRangeEnd(maxDate)
  );
}

function createInitialState(value: Date, view: CalendarView): CalendarState {
  const normalizedValue = normalizeDate(value);

  return {
    displayDate: normalizedValue,
    selectedDate: normalizedValue,
    selectedDay: normalizedValue.getDate(),
    selectedMonth: normalizedValue.getMonth(),
    selectedYear: normalizedValue.getFullYear(),
    view,
    yearRangeStart: getYearRangeStart(normalizedValue.getFullYear())
  };
}

function createNextDate(year: number, month: number, day: number): Date {
  return normalizeDate(new Date(year, month, day));
}

function createSnapshot(state: Pick<CalendarState, 'displayDate' | 'view' | 'yearRangeStart'>): CalendarSnapshot {
  return {
    displayDate: state.displayDate,
    view: state.view,
    yearRangeStart: state.yearRangeStart
  };
}

function buildDayGrid(displayDate: Date): DayCell[][] {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const totalWeeks = Math.ceil((firstDay + daysInMonth) / 7);
  const previousMonth = month === 0 ? 11 : month - 1;
  const previousYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const daysInPreviousMonth = getDaysInMonth(previousYear, previousMonth);

  const grid: DayCell[][] = [];
  let currentDay = 1;
  let nextMonthDay = 1;

  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex += 1) {
    const week: DayCell[] = [];

    for (let weekdayIndex = 0; weekdayIndex < 7; weekdayIndex += 1) {
      const cellIndex = weekIndex * 7 + weekdayIndex;

      if (cellIndex < firstDay) {
        const day = daysInPreviousMonth - firstDay + weekdayIndex + 1;

        week.push({
          anotherMonth: true,
          day,
          month: previousMonth,
          year: previousYear
        });
        continue;
      }

      if (currentDay <= daysInMonth) {
        week.push({
          anotherMonth: false,
          day: currentDay,
          month,
          year
        });
        currentDay += 1;
        continue;
      }

      week.push({
        anotherMonth: true,
        day: nextMonthDay,
        month: nextMonth,
        year: nextYear
      });
      nextMonthDay += 1;
    }
    grid.push(week);
  }

  return grid;
}

/**
 * Primitive calendar day button used inside the date grid and standalone previews.
 */
export function CalendarDayItem({
  anotherMonth = false,
  className,
  day,
  previewState = 'default',
  selected = false,
  type = 'button',
  ...props
}: CalendarDayItemProps) {
  return (
    <button
      {...props}
      aria-pressed={selected}
      className={joinClassNames('rshb-calendar-day-item', className)}
      data-another-month={anotherMonth ? 'true' : 'false'}
      data-preview-state={previewState}
      data-selected={selected ? 'true' : 'false'}
      type={type}
    >
      <span className="rshb-calendar-day-item__label">{day}</span>
    </button>
  );
}

/**
 * Primitive month/year option used inside overview views and standalone previews.
 */
export function CalendarPeriodItem({
  className,
  label,
  previewState = 'default',
  selected = false,
  type = 'button',
  ...props
}: CalendarPeriodItemProps) {
  return (
    <button
      {...props}
      aria-pressed={selected}
      className={joinClassNames('rshb-calendar-period-item', className)}
      data-preview-state={previewState}
      data-selected={selected ? 'true' : 'false'}
      type={type}
    >
      <span className="rshb-calendar-period-item__label">{label}</span>
    </button>
  );
}

/**
 * Token-driven calendar picker translated from the Figma calendar family.
 */
export function Calendar({
  className,
  defaultValue,
  initialView = 'day',
  maxDate,
  minDate,
  onChange,
  value,
  ...props
}: CalendarProps) {
  const seedDate = value ?? defaultValue ?? new Date();
  const [state, setState] = useState<CalendarState>(() => createInitialState(seedDate, initialView));
  const [animationState, setAnimationState] = useState<CalendarAnimationState>({
    direction: 1,
    outgoingSnapshot: null,
    running: false
  });
  const animationTimerRef = useRef<number | null>(null);

  const titleIconStyle: CalendarIconStyle = {
    '--rshb-calendar-icon-url': `url("${chevronDownIconUrl}")`
  };
  const previousIconStyle: CalendarIconStyle = {
    '--rshb-calendar-icon-url': `url("${previousIconUrl}")`
  };
  const nextIconStyle: CalendarIconStyle = {
    '--rshb-calendar-icon-url': `url("${nextIconUrl}")`
  };
  const resolvedMinDate = minDate ? normalizeDate(minDate) : null;
  const resolvedMaxDate = maxDate ? normalizeDate(maxDate) : null;
  const controlledValueKey = value ? value.getTime() : null;
  const currentSnapshot = useMemo(
    () => createSnapshot(state),
    [state.displayDate, state.view, state.yearRangeStart]
  );
  const canNavigatePrevious = useMemo(() => {
    if (state.view === 'day') {
      return hasSelectableMonth(
        state.displayDate.getFullYear(),
        state.displayDate.getMonth() - 1,
        resolvedMinDate,
        resolvedMaxDate
      );
    }

    if (state.view === 'month') {
      return hasSelectableYear(
        state.displayDate.getFullYear() - 1,
        resolvedMinDate,
        resolvedMaxDate
      );
    }

    return hasSelectableYearRange(state.yearRangeStart - 12, resolvedMinDate, resolvedMaxDate);
  }, [resolvedMaxDate, resolvedMinDate, state.displayDate, state.view, state.yearRangeStart]);
  const canNavigateNext = useMemo(() => {
    if (state.view === 'day') {
      return hasSelectableMonth(
        state.displayDate.getFullYear(),
        state.displayDate.getMonth() + 1,
        resolvedMinDate,
        resolvedMaxDate
      );
    }

    if (state.view === 'month') {
      return hasSelectableYear(
        state.displayDate.getFullYear() + 1,
        resolvedMinDate,
        resolvedMaxDate
      );
    }

    return hasSelectableYearRange(state.yearRangeStart + 12, resolvedMinDate, resolvedMaxDate);
  }, [resolvedMaxDate, resolvedMinDate, state.displayDate, state.view, state.yearRangeStart]);

  useEffect(() => {
    if (controlledValueKey === null) {
      return;
    }

    const nextValue = normalizeDate(value as Date);

    setState((previousState) => ({
      ...previousState,
      displayDate: nextValue,
      selectedDate: nextValue,
      selectedDay: nextValue.getDate(),
      selectedMonth: nextValue.getMonth(),
      selectedYear: nextValue.getFullYear(),
      yearRangeStart: getYearRangeStart(nextValue.getFullYear())
    }));
    setAnimationState({
      direction: 1,
      outgoingSnapshot: null,
      running: false
    });
  }, [controlledValueKey, value]);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  function emitChange(nextDate: Date) {
    onChange?.(normalizeDate(nextDate));
  }

  function startNavigationAnimation(direction: -1 | 1, outgoingSnapshot: CalendarSnapshot) {
    if (animationTimerRef.current !== null) {
      window.clearTimeout(animationTimerRef.current);
    }

    setAnimationState({
      direction,
      outgoingSnapshot,
      running: true
    });

    animationTimerRef.current = window.setTimeout(() => {
      animationTimerRef.current = null;
      setAnimationState({
        direction,
        outgoingSnapshot: null,
        running: false
      });
    }, NAVIGATION_ANIMATION_DURATION_MS);
  }

  function handlePrevious() {
    if (!canNavigatePrevious) {
      return;
    }

    const outgoingSnapshot = createSnapshot(state);

    setState((previousState) => {
      if (previousState.view === 'day') {
        return {
          ...previousState,
          displayDate: new Date(
            previousState.displayDate.getFullYear(),
            previousState.displayDate.getMonth() - 1,
            1
          )
        };
      }

      if (previousState.view === 'month') {
        const nextDisplayDate = new Date(previousState.displayDate.getFullYear() - 1, previousState.displayDate.getMonth(), 1);

        return {
          ...previousState,
          displayDate: nextDisplayDate,
          selectedYear: nextDisplayDate.getFullYear()
        };
      }

      return {
        ...previousState,
        yearRangeStart: previousState.yearRangeStart - 12
      };
    });

    if (state.view !== 'month') {
      startNavigationAnimation(-1, outgoingSnapshot);
    }
  }

  function handleNext() {
    if (!canNavigateNext) {
      return;
    }

    const outgoingSnapshot = createSnapshot(state);

    setState((previousState) => {
      if (previousState.view === 'day') {
        return {
          ...previousState,
          displayDate: new Date(
            previousState.displayDate.getFullYear(),
            previousState.displayDate.getMonth() + 1,
            1
          )
        };
      }

      if (previousState.view === 'month') {
        const nextDisplayDate = new Date(previousState.displayDate.getFullYear() + 1, previousState.displayDate.getMonth(), 1);

        return {
          ...previousState,
          displayDate: nextDisplayDate,
          selectedYear: nextDisplayDate.getFullYear()
        };
      }

      return {
        ...previousState,
        yearRangeStart: previousState.yearRangeStart + 12
      };
    });

    if (state.view !== 'month') {
      startNavigationAnimation(1, outgoingSnapshot);
    }
  }

  function handleTitleClick() {
    if (animationTimerRef.current !== null) {
      window.clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }

    setAnimationState({
      direction: 1,
      outgoingSnapshot: null,
      running: false
    });

    setState((previousState) => {
      if (previousState.view === 'day') {
        return {
          ...previousState,
          view: 'month'
        };
      }

      if (previousState.view === 'month') {
        return {
          ...previousState,
          view: 'year',
          yearRangeStart: getYearRangeStart(previousState.displayDate.getFullYear())
        };
      }

      return {
        ...previousState,
        displayDate: new Date(previousState.selectedYear, previousState.selectedMonth, 1),
        view: 'day'
      };
    });
  }

  function handleDaySelect(day: number, month: number, year: number, anotherMonth: boolean) {
    const nextSelectedDate = createNextDate(year, month, day);

    setState((previousState) => ({
      ...previousState,
      displayDate: anotherMonth ? new Date(year, month, 1) : previousState.displayDate,
      selectedDate: nextSelectedDate,
      selectedDay: day,
      selectedMonth: month,
      selectedYear: year
    }));

    emitChange(nextSelectedDate);
  }

  function handleMonthSelect(month: number) {
    let nextSelectedDate = state.selectedDate;

    setState((previousState) => {
      const year = previousState.displayDate.getFullYear();
      const validDay = Math.min(previousState.selectedDay, getDaysInMonth(year, month));

      nextSelectedDate = createNextDate(year, month, validDay);

      return {
        ...previousState,
        selectedDate: nextSelectedDate,
        selectedDay: validDay,
        selectedMonth: month,
        selectedYear: year
      };
    });

    emitChange(nextSelectedDate);
  }

  function handleYearSelect(year: number) {
    let nextSelectedDate = state.selectedDate;

    setState((previousState) => {
      let nextMonth = previousState.selectedMonth;
      let nextDay = previousState.selectedDay;

      if (
        previousState.selectedMonth === 1 &&
        previousState.selectedDay === 29 &&
        getDaysInMonth(year, 1) < 29
      ) {
        nextMonth = 2;
        nextDay = 1;
      }

      nextSelectedDate = createNextDate(year, nextMonth, nextDay);

      return {
        ...previousState,
        selectedDate: nextSelectedDate,
        selectedDay: nextDay,
        selectedMonth: nextMonth,
        selectedYear: year
      };
    });

    emitChange(nextSelectedDate);
  }

  function getTitleLabel(): string {
    if (state.view === 'day') {
      return `${MONTH_NAMES[state.displayDate.getMonth()]} ${state.displayDate.getFullYear()}`;
    }

    if (state.view === 'month') {
      return `${state.displayDate.getFullYear()}`;
    }

    return `${state.selectedDay} ${MONTH_NAMES_GENITIVE[state.selectedMonth]}`;
  }

  function renderDayView(snapshot: CalendarSnapshot) {
    return (
      <>
        <div className="rshb-calendar__weekdays">
          {DAY_NAMES.map((dayName) => (
            <div className="rshb-calendar__weekday" key={dayName}>
              <span className="rshb-calendar__weekday-label">{dayName}</span>
            </div>
          ))}
        </div>
        <div className="rshb-calendar__weeks">
          {buildDayGrid(snapshot.displayDate).map((week, weekIndex) => (
            <div
              className="rshb-calendar__week"
              key={`${snapshot.displayDate.getFullYear()}-${snapshot.displayDate.getMonth()}-${weekIndex}`}
            >
              {week.map((cell) => {
                const isSelected =
                  cell.day === state.selectedDay &&
                  cell.month === state.selectedMonth &&
                  cell.year === state.selectedYear;
                const cellDate = normalizeDate(new Date(cell.year, cell.month, cell.day));
                const isOutOfRange =
                  (resolvedMinDate !== null && cellDate < resolvedMinDate) ||
                  (resolvedMaxDate !== null && cellDate > resolvedMaxDate);
                const monthName = MONTH_NAMES_GENITIVE[cell.month];
                const ariaLabel = `${cell.day} ${monthName} ${cell.year}`;

                return (
                  <CalendarDayItem
                    aria-label={ariaLabel}
                    anotherMonth={cell.anotherMonth}
                    day={cell.day}
                    disabled={isOutOfRange}
                    key={`${cell.year}-${cell.month}-${cell.day}`}
                    onClick={() =>
                      !isOutOfRange &&
                      handleDaySelect(cell.day, cell.month, cell.year, cell.anotherMonth)
                    }
                    selected={isSelected}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderPeriodView(snapshot: CalendarSnapshot, items: string[]) {
    return (
      <div className="rshb-calendar__periods">
        {Array.from({ length: 4 }, (_, rowIndex) => rowIndex * 3).map((startIndex) => (
          <div className="rshb-calendar__period-row" key={startIndex}>
            {items.slice(startIndex, startIndex + 3).map((label, itemIndex) => {
              const index = startIndex + itemIndex;
              const isSelected =
                snapshot.view === 'month'
                  ? state.selectedMonth === index &&
                    state.selectedYear === snapshot.displayDate.getFullYear()
                  : state.selectedYear === snapshot.yearRangeStart + index;
              const optionStart =
                snapshot.view === 'month'
                  ? getMonthBoundary(snapshot.displayDate.getFullYear(), index, 'start')
                  : getYearBoundary(snapshot.yearRangeStart + index, 'start');
              const optionEnd =
                snapshot.view === 'month'
                  ? getMonthBoundary(snapshot.displayDate.getFullYear(), index, 'end')
                  : getYearBoundary(snapshot.yearRangeStart + index, 'end');
              const rangeStart = getEffectiveRangeStart(resolvedMinDate);
              const rangeEnd = getEffectiveRangeEnd(resolvedMaxDate);
              const isDisabled = !rangesIntersect(optionStart, optionEnd, rangeStart, rangeEnd);

              return (
                <CalendarPeriodItem
                  disabled={isDisabled}
                  key={label}
                  label={label}
                  onClick={() =>
                    !isDisabled &&
                    (snapshot.view === 'month'
                      ? handleMonthSelect(index)
                      : handleYearSelect(snapshot.yearRangeStart + index))
                  }
                  selected={isSelected}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  function renderContent(snapshot: CalendarSnapshot): ReactNode {
    if (snapshot.view === 'day') {
      return renderDayView(snapshot);
    }

    if (snapshot.view === 'month') {
      return renderPeriodView(snapshot, [...MONTH_NAMES_SHORT]);
    }

    return renderPeriodView(
      snapshot,
      Array.from({ length: 12 }, (_, index) => `${snapshot.yearRangeStart + index}`)
    );
  }

  return (
    <div
      {...props}
      className={joinClassNames('rshb-calendar', className)}
      data-view={state.view}
    >
      <div className="rshb-calendar__header">
        <button className="rshb-calendar__title-button" onClick={handleTitleClick} type="button">
          <span className="rshb-calendar__title-label">{getTitleLabel()}</span>
          <span
            aria-hidden="true"
            className="rshb-calendar__icon rshb-calendar__icon--title"
            style={titleIconStyle}
          />
        </button>
        <div className="rshb-calendar__actions">
          <button
            aria-label="Предыдущий период"
            className="rshb-calendar__action-button"
            disabled={!canNavigatePrevious}
            onClick={handlePrevious}
            type="button"
          >
            <span
              aria-hidden="true"
              className="rshb-calendar__icon rshb-calendar__icon--arrow"
              style={previousIconStyle}
            />
          </button>
          <button
            aria-label="Следующий период"
            className="rshb-calendar__action-button"
            disabled={!canNavigateNext}
            onClick={handleNext}
            type="button"
          >
            <span
              aria-hidden="true"
              className="rshb-calendar__icon rshb-calendar__icon--arrow"
              style={nextIconStyle}
            />
          </button>
        </div>
      </div>
      <div
        className="rshb-calendar__content"
        data-animating={animationState.running ? 'true' : 'false'}
        data-current-view={state.view}
        data-direction={animationState.direction === -1 ? 'backward' : 'forward'}
      >
        {animationState.outgoingSnapshot ? (
          <div className="rshb-calendar__content-panel rshb-calendar__content-panel--outgoing">
            {renderContent(animationState.outgoingSnapshot)}
          </div>
        ) : null}
        <div
          className={joinClassNames(
            'rshb-calendar__content-panel',
            animationState.running && 'rshb-calendar__content-panel--incoming'
          )}
        >
          {renderContent(currentSnapshot)}
        </div>
      </div>
    </div>
  );
}
