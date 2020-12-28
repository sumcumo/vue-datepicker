/* eslint-disable no-underscore-dangle */

import makeCellUtils from './cellUtils'

export default class DisabledDate {
  constructor(utils, disabledDates) {
    this.utils = utils
    this.disabledDates = disabledDates
  }

  set utils(utils) {
    this._utils = utils
  }

  set disabledDates(disabledDates) {
    this._disabledDates = disabledDates
  }

  get config() {
    const dd = this._disabledDates
    const u = makeCellUtils(this._utils)

    return {
      exists: u.configExists(dd),
      to: u.dayMonthYear(dd, 'to'),
      from: u.dayMonthYear(dd, 'from'),
      has: {
        customPredictor: u.isDefined(dd, 'customPredictor'),
        daysOfMonth: u.hasArray(dd, 'daysOfMonth'),
        daysOfWeek: u.hasArray(dd, 'days'),
        from: u.hasDate(dd, 'from'),
        ranges: u.hasArray(dd, 'ranges'),
        specificDates: u.hasArray(dd, 'dates'),
        to: u.hasDate(dd, 'to'),
      },
    }
  }

  daysInMonth(date) {
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
        const u = makeCellUtils(this._utils)

        return ranges.some((thisRange) => {
          const hasFrom = u.isDefined(thisRange, 'from')
          const hasTo = u.isDefined(thisRange, 'to')

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
    for (let i = 1; i <= this.daysInMonth(date); i += 1) {
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
