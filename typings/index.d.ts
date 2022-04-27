declare module 'vue-datepicker'

type View = '' | 'day' | 'month' | 'year'

interface NextView {
  up: undefined | View | 'decade'
  down: undefined | View
}

type Days = [string, string, string, string, string, string, string]

type Months = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
]

type FixedPosition =
  | ''
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'top-left'
  | 'top-right'

type SlotName = beforeDateInput | afterDateInput | clearBtn | calendarBtn

interface Cell {
  timestamp: number
  isDisabled: boolean
  isOpenDate: boolean
  isSelected: boolean
  isToday: boolean
}

export interface DayCell extends Cell {
  type?: 'day'
  date: string
  isHighlightStart: boolean
  isHighlightEnd: boolean
  isHighlighted: boolean
  isPreviousMonth: boolean
  isNextMonth: boolean
  isSaturday: boolean
  isSunday: boolean
  isWeekend: boolean
}

export interface MonthCell extends Cell {
  type?: 'month'
  month: string
}

export interface YearCell extends Cell {
  type?: 'year'
  year: string
}

interface Translation {
  language: string
  months: Months
  monthsAbbr: Months
  days: Days
  rtl: boolean
  ymd: boolean
  yearSuffix: string

  getDaysStartingOn(_firstDayOfWeek: number): string[]
  getMonthByAbbrName(_name: string): string
  getMonthByName(_name: string): string
}

interface DayMonthYear {
  day: number | undefined
  month: number | undefined
  year: number | undefined
}

interface Range {
  to: Date
  from: Date
}

interface DisabledDates {
  to: Date
  from: Date
  range: Range
  ranges: Range[]
  customPredictor: (_date: Date) => boolean
  dates: Date[]
  days: number[]
  daysOfMonth: number[]
}

interface Highlighted extends DisabledDates {
  includeDisabled: boolean
}

type DisabledOrHighlighted = DisabledDates | Highlighted

type LibraryParser = (_: string) => Date | string

interface Matches {
  d: string
  dd: string
  E: string
  o: string
  M: string
  MM: string
  MMM: string
  MMMM: string
  yy: string
  yyyy: string
}

type BaseFocusRefs = 'prev' | 'next' | 'arrow-to-cell'

type FocusRefs =
  | BaseFocusRefs
  | 'calendarButton'
  | 'input'
  | 'openDate'
  | 'tabbableCell'
  | 'up'

interface IncrementPageOptions {
  focusRefs: BaseFocusRefs[]
  incrementBy: -1 | 1
}

interface PageChangeOptions {
  focusRefs: BaseFocusRefs[]
  pageDate: Date
}

interface ArrowOptions {
  /** The element currently being iterated on */
  currentElement: HTMLButtonElement
  /** The number of cells that the focus should move */
  delta: 1 | -1
  /** The number of steps remaining in the iteration */
  stepsRemaining: number
}

interface Focus {
  delay: number
  refs: Array<FocusRefs>
}

interface PopupConfig {
  el: Element
  /** Relative element */
  elRelative: Element
  /** Target element's width */
  targetWidth: number
  /** Target element's height */
  targetHeight: number
  appendToBody: boolean
  fixedPosition: string
  rtl: boolean
}

interface PopupRect {
  width: number
  height: number
}
