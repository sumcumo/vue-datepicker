import {
  isDateDisabledVia,
  isMonthDisabledVia,
  isYearDisabledVia,
} from './DisabledDatesUtils'

/**
 * Checks if the given date should be disabled
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {Object} utils
 * @param {Object} config
 * @return {Boolean}
 */
// eslint-disable-next-line complexity,max-statements,max-params
export const isDateDisabled = (date, disabledDates, utils, config) => {
  if (!config.exists) {
    return false
  }

  if (isDateDisabledVia.to(date, disabledDates, config)) {
    return true
  }

  if (isDateDisabledVia.from(date, disabledDates, config)) {
    return true
  }

  if (isDateDisabledVia.range(date, disabledDates, config)) {
    return true
  }

  if (isDateDisabledVia.specificDate(date, disabledDates, utils, config)) {
    return true
  }

  if (isDateDisabledVia.daysOfWeek(date, disabledDates, utils, config)) {
    return true
  }

  if (isDateDisabledVia.daysOfMonth(date, disabledDates, utils, config)) {
    return true
  }

  return isDateDisabledVia.customPredictor(date, disabledDates, config)
}

/**
 * Checks if the given month should be disabled
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {Object} utils
 * @param {Object} config
 * @return {Boolean}
 */
// eslint-disable-next-line complexity,max-statements,max-params
export const isMonthDisabled = (date, disabledDates, utils, config) => {
  if (!config.exists) {
    return false
  }

  const month = utils.getMonth(date)
  const year = utils.getFullYear(date)

  if (isMonthDisabledVia.to(month, year, config)) {
    return true
  }

  if (isMonthDisabledVia.from(month, year, config)) {
    return true
  }

  // now we have to check each day of the month
  const daysInMonth = utils.daysInMonth(year, month)

  for (let i = 1; i <= daysInMonth; i += 1) {
    const dayDate = new Date(date)
    dayDate.setDate(i)
    // if at least one day of this month is NOT disabled,
    // we can conclude that this month SHOULD be selectable
    if (!isDateDisabled(dayDate, disabledDates, utils, config)) {
      return false
    }
  }
  return true
}

/**
 * Checks if the given year should be disabled
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {Object} utils
 * @param {Object} config
 * @return {Boolean}
 */
// eslint-disable-next-line complexity,max-statements,max-params
export const isYearDisabled = (date, disabledDates, utils, config) => {
  if (!config.exists) {
    return false
  }

  const year = utils.getFullYear(date)

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
    if (!isMonthDisabled(monthDate, disabledDates, utils, config)) {
      return false
    }
  }
  return true
}
