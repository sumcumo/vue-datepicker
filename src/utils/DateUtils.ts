import en from '../locale/translations/en'
import {
  Days,
  LibraryParser,
  Matches,
  Months,
  Translation,
} from '../../typings'

export default class DateUtils {
  /**
   * Whether to use UTC time
   */
  useUtc: boolean

  constructor(useUtc: boolean) {
    this.useUtc = useUtc
  }

  /**
   * Returns the full year, using UTC or not
   */
  getFullYear(date: Date) {
    return this.useUtc ? date.getUTCFullYear() : date.getFullYear()
  }

  /**
   * Returns the month, using UTC or not
   */
  getMonth(date: Date) {
    return this.useUtc ? date.getUTCMonth() : date.getMonth()
  }

  /**
   * Returns the number of days in the month, using UTC or not
   */
  getDaysInMonth(date: Date) {
    return this.daysInMonth(this.getFullYear(date), this.getMonth(date))
  }

  /**
   * Returns the date, using UTC or not
   */
  getDate(date: Date) {
    return this.useUtc ? date.getUTCDate() : date.getDate()
  }

  /**
   * Returns the day, using UTC or not
   */
  getDay(date: Date) {
    return this.useUtc ? date.getUTCDay() : date.getDay()
  }

  /**
   * Returns the hours, using UTC or not
   */
  getHours(date: Date) {
    return this.useUtc ? date.getUTCHours() : date.getHours()
  }

  /**
   * Returns the minutes, using UTC or not
   */
  getMinutes(date: Date) {
    return this.useUtc ? date.getUTCMinutes() : date.getMinutes()
  }

  /**
   * Sets the full year, using UTC or not
   */
  setFullYear(date: Date, value: number) {
    return this.useUtc ? date.setUTCFullYear(value) : date.setFullYear(value)
  }

  /**
   * Sets the month, using UTC or not
   */
  setMonth(date: Date, value: number) {
    return this.useUtc ? date.setUTCMonth(value) : date.setMonth(value)
  }

  /**
   * Sets the date, using UTC or not
   */
  setDate(date: Date, value: number) {
    return this.useUtc ? date.setUTCDate(value) : date.setDate(value)
  }

  /**
   * Check if date1 is equivalent to date2, without comparing the time
   * @see https://stackoverflow.com/a/6202196/4455925
   */
  compareDates(date1: Date, date2: Date) {
    const d1 = new Date(date1.valueOf())
    const d2 = new Date(date2.valueOf())

    this.resetDateTime(d1)
    this.resetDateTime(d2)
    return d1.valueOf() === d2.valueOf()
  }

  /**
   * Validates a date object
   */
  isValidDate(date: any) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false
    }
    return !Number.isNaN(date.valueOf())
  }

  /**
   * Return abbreviated week day name
   */
  getDayNameAbbr(date: Date, days: Days) {
    return days[this.getDay(date)]
  }

  /**
   * Return day number from abbreviated week day name
   */
  getDayFromAbbr(abbr: string) {
    for (let i = 0; i < en.days.length; i += 1) {
      if (abbr.toLowerCase() === en.days[i].toLowerCase()) {
        return i
      }
    }
    throw TypeError('Invalid week day')
  }

  /**
   * Return name of the month
   */
  getMonthName(month: Date | number, months: Months) {
    if (month instanceof Date) {
      return months[this.getMonth(month)]
    }

    return months[month]
  }

  /**
   * Return an abbreviated version of the month
   */
  getMonthNameAbbr(month: Date | number, monthsAbbr: Months) {
    if (month instanceof Date) {
      return monthsAbbr[this.getMonth(month)]
    }

    return monthsAbbr[month]
  }

  /**
   * Alternative get total number of days in month
   */
  // eslint-disable-next-line complexity
  daysInMonth(year: number, month: number) {
    if (/8|3|5|10/.test(month.toString())) {
      return 30
    }
    if (month === 1) {
      return (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28
    }
    return 31
  }

  /**
   * Get nth suffix for date
   */
  // eslint-disable-next-line complexity
  getNthSuffix(day: number) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return 'st'
      case 2:
      case 22:
        return 'nd'
      case 3:
      case 23:
        return 'rd'
      default:
        return 'th'
    }
  }

  /**
   * Attempts to return a parseable date in the format 'yyyy-MM-dd'
   */
  // eslint-disable-next-line complexity,max-statements,max-params
  getParsableDate(
    formatStr: string,
    dateStr: string,
    translation: Translation,
    time: string,
  ) {
    const splitter = formatStr.match(/-|\/|\s|\./) || ['-']
    const df = formatStr.split(splitter[0])
    const ds = dateStr.split(splitter[0])
    const ymd = [new Date().getFullYear().toString(), '01', '01']

    for (let i = 0; i < df.length; i += 1) {
      if (/yyyy/i.test(df[i])) {
        ymd[0] = ds[i]
      } else if (/mmmm/i.test(df[i])) {
        ymd[1] = translation.getMonthByName(ds[i])
      } else if (/mmm/i.test(df[i])) {
        ymd[1] = translation.getMonthByAbbrName(ds[i])
      } else if (/mm/i.test(df[i])) {
        ymd[1] = ds[i]
      } else if (/m/i.test(df[i])) {
        ymd[1] = ds[i]
      } else if (/dd/i.test(df[i])) {
        ymd[2] = ds[i]
      } else if (/d/i.test(df[i])) {
        const tmp = ds[i].replace(/st|rd|nd|th/g, '')
        ymd[2] = +tmp < 10 ? `0${tmp}` : `${tmp}`
      }
    }

    return `${ymd.join('-')}${time}`
  }

  /**
   * Formats date object
   */
  formatDate(date: Date, formatStr: string, translation = en) {
    const year = this.getFullYear(date)
    const month = this.getMonth(date) + 1
    const day = this.getDate(date)

    const matches: Matches = {
      d: day.toString(),
      dd: `0${day}`.slice(-2),
      E: this.getDayNameAbbr(date, translation.days),
      o: this.getNthSuffix(this.getDate(date)),
      M: month.toString(),
      MM: `0${month}`.slice(-2),
      MMM: this.getMonthNameAbbr(this.getMonth(date), translation.monthsAbbr),
      MMMM: this.getMonthName(this.getMonth(date), translation.months),
      yy: String(year).slice(2),
      yyyy: year.toString(),
    }

    const REGEX_FORMAT = /y{4}|y{2}|M{1,4}(?![aäe])|d{1,2}|o|E(?![eéi])/g
    return formatStr.replace(
      REGEX_FORMAT,
      ((match: keyof Matches) => matches[match] || match) as any,
    )
  }

  /**
   * Parses a date from a string, or returns the original string
   */
  // eslint-disable-next-line max-params
  parseDate(
    dateStr: string,
    formatStr: string | Function,
    translation = en,
    parser: LibraryParser,
  ) {
    if (!(dateStr && formatStr)) {
      return dateStr
    }

    if (typeof formatStr === 'function') {
      return this.parseDateWithLibrary(dateStr, parser)
    }

    const parseableDate = this.getParsableDate(
      formatStr,
      dateStr,
      translation,
      this.getTime(),
    )
    const parsedDate = Date.parse(parseableDate)

    if (Number.isNaN(parsedDate)) {
      return dateStr
    }

    return new Date(parsedDate)
  }

  /**
   * Parses a date using a function passed in via the `parser` prop
   */
  parseDateWithLibrary(dateStr: string, parser: LibraryParser) {
    if (!parser || typeof parser !== 'function') {
      throw new Error(
        'Parser needs to be a function if you are using a custom formatter',
      )
    }

    return parser(dateStr)
  }

  getTime() {
    const time = 'T00:00:00'

    return this.useUtc ? `${time}Z` : time
  }

  /**
   * Creates an array of dates for each day in between two dates.
   */
  createDateArray(start: Date, end: Date) {
    const dates = []
    let startTemp = start

    while (startTemp <= end) {
      dates.push(new Date(startTemp))
      startTemp = new Date(
        this.setDate(
          new Date(startTemp),
          this.getDate(new Date(startTemp)) + 1,
        ),
      )
    }

    return dates
  }

  /**
   * Remove hours/minutes/seconds/milliseconds from a date object
   */
  resetDateTime(date: Date) {
    return new Date(
      this.useUtc ? date.setUTCHours(0, 0, 0, 0) : date.setHours(0, 0, 0, 0),
    )
  }

  /**
   * Return a new date object with hours/minutes/seconds/milliseconds removed.
   * Defaults to today's date, if no parameter is provided
   */
  getNewDateObject(date?: Date) {
    return date
      ? this.resetDateTime(new Date(date))
      : this.resetDateTime(new Date())
  }
}
