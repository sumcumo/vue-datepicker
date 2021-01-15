/* eslint-disable no-underscore-dangle */

import makeCellUtils from './cellUtils'

export default class DisabledDate {
  constructor(utils, disabledDates) {
    this._utils = utils
    this._disabledDates = disabledDates
  }

  get config() {
    const disabledDates = this._disabledDates
    const utils = makeCellUtils(this._utils)

    return {
      exists: utils.configExists(disabledDates),
      to: utils.dayMonthYear(disabledDates, 'to'),
      from: utils.dayMonthYear(disabledDates, 'from'),
      has: {
        customPredictor: utils.isDefined(disabledDates, 'customPredictor'),
        daysOfMonth: utils.hasArray(disabledDates, 'daysOfMonth'),
        daysOfWeek: utils.hasArray(disabledDates, 'days'),
        from: utils.hasDate(disabledDates, 'from'),
        ranges: utils.hasArray(disabledDates, 'ranges'),
        specificDates: utils.hasArray(disabledDates, 'dates'),
        to: utils.hasDate(disabledDates, 'to'),
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
    const disabledDates = this._disabledDates
    const { has } = this.config

    return {
      to: () => {
        return has.to && date < disabledDates.to
      },
      from: () => {
        return has.from && date > disabledDates.from
      },
      range: () => {
        if (!has.ranges) return false

        const { ranges } = disabledDates
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
        return has.customPredictor && disabledDates.customPredictor(date)
      },
      specificDate: () => {
        if (!has.specificDates) return false

        return disabledDates.dates.some((d) => {
          return this._utils.compareDates(date, d)
        })
      },
      daysOfWeek: () => {
        if (!has.daysOfWeek) return false

        return disabledDates.days.indexOf(this._utils.getDay(date)) !== -1
      },
      daysOfMonth: () => {
        if (!has.daysOfMonth) return false

        return (
          disabledDates.daysOfMonth.indexOf(this._utils.getDate(date)) !== -1
        )
      },
    }
  }

  isMonthDisabledVia(date) {
    const { from, has, to } = this.config
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
    const { from, has, to } = this.config
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

    return (
      isDisabledVia.to() ||
      isDisabledVia.from() ||
      isDisabledVia.range() ||
      isDisabledVia.specificDate() ||
      isDisabledVia.daysOfWeek() ||
      isDisabledVia.daysOfMonth() ||
      isDisabledVia.customPredictor()
    )
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

    if (isDisabledVia.to() || isDisabledVia.from()) {
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

    if (isDisabledVia.to() || isDisabledVia.from()) {
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
