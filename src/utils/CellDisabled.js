import { configExists, isDefined, isDefinedAsDate } from './cell/CellUtils'
import {
  isDateDisabledVia,
  isMonthDisabledVia,
  isYearDisabledVia,
} from './cell/DisabledVia'

// eslint-disable-next-line complexity
const makeDisabledConfig = (utils, disabledDates) => {
  const dd = disabledDates

  const hasFrom = isDefinedAsDate(disabledDates, 'from')
  const hasTo = isDefinedAsDate(disabledDates, 'to')

  return {
    exists: configExists(disabledDates),
    disabledDates,
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

const cellDisabled = {
  utils: null,

  disabledConfig: null,

  /**
   * Checks if the given date should be disabled
   * @param {Date} date
   * @return {Boolean}
   */
  // eslint-disable-next-line complexity,max-statements
  isDateDisabled(date) {
    const config = this.disabledConfig

    if (!config.exists) {
      return false
    }

    if (isDateDisabledVia.to(date, config)) {
      return true
    }

    if (isDateDisabledVia.from(date, config)) {
      return true
    }

    if (isDateDisabledVia.range(date, config)) {
      return true
    }

    if (isDateDisabledVia.specificDate(date, this.utils, config)) {
      return true
    }

    if (isDateDisabledVia.daysOfWeek(date, this.utils, config)) {
      return true
    }

    if (isDateDisabledVia.daysOfMonth(date, this.utils, config)) {
      return true
    }

    return isDateDisabledVia.customPredictor(date, config)
  },

  /**
   * Checks if the given month should be disabled
   * @param {Date} date
   * @return {Boolean}
   */
  // eslint-disable-next-line complexity,max-statements
  isMonthDisabled(date) {
    const config = this.disabledConfig

    if (!config.exists) {
      return false
    }

    const month = this.utils.getMonth(date)
    const year = this.utils.getFullYear(date)

    if (isMonthDisabledVia.to(month, year, config)) {
      return true
    }

    if (isMonthDisabledVia.from(month, year, config)) {
      return true
    }

    // now we have to check each day of the month
    const daysInMonth = this.utils.daysInMonth(year, month)

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
  },

  /**
   * Checks if the given year should be disabled
   * @param {Date} date
   * @return {Boolean}
   */
  // eslint-disable-next-line complexity,max-statements
  isYearDisabled(date) {
    const config = this.disabledConfig

    if (!config.exists) {
      return false
    }

    const year = this.utils.getFullYear(date)

    if (isYearDisabledVia.to(year, config)) {
      return true
    }

    if (isYearDisabledVia.from(year, config)) {
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
  },
}

export default (utils, disabledDates) => ({
  ...cellDisabled,
  utils,
  disabledConfig: makeDisabledConfig(utils, disabledDates),
})
