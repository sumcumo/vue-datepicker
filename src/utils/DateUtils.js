import en from '~/locale/translations/en'

/**
 * Attempts to return a parseable date in the format 'yyyy-MM-dd'
 * @param {String} dateStr
 * @param {String} formatStr
 * @param {Object} translation
 * @param {Number} currentYear
 * @param {String} time
 * @return String
 */
// eslint-disable-next-line complexity,max-statements
const getParsableDate = ({
  dateStr,
  formatStr,
  translation,
  currentYear,
  time,
}) => {
  const splitter = formatStr.match(/-|\/|\s|\./) || ['-']
  const df = formatStr.split(splitter[0])
  const ds = dateStr.split(splitter[0])
  const ymd = [currentYear.toString(), '01', '01']

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
      ymd[2] = tmp < 10 ? `0${tmp}` : `${tmp}`
    }
  }

  return `${ymd.join('-')}${time}`
}

/**
 * Parses a date using a function passed in via the `parser` prop
 * @param  {String}   dateStr The string to parse
 * @param  {Function} format  The function that should be used to format the date
 * @param  {Function} parser  The function that should be used to parse the date
 * @return {Date | String}
 */
function parseDateWithLibrary(dateStr, format, parser) {
  if (typeof parser !== 'function') {
    throw new Error('Parser needs to be a function')
  }

  if (typeof format !== 'function') {
    throw new Error('Format needs to be a function when using a custom parser')
  }

  return parser(dateStr)
}

const utils = {
  /**
   * @type {Boolean}
   */
  useUtc: false,

  /**
   * Returns the full year, using UTC or not
   * @param {Date} date
   */
  getFullYear(date) {
    return this.useUtc ? date.getUTCFullYear() : date.getFullYear()
  },

  /**
   * Returns the month, using UTC or not
   * @param {Date} date
   */
  getMonth(date) {
    return this.useUtc ? date.getUTCMonth() : date.getMonth()
  },

  /**
   * Returns the number of days in the month, using UTC or not
   * @param {Date} date
   */
  getDaysInMonth(date) {
    return this.daysInMonth(this.getFullYear(date), this.getMonth(date))
  },

  /**
   * Returns the date, using UTC or not
   * @param {Date} date
   */
  getDate(date) {
    return this.useUtc ? date.getUTCDate() : date.getDate()
  },

  /**
   * Returns the day, using UTC or not
   * @param {Date} date
   */
  getDay(date) {
    return this.useUtc ? date.getUTCDay() : date.getDay()
  },

  /**
   * Returns the hours, using UTC or not
   * @param {Date} date
   */
  getHours(date) {
    return this.useUtc ? date.getUTCHours() : date.getHours()
  },

  /**
   * Returns the minutes, using UTC or not
   * @param {Date} date
   */
  getMinutes(date) {
    return this.useUtc ? date.getUTCMinutes() : date.getMinutes()
  },

  /**
   * Sets the full year, using UTC or not
   * @param {Date} date
   * @param {String, Number} value
   */
  setFullYear(date, value) {
    return this.useUtc ? date.setUTCFullYear(value) : date.setFullYear(value)
  },

  /**
   * Sets the month, using UTC or not
   * @param {Date} date
   * @param {String, Number} value
   */
  setMonth(date, value) {
    return this.useUtc ? date.setUTCMonth(value) : date.setMonth(value)
  },

  /**
   * Sets the date, using UTC or not
   * @param {Date} date
   * @param {String, Number} value
   */
  setDate(date, value) {
    return this.useUtc ? date.setUTCDate(value) : date.setDate(value)
  },

  /**
   * Check if date1 is equivalent to date2, without comparing the time
   * @see https://stackoverflow.com/a/6202196/4455925
   * @param {Date|null} date1
   * @param {Date|null} date2
   */
  // eslint-disable-next-line complexity
  compareDates(date1, date2) {
    if (date1 === null && date2 === null) {
      return true
    }

    if (
      (date1 !== null && date2 === null) ||
      (date2 !== null && date1 === null)
    ) {
      return false
    }

    const d1 = new Date(date1.valueOf())
    const d2 = new Date(date2.valueOf())

    this.resetDateTime(d1)
    this.resetDateTime(d2)
    return d1.valueOf() === d2.valueOf()
  },

  /**
   * Validates a date object
   * @param {Date} date - an object instantiated with the new Date constructor
   * @return {Boolean}
   */
  isValidDate(date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false
    }
    return !Number.isNaN(date.valueOf())
  },

  /**
   * Return abbreviated week day name
   * @param {Date} date
   * @param {Array} days
   * @return {String}
   */
  getDayNameAbbr(date, days) {
    if (typeof date !== 'object') {
      throw TypeError('Invalid Type')
    }
    return days[this.getDay(date)]
  },

  /**
   * Return day number from abbreviated week day name
   * @param {String} abbr
   * @return {Number}
   */
  getDayFromAbbr(abbr) {
    for (let i = 0; i < en.days.length; i += 1) {
      if (abbr.toLowerCase() === en.days[i].toLowerCase()) {
        return i
      }
    }
    throw TypeError('Invalid week day')
  },

  /**
   * Return name of the month
   * @param {Number|Date} month
   * @param {Array} months
   * @return {String}
   */
  getMonthName(month, months) {
    if (!months) {
      throw Error('missing 2nd parameter Months array')
    }
    if (typeof month === 'object') {
      return months[this.getMonth(month)]
    }
    if (typeof month === 'number') {
      return months[month]
    }
    throw TypeError('Invalid type')
  },

  /**
   * Return an abbreviated version of the month
   * @param {Number|Date} month
   * @param {Array} monthsAbbr
   * @return {String}
   */
  getMonthNameAbbr(month, monthsAbbr) {
    if (!monthsAbbr) {
      throw Error('missing 2nd parameter Months array')
    }
    if (typeof month === 'object') {
      return monthsAbbr[this.getMonth(month)]
    }
    if (typeof month === 'number') {
      return monthsAbbr[month]
    }
    throw TypeError('Invalid type')
  },

  /**
   * Alternative get total number of days in month
   * @param {Number} year
   * @param {Number} month
   * @return {Number}
   */
  // eslint-disable-next-line complexity
  daysInMonth(year, month) {
    if (/8|3|5|10/.test(month.toString())) {
      return 30
    }
    if (month === 1) {
      return (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28
    }
    return 31
  },

  /**
   * Get nth suffix for date
   * @param {Number} day
   * @return {String}
   */
  // eslint-disable-next-line complexity
  getNthSuffix(day) {
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
  },

  /**
   * Formats date object
   * @param {Date} date
   * @param {String} formatStr
   * @param {Object} translation
   * @return {String}
   */
  formatDate(date, formatStr, translation = en) {
    const year = this.getFullYear(date)
    const month = this.getMonth(date) + 1
    const day = this.getDate(date)

    const matches = {
      d: day,
      dd: `0${day}`.slice(-2),
      E: this.getDayNameAbbr(date, translation.days),
      o: this.getNthSuffix(this.getDate(date)),
      M: month,
      MM: `0${month}`.slice(-2),
      MMM: this.getMonthNameAbbr(this.getMonth(date), translation.monthsAbbr),
      MMMM: this.getMonthName(this.getMonth(date), translation.months),
      yy: String(year).slice(2),
      yyyy: year,
    }

    const REGEX_FORMAT = /y{4}|y{2}|M{1,4}|d{1,2}|o|E/g

    return formatStr.replace(REGEX_FORMAT, (match) => matches[match])
  },

  /**
   * Parses a date from a string, or returns the original string
   * @param {String}          dateStr
   * @param {String|Function} format
   * @param {Object}          translation
   * @param {Function}        parser
   * @return {Date | String}
   */
  // eslint-disable-next-line max-params
  parseDate(dateStr, format, translation = en, parser = null) {
    if (!(dateStr && format)) {
      return dateStr
    }

    if (parser) {
      return parseDateWithLibrary(dateStr, format, parser)
    }

    const parseableDate = getParsableDate({
      dateStr,
      formatStr: format,
      translation,
      currentYear: this.getFullYear(new Date()),
      time: this.getTime(),
    })
    const parsedDate = Date.parse(parseableDate)

    if (Number.isNaN(parsedDate)) {
      return dateStr
    }

    return new Date(parsedDate)
  },

  getTime() {
    const time = 'T00:00:00'

    return this.useUtc ? `${time}Z` : time
  },

  /**
   * Remove hours/minutes/seconds/milliseconds from a date object
   * @param {Date} date
   * @return {Date}
   */
  resetDateTime(date) {
    return new Date(
      this.useUtc ? date.setUTCHours(0, 0, 0, 0) : date.setHours(0, 0, 0, 0),
    )
  },

  /**
   * Create a date object from a month and year, using UTC or not
   * @param {Number} year
   * @param {Number} monthIndex
   * @return {Date}
   */
  monthYearDate(year, monthIndex) {
    return this.useUtc
      ? new Date(Date.UTC(year, monthIndex, 1))
      : new Date(year, monthIndex, 1)
  },

  /**
   * Return a new date object with hours/minutes/seconds/milliseconds removed.
   * Defaults to today's date, if no parameter is provided
   * @param {Date=} date
   * @return {Date}
   */
  getNewDateObject(date) {
    return date
      ? this.resetDateTime(new Date(date))
      : this.resetDateTime(new Date())
  },

  /**
   * Converts a date according to a given view
   * e.g. '2025-05-15' becomes '2025-05-01' at `month view and
   * '2025-01-01' at `year` view
   * @param  {Date}   dateToConvert  The date to convert
   * @param  {String} view           The view for which to adjust the date
   * @return {Date}
   */
  adjustDateToView(dateToConvert, view) {
    const date = this.getNewDateObject(dateToConvert)

    if (view === 'year') {
      const resetDay = new Date(this.setDate(date, 1))
      const resetMonth = this.setMonth(resetDay, 0)
      return new Date(resetMonth)
    }

    if (view === 'month') {
      return new Date(this.setDate(date, 1))
    }

    return date
  },
}

export default (useUtc) => ({
  ...utils,
  useUtc,
})
