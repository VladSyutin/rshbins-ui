import React, { useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

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
];

const MONTH_NAMES_SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

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
];

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const CALENDAR_DAY_CELL_SIZE_PX = 40;
const CALENDAR_GRID_GAP_PX = 2;
const CALENDAR_MONTH_YEAR_VIEW_MIN_HEIGHT_PX = 252;

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function normalizeDate(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const dayOfWeek = new Date(year, month, 1).getDay();

  return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
}

function getYearRangeStart(year) {
  return Math.floor(year / 12) * 12;
}

function getMonthBoundary(year, month, boundary) {
  if (boundary === 'start') {
    return normalizeDate(new Date(year, month, 1));
  }

  return normalizeDate(new Date(year, month + 1, 0));
}

function getYearBoundary(year, boundary) {
  if (boundary === 'start') {
    return normalizeDate(new Date(year, 0, 1));
  }

  return normalizeDate(new Date(year, 11, 31));
}

function rangesIntersect(rangeAStart, rangeAEnd, rangeBStart, rangeBEnd) {
  return rangeAStart <= rangeBEnd && rangeAEnd >= rangeBStart;
}

function getEffectiveRangeStart(minDate) {
  return minDate || new Date(-8640000000000000);
}

function getEffectiveRangeEnd(maxDate) {
  return maxDate || new Date(8640000000000000);
}

function hasSelectableMonth(year, month, minDate, maxDate) {
  return rangesIntersect(
    getMonthBoundary(year, month, 'start'),
    getMonthBoundary(year, month, 'end'),
    getEffectiveRangeStart(minDate),
    getEffectiveRangeEnd(maxDate)
  );
}

function hasSelectableYear(year, minDate, maxDate) {
  return rangesIntersect(
    getYearBoundary(year, 'start'),
    getYearBoundary(year, 'end'),
    getEffectiveRangeStart(minDate),
    getEffectiveRangeEnd(maxDate)
  );
}

function hasSelectableYearRange(yearRangeStart, minDate, maxDate) {
  return rangesIntersect(
    getYearBoundary(yearRangeStart, 'start'),
    getYearBoundary(yearRangeStart + 11, 'end'),
    getEffectiveRangeStart(minDate),
    getEffectiveRangeEnd(maxDate)
  );
}

function createInitialState(value, view) {
  const normalizedValue = normalizeDate(value);

  return {
    displayDate: normalizedValue,
    selectedDate: normalizedValue,
    selectedDay: normalizedValue.getDate(),
    selectedMonth: normalizedValue.getMonth(),
    selectedYear: normalizedValue.getFullYear(),
    view: view,
    yearRangeStart: getYearRangeStart(normalizedValue.getFullYear())
  };
}

function createNextDate(year, month, day) {
  return normalizeDate(new Date(year, month, day));
}

function createSnapshot(state) {
  return {
    displayDate: state.displayDate,
    view: state.view,
    yearRangeStart: state.yearRangeStart
  };
}

function buildDayGrid(displayDate) {
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
  const grid = [];
  let currentDay = 1;
  let nextMonthDay = 1;

  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex += 1) {
    const week = [];

    for (let weekdayIndex = 0; weekdayIndex < 7; weekdayIndex += 1) {
      const cellIndex = weekIndex * 7 + weekdayIndex;

      if (cellIndex < firstDay) {
        week.push({
          anotherMonth: true,
          day: daysInPreviousMonth - firstDay + weekdayIndex + 1,
          month: previousMonth,
          year: previousYear
        });
        continue;
      }

      if (currentDay <= daysInMonth) {
        week.push({
          anotherMonth: false,
          day: currentDay,
          month: month,
          year: year
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

function getDayViewMinHeight(displayDate) {
  const weeksCount = buildDayGrid(displayDate).length;

  return CALENDAR_DAY_CELL_SIZE_PX + weeksCount * CALENDAR_DAY_CELL_SIZE_PX + weeksCount * CALENDAR_GRID_GAP_PX;
}

function getViewMinHeight(snapshot) {
  if (snapshot.view === 'day') {
    return getDayViewMinHeight(snapshot.displayDate);
  }

  return CALENDAR_MONTH_YEAR_VIEW_MIN_HEIGHT_PX;
}

function CalendarIcon(props) {
  const direction = props.direction;

  if (direction === 'left') {
    return (
      <svg aria-hidden="true" className="rshb-legacy-calendar__icon-svg" fill="none" viewBox="0 0 16 16">
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (direction === 'right') {
    return (
      <svg aria-hidden="true" className="rshb-legacy-calendar__icon-svg" fill="none" viewBox="0 0 16 16">
        <path
          d="M6 4L10 8L6 12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="rshb-legacy-calendar__icon-svg" fill="none" viewBox="0 0 16 16">
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CalendarDayItem(props) {
  const {
    anotherMonth,
    className,
    day,
    previewState,
    selected,
    type
  } = props;
  const buttonProps = Object.assign({}, props);
  delete buttonProps.anotherMonth;
  delete buttonProps.className;
  delete buttonProps.day;
  delete buttonProps.previewState;
  delete buttonProps.selected;

  return (
    <button
      {...buttonProps}
      aria-pressed={Boolean(selected)}
      className={joinClassNames('rshb-legacy-calendar-day-item', className)}
      data-another-month={anotherMonth ? 'true' : 'false'}
      data-preview-state={previewState || 'default'}
      data-selected={selected ? 'true' : 'false'}
      type={type || 'button'}
    >
      <span className="rshb-legacy-calendar-day-item__label">{day}</span>
    </button>
  );
}

export function CalendarPeriodItem(props) {
  const {
    className,
    label,
    previewState,
    selected,
    type
  } = props;
  const buttonProps = Object.assign({}, props);
  delete buttonProps.className;
  delete buttonProps.label;
  delete buttonProps.previewState;
  delete buttonProps.selected;

  return (
    <button
      {...buttonProps}
      aria-pressed={Boolean(selected)}
      className={joinClassNames('rshb-legacy-calendar-period-item', className)}
      data-preview-state={previewState || 'default'}
      data-selected={selected ? 'true' : 'false'}
      type={type || 'button'}
    >
      <span className="rshb-legacy-calendar-period-item__label">{label}</span>
    </button>
  );
}

export default function Calendar(props) {
  const {
    className,
    defaultValue,
    initialView,
    maxDate,
    minDate,
    onChange,
    value
  } = props;
  const rootProps = Object.assign({}, props);
  delete rootProps.className;
  delete rootProps.defaultValue;
  delete rootProps.initialView;
  delete rootProps.maxDate;
  delete rootProps.minDate;
  delete rootProps.onChange;
  delete rootProps.value;

  const seedDate = value || defaultValue || new Date();
  const [state, setState] = useState(function initState() {
    return createInitialState(seedDate, initialView || 'day');
  });
  const [animationState, setAnimationState] = useState({
    direction: 1,
    outgoingSnapshot: null,
    running: false
  });
  const animationTimerRef = useRef(null);
  const resolvedMinDate = minDate ? normalizeDate(minDate) : null;
  const resolvedMaxDate = maxDate ? normalizeDate(maxDate) : null;
  const controlledValueKey = value ? value.getTime() : null;
  const currentSnapshot = useMemo(function memoSnapshot() {
    return createSnapshot(state);
  }, [state.displayDate, state.view, state.yearRangeStart]);
  const contentStyle = useMemo(function memoContentStyle() {
    const snapshots = animationState.outgoingSnapshot ? [animationState.outgoingSnapshot, currentSnapshot] : [currentSnapshot];

    return {
      minHeight: Math.max.apply(
        null,
        snapshots.map(function mapSnapshot(snapshot) {
          return getViewMinHeight(snapshot);
        })
      )
    };
  }, [animationState.outgoingSnapshot, currentSnapshot]);
  const canNavigatePrevious = useMemo(function memoCanNavigatePrevious() {
    if (state.view === 'day') {
      return hasSelectableMonth(
        state.displayDate.getFullYear(),
        state.displayDate.getMonth() - 1,
        resolvedMinDate,
        resolvedMaxDate
      );
    }

    if (state.view === 'month') {
      return hasSelectableYear(state.displayDate.getFullYear() - 1, resolvedMinDate, resolvedMaxDate);
    }

    return hasSelectableYearRange(state.yearRangeStart - 12, resolvedMinDate, resolvedMaxDate);
  }, [resolvedMinDate, resolvedMaxDate, state.displayDate, state.view, state.yearRangeStart]);
  const canNavigateNext = useMemo(function memoCanNavigateNext() {
    if (state.view === 'day') {
      return hasSelectableMonth(
        state.displayDate.getFullYear(),
        state.displayDate.getMonth() + 1,
        resolvedMinDate,
        resolvedMaxDate
      );
    }

    if (state.view === 'month') {
      return hasSelectableYear(state.displayDate.getFullYear() + 1, resolvedMinDate, resolvedMaxDate);
    }

    return hasSelectableYearRange(state.yearRangeStart + 12, resolvedMinDate, resolvedMaxDate);
  }, [resolvedMinDate, resolvedMaxDate, state.displayDate, state.view, state.yearRangeStart]);

  useEffect(function syncControlledValue() {
    if (controlledValueKey === null) {
      return undefined;
    }

    const nextValue = normalizeDate(value);

    setState(function updateState(previousState) {
      return {
        ...previousState,
        displayDate: nextValue,
        selectedDate: nextValue,
        selectedDay: nextValue.getDate(),
        selectedMonth: nextValue.getMonth(),
        selectedYear: nextValue.getFullYear(),
        yearRangeStart: getYearRangeStart(nextValue.getFullYear())
      };
    });
    setAnimationState({
      direction: 1,
      outgoingSnapshot: null,
      running: false
    });

    return undefined;
  }, [controlledValueKey, value]);

  useEffect(function cleanupAnimationTimer() {
    return function cleanup() {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  function emitChange(nextDate) {
    if (onChange) {
      onChange(normalizeDate(nextDate));
    }
  }

  function startNavigationAnimation(direction, outgoingSnapshot) {
    if (animationTimerRef.current !== null) {
      window.clearTimeout(animationTimerRef.current);
    }

    setAnimationState({
      direction: direction,
      outgoingSnapshot: outgoingSnapshot,
      running: true
    });

    animationTimerRef.current = window.setTimeout(function clearAnimation() {
      animationTimerRef.current = null;
      setAnimationState({
        direction: direction,
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

    setState(function updateState(previousState) {
      if (previousState.view === 'day') {
        return {
          ...previousState,
          displayDate: new Date(previousState.displayDate.getFullYear(), previousState.displayDate.getMonth() - 1, 1)
        };
      }

      if (previousState.view === 'month') {
        const nextDisplayDate = new Date(
          previousState.displayDate.getFullYear() - 1,
          previousState.displayDate.getMonth(),
          1
        );

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

    setState(function updateState(previousState) {
      if (previousState.view === 'day') {
        return {
          ...previousState,
          displayDate: new Date(previousState.displayDate.getFullYear(), previousState.displayDate.getMonth() + 1, 1)
        };
      }

      if (previousState.view === 'month') {
        const nextDisplayDate = new Date(
          previousState.displayDate.getFullYear() + 1,
          previousState.displayDate.getMonth(),
          1
        );

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

    setState(function updateState(previousState) {
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

  function handleDaySelect(day, month, year, anotherMonth) {
    const nextSelectedDate = createNextDate(year, month, day);

    setState(function updateState(previousState) {
      return {
        ...previousState,
        displayDate: anotherMonth ? new Date(year, month, 1) : previousState.displayDate,
        selectedDate: nextSelectedDate,
        selectedDay: day,
        selectedMonth: month,
        selectedYear: year
      };
    });

    emitChange(nextSelectedDate);
  }

  function handleMonthSelect(month) {
    let nextSelectedDate = state.selectedDate;

    setState(function updateState(previousState) {
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

  function handleYearSelect(year) {
    let nextSelectedDate = state.selectedDate;

    setState(function updateState(previousState) {
      let nextMonth = previousState.selectedMonth;
      let nextDay = previousState.selectedDay;

      if (previousState.selectedMonth === 1 && previousState.selectedDay === 29 && getDaysInMonth(year, 1) < 29) {
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

  function getTitleLabel() {
    if (state.view === 'day') {
      return MONTH_NAMES[state.displayDate.getMonth()] + ' ' + state.displayDate.getFullYear();
    }

    if (state.view === 'month') {
      return String(state.displayDate.getFullYear());
    }

    return state.selectedDay + ' ' + MONTH_NAMES_GENITIVE[state.selectedMonth];
  }

  function renderDayView(snapshot) {
    return (
      <>
        <div className="rshb-legacy-calendar__weekdays">
          {DAY_NAMES.map(function renderWeekday(dayName) {
            return (
              <div className="rshb-legacy-calendar__weekday" key={dayName}>
                <span className="rshb-legacy-calendar__weekday-label">{dayName}</span>
              </div>
            );
          })}
        </div>
        <div className="rshb-legacy-calendar__weeks">
          {buildDayGrid(snapshot.displayDate).map(function renderWeek(week, weekIndex) {
            return (
              <div
                className="rshb-legacy-calendar__week"
                key={snapshot.displayDate.getFullYear() + '-' + snapshot.displayDate.getMonth() + '-' + weekIndex}
              >
                {week.map(function renderCell(cell) {
                  const isSelected =
                    cell.day === state.selectedDay && cell.month === state.selectedMonth && cell.year === state.selectedYear;
                  const cellDate = normalizeDate(new Date(cell.year, cell.month, cell.day));
                  const isOutOfRange =
                    (resolvedMinDate !== null && cellDate < resolvedMinDate) ||
                    (resolvedMaxDate !== null && cellDate > resolvedMaxDate);
                  const ariaLabel = cell.day + ' ' + MONTH_NAMES_GENITIVE[cell.month] + ' ' + cell.year;

                  return (
                    <CalendarDayItem
                      aria-label={ariaLabel}
                      anotherMonth={cell.anotherMonth}
                      day={cell.day}
                      disabled={isOutOfRange}
                      key={cell.year + '-' + cell.month + '-' + cell.day}
                      onClick={
                        isOutOfRange
                          ? undefined
                          : function onClick() {
                              handleDaySelect(cell.day, cell.month, cell.year, cell.anotherMonth);
                            }
                      }
                      selected={isSelected}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  function renderPeriodView(snapshot, items) {
    return (
      <div className="rshb-legacy-calendar__periods">
        {Array.from({ length: 4 }, function createRowIndex(_, rowIndex) {
          return rowIndex * 3;
        }).map(function renderRow(startIndex) {
          return (
            <div className="rshb-legacy-calendar__period-row" key={startIndex}>
              {items.slice(startIndex, startIndex + 3).map(function renderPeriod(label, itemIndex) {
                const index = startIndex + itemIndex;
                const isSelected =
                  snapshot.view === 'month'
                    ? state.selectedMonth === index && state.selectedYear === snapshot.displayDate.getFullYear()
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
                    onClick={
                      isDisabled
                        ? undefined
                        : function onClick() {
                            if (snapshot.view === 'month') {
                              handleMonthSelect(index);
                            } else {
                              handleYearSelect(snapshot.yearRangeStart + index);
                            }
                          }
                    }
                    selected={isSelected}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  function renderContent(snapshot) {
    if (snapshot.view === 'day') {
      return renderDayView(snapshot);
    }

    if (snapshot.view === 'month') {
      return renderPeriodView(snapshot, MONTH_NAMES_SHORT.slice());
    }

    return renderPeriodView(
      snapshot,
      Array.from({ length: 12 }, function createYearLabel(_, index) {
        return String(snapshot.yearRangeStart + index);
      })
    );
  }

  return (
    <div
      {...rootProps}
      className={joinClassNames('rshb-legacy-calendar', className)}
      data-view={state.view}
    >
      <div className="rshb-legacy-calendar__header">
        <button className="rshb-legacy-calendar__title-button" onClick={handleTitleClick} type="button">
          <span className="rshb-legacy-calendar__title-label">{getTitleLabel()}</span>
          <span aria-hidden="true" className="rshb-legacy-calendar__icon rshb-legacy-calendar__icon--title">
            <CalendarIcon direction="down" />
          </span>
        </button>

        <div className="rshb-legacy-calendar__actions">
          <button
            aria-label="Предыдущий период"
            className="rshb-legacy-calendar__action-button"
            disabled={!canNavigatePrevious}
            onClick={handlePrevious}
            type="button"
          >
            <span aria-hidden="true" className="rshb-legacy-calendar__icon rshb-legacy-calendar__icon--arrow">
              <CalendarIcon direction="left" />
            </span>
          </button>
          <button
            aria-label="Следующий период"
            className="rshb-legacy-calendar__action-button"
            disabled={!canNavigateNext}
            onClick={handleNext}
            type="button"
          >
            <span aria-hidden="true" className="rshb-legacy-calendar__icon rshb-legacy-calendar__icon--arrow">
              <CalendarIcon direction="right" />
            </span>
          </button>
        </div>
      </div>

      <div
        className="rshb-legacy-calendar__content"
        data-animating={animationState.running ? 'true' : 'false'}
        data-current-view={state.view}
        data-direction={animationState.direction === -1 ? 'backward' : 'forward'}
        style={contentStyle}
      >
        {animationState.outgoingSnapshot ? (
          <div className="rshb-legacy-calendar__content-panel rshb-legacy-calendar__content-panel--outgoing">
            {renderContent(animationState.outgoingSnapshot)}
          </div>
        ) : null}
        <div
          className={joinClassNames(
            'rshb-legacy-calendar__content-panel',
            animationState.running && 'rshb-legacy-calendar__content-panel--incoming'
          )}
        >
          {renderContent(currentSnapshot)}
        </div>
      </div>
    </div>
  );
}
