/* eslint-disable no-underscore-dangle */

import { configExists, isDefined, isDefinedAsDate } from './CellUtils'

export default class DisabledDate {
  constructor(utils, disabledDates) {
    this.utils = utils
    this.disabledDates = disabledDates
  }

  set utils(utils) {
    if (typeof utils !== 'object') {
      throw new TypeError('utils must be an object')
    }

    this._utils = utils
  }

  set disabledDates(disabledDates) {
    if (typeof disabledDates !== 'object') {
      this._disabledDates = undefined
    }
    this._disabledDates = disabledDates
  }

  // eslint-disable-next-line complexity
  get config() {
    const dd = this._disabledDates
    const utils = this._utils
    const hasFrom = isDefinedAsDate(dd, 'from')
    const hasTo = isDefinedAsDate(dd, 'to')

    return {
      exists: configExists(dd),
      to: {
        day: hasTo ? utils.getDate(dd.to) : null,
        month: hasTo ? utils.getMonth(dd.to) : null,
        year: hasTo ? utils.getFullYear(dd.to) : null,
      },
      from: {
        day: hasFrom ? utils.getDate(dd.from) : null,
        month: hasFrom ? utils.getMonth(dd.from) : null,
        year: hasFrom ? utils.getFullYear(dd.from) : null,
      },
      has: {
        customPredictor: isDefined(dd, 'customPredictor'),
        daysOfMonth: isDefined(dd, 'daysOfMonth'),
        daysOfWeek: isDefined(dd, 'days'),
        from: hasFrom,
        ranges: isDefined(dd, 'ranges') && dd.ranges.length > 0,
        specificDates: isDefined(dd, 'dates') && dd.dates.length > 0,
        to: hasTo,
      },
    }
  }

  hasDisabledFrom = (disabledDates) => {
    return disabledDates && typeof disabledDates.from !== 'undefined'
  }

  hasDisabledTo = (disabledDates) => {
    return disabledDates && typeof disabledDates.to !== 'undefined'
  }

  daysInMonth = (date) => {
    const utils = this._utils
    const month = utils.getMonth(date)
    const year = utils.getFullYear(date)

    return utils.daysInMonth(year, month)
  }

  isDateDisabledVia(date) {
    const dd = this._disabledDates
    const { has } = this.config

    return {
      to: () => {
        return has.to && date < dd.to
      },
      from: () => {
        return has.from && date > dd.from
      },
      range: () => {
        if (!has.ranges) return false

        const { ranges } = dd

        return ranges.some((thisRange) => {
          const hasFrom = this.hasDisabledFrom(thisRange)
          const hasTo = this.hasDisabledTo(thisRange)

          return (
            hasFrom && hasTo && date < thisRange.to && date > thisRange.from
          )
        })
      },
      customPredictor: () => {
        return has.customPredictor && dd.customPredictor(date)
      },
      specificDate: () => {
        if (!has.specificDates) return false

        return dd.dates.some((d) => {
          return this._utils.compareDates(date, d)
        })
      },
      daysOfWeek: () => {
        if (!has.daysOfWeek) return false

        return dd.days.indexOf(this._utils.getDay(date)) !== -1
      },
      daysOfMonth: () => {
        if (!has.daysOfMonth) return false

        return dd.daysOfMonth.indexOf(this._utils.getDate(date)) !== -1
      },
    }
  }

  isMonthDisabledVia(date) {
    const { config } = this
    const { has } = config
    const { to } = config
    const { from } = config
    const month = this._utils.getMonth(date)
    const year = this._utils.getFullYear(date)

    return {
      to: () => {
        const isYearInPast = has.to && year < to.year

        if (isYearInPast) {
          return true
        }

        return has.to && month < to.month && year <= to.year
      },
      from: () => {
        const isYearInFuture = has.from && year > from.year

        if (isYearInFuture) {
          return true
        }

        return has.from && month > from.month && year >= from.year
      },
    }
  }

  isYearDisabledVia(date) {
    const { has } = this.config
    const { to } = this.config
    const { from } = this.config
    const year = this._utils.getFullYear(date)

    return {
      to: () => {
        return has.to && year < to.year
      },
      from: () => {
        return has.from && year < from.year
      },
    }
  }

  /**
   * Checks if the given date should be disabled
   * @param {Date} date
   * @return {Boolean}
   */
  // eslint-disable-next-line complexity,max-statements
  isDateDisabled(date) {
    if (!this.config.exists) return false

    const isDisabledVia = this.isDateDisabledVia(date)

    if (isDisabledVia.to()) {
      return true
    }

    if (isDisabledVia.from()) {
      return true
    }

    if (isDisabledVia.range()) {
      return true
    }

    if (isDisabledVia.specificDate()) {
      return true
    }

    if (isDisabledVia.daysOfWeek()) {
      return true
    }

    if (isDisabledVia.daysOfMonth()) {
      return true
    }

    return isDisabledVia.customPredictor()
  }

  /**
   * Checks if the given month should be disabled
   * @param {Date} date
   * @return {Boolean}
   */
  // eslint-disable-next-line complexity,max-statements
  isMonthDisabled(date) {
    const { config } = this
    const isDisabledVia = this.isMonthDisabledVia(date)

    if (!config.exists) {
      return false
    }

    if (isDisabledVia.to()) {
      return true
    }

    if (isDisabledVia.from()) {
      return true
    }

    // now we have to check each day of the month
    const daysInMonth = this.daysInMonth(date)

    for (let i = 1; i <= daysInMonth; i += 1) {
      const dayDate = new Date(date)
      dayDate.setDate(i)
      // if at least one day of this month is NOT disabled,
      // we can conclude that this month SHOULD be selectable
      if (!this.isDateDisabled(dayDate)) {
        return false
      }
    }

    return true
  }

  /**
   * Checks if the given year should be disabled
   * @param {Date} date
   * @return {Boolean}
   */
  // eslint-disable-next-line complexity,max-statements
  isYearDisabled(date) {
    const { config } = this
    const isDisabledVia = this.isYearDisabledVia(date)

    if (!config.exists) {
      return false
    }

    if (isDisabledVia.to()) {
      return true
    }

    if (isDisabledVia.from()) {
      return true
    }

    // now we have to check each month of the year
    for (let i = 0; i < 12; i += 1) {
      const monthDate = new Date(date)
      monthDate.setMonth(i)
      // if at least one month of this year is NOT disabled,
      // we can conclude that this year SHOULD be selectable
      if (!this.isMonthDisabled(monthDate)) {
        return false
      }
    }

    return true
  }
}
