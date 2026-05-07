import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

export type LegacyCalendarView = 'day' | 'month' | 'year';
export type LegacyCalendarItemPreviewState = 'default' | 'hover' | 'focused';

export interface LegacyCalendarDayItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  anotherMonth?: boolean;
  day: number;
  previewState?: LegacyCalendarItemPreviewState;
  selected?: boolean;
}

export interface LegacyCalendarPeriodItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  previewState?: LegacyCalendarItemPreviewState;
  selected?: boolean;
}

export interface LegacyCalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'value'> {
  defaultValue?: Date;
  initialView?: LegacyCalendarView;
  maxDate?: Date;
  minDate?: Date;
  onChange?: (value: Date) => void;
  value?: Date;
}

export function CalendarDayItem(props: LegacyCalendarDayItemProps): JSX.Element;
export function CalendarPeriodItem(props: LegacyCalendarPeriodItemProps): JSX.Element;
export default function Calendar(props: LegacyCalendarProps): JSX.Element;
