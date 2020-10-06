import en from '~/locale/translations/en'

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
   * @param {Date} date1
   * @param {Date} date2
   */
  compareDates(date1, date2) {
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
      throw Error('missing 2nd paramter Months array')
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
  daysInMonth(year, month) {
    /* eslint-disable-next-line no-nested-ternary */
    return /8|3|5|10/.test(month) ? 30 : month === 1 ? (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28 : 31
  },

  /**
   * Get nth suffix for date
   * @param {Number} day
   * @return {String}
   */
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
  formatDate(date, formatStr, translation) {
    const translationTemp = (!translation) ? en : translation
    const year = this.getFullYear(date)
    const month = this.getMonth(date) + 1
    const day = this.getDate(date)
    return formatStr
      .replace(/dd/, (`0${day}`).slice(-2))
      .replace(/d/, day)
      .replace(/yyyy/, year)
      .replace(/yy/, String(year).slice(2))
      .replace(/MMMM/, this.getMonthName(this.getMonth(date), translationTemp.months))
      .replace(/MMM/, this.getMonthNameAbbr(this.getMonth(date), translationTemp.monthsAbbr))
      .replace(/MM/, (`0${month}`).slice(-2))
      .replace(/M(?![aäe])/, month)
      .replace(/o/, this.getNthSuffix(this.getDate(date)))
      .replace(/E(?![eéi])/, this.getDayNameAbbr(date, translationTemp.days))
  },

  /**
   * makes date parseable
   * to use with international dates
   * @param {String} dateStr
   * @param {String|Function} formatStr
   * @param {Object} translation
   * @param {Function} parser
   * @return {Date | String}
   */
  parseDate(dateStr, formatStr, translation, parser) {
    const translationTemp = (!translation) ? en : translation
    if (!(dateStr && formatStr)) {
      return dateStr
    }
    if (typeof formatStr === 'function') {
      if (!parser || typeof parser !== 'function') {
        throw new Error('Parser need to be a function if you are using a custom formatter')
      }
      return parser(dateStr)
    }
    const splitter = formatStr.match(/-|\/|\s|\./) || ['-']
    const df = formatStr.split(splitter[0])
    const ds = dateStr.split(splitter[0])
    const ymd = [
      0,
      0,
      0,
    ]
    for (let i = 0; i < df.length; i += 1) {
      if (/yyyy/i.test(df[i])) {
        ymd[0] = ds[i]
      } else if (/mmmm/i.test(df[i])) {
        ymd[1] = translationTemp.getMonthByName(ds[i])
      } else if (/mmm/i.test(df[i])) {
        ymd[1] = translationTemp.getMonthByAbbrName(ds[i])
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
    const dat = `${ymd.join('-')}T00:00:00Z`
    if (Number.isNaN(Date.parse(dat))) {
      return dateStr
    }
    return dat
  },

  /**
   * Creates an array of dates for each day in between two dates.
   * @param {Date} start
   * @param {Date} end
   * @return {Array}
   */
  createDateArray(start, end) {
    const dates = []
    let startTemp = start
    while (startTemp <= end) {
      dates.push(new Date(startTemp))
      startTemp = this.setDate(new Date(startTemp), this.getDate(new Date(startTemp)) + 1)
    }
    return dates
  },

  /**
   * Remove hours/minutes/seconds/milliseconds from a date object
   * @param {Date} date
   * @return {Date}
   */
  resetDateTime(date) {
    return new Date(this.useUtc ? date.setUTCHours(0, 0, 0, 0) : date.setHours(0, 0, 0, 0))
  },

  /**
   * Return a new date object with hours/minutes/seconds/milliseconds removed
   * @return {Date}
   */
  getNewDateObject(date) {
    return date ? this.resetDateTime(new Date(date)) : this.resetDateTime(new Date())
  },
}

export const makeDateUtils = (useUtc) => ({
  ...utils,
  useUtc,
})

export default {
  ...utils,
}
