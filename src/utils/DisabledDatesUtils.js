const checkDateSpecific = (date, disabledDates, utils) => {
  if (typeof disabledDates.dates !== 'undefined' && disabledDates.dates.length) {
    const { dates } = disabledDates
    for (let i = 0; i < dates.length; i += 1) {
      if (utils.compareDates(date, dates[i])) {
        return true
      }
    }
  }
  return false
}

const checkDateDisabledFromTo = (date, disabledDates) => {
  if (typeof disabledDates.to !== 'undefined' && disabledDates.to && date < disabledDates.to) {
    return true
  }
  if (
    typeof disabledDates.from !== 'undefined'
    && disabledDates.from
    && date > disabledDates.from
  ) {
    return true
  }
  return false
}

const checkDateRange = (date, disabledDates) => {
  if (typeof disabledDates.ranges !== 'undefined' && disabledDates.ranges.length) {
    const { ranges } = disabledDates
    for (let i = 0; i < ranges.length; i += 1) {
      const range = ranges[i]
      if (
        typeof range.from !== 'undefined'
        && range.from
        && typeof range.to !== 'undefined'
        && range.to
      ) {
        if (date < range.to && date > range.from) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * Checks if the given date should be disabled according to the specified config
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {DateUtils} utils
 * @return {Boolean}
 */
export const isDateDisabled = (date, disabledDates, utils) => {
  // skip if no config
  if (typeof disabledDates === 'undefined') {
    return false
  }

  // check specific dates
  if (checkDateSpecific(date, disabledDates, utils)) {
    return true
  }

  if (checkDateDisabledFromTo(date, disabledDates)) {
    return true
  }

  // check date ranges
  if (checkDateRange(date, disabledDates)) {
    return true
  }

  if (
    typeof disabledDates.days !== 'undefined'
    && disabledDates.days.indexOf(utils.getDay(date)) !== -1
  ) {
    return true
  }
  if (
    typeof disabledDates.daysOfMonth !== 'undefined'
    && disabledDates.daysOfMonth.indexOf(utils.getDate(date)) !== -1
  ) {
    return true
  }
  if (
    typeof disabledDates.customPredictor === 'function'
    && disabledDates.customPredictor(date)
  ) {
    return true
  }

  return false
}

/**
 * Checks if the given month should be disabled according to the specified config
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {DateUtils} utils
 * @return {Boolean}
 */
export const isMonthDisabled = (date, disabledDates, utils) => {
  // skip if no config
  if (typeof disabledDates === 'undefined') {
    return false
  }

  // check if the whole month is disabled before checking every individual days
  if (typeof disabledDates.to !== 'undefined' && disabledDates.to) {
    if (
      (
        utils.getMonth(date) < utils.getMonth(disabledDates.to)
        && utils.getFullYear(date) <= utils.getFullYear(disabledDates.to)
      )
      || utils.getFullYear(date) < utils.getFullYear(disabledDates.to)
    ) {
      return true
    }
  }
  if (typeof disabledDates.from !== 'undefined' && disabledDates.from) {
    if (
      (
        utils.getMonth(date) > utils.getMonth(disabledDates.from)
        && utils.getFullYear(date) >= utils.getFullYear(disabledDates.from)
      )
      || utils.getFullYear(date) > utils.getFullYear(disabledDates.from)
    ) {
      return true
    }
  }

  // now we have to check every days of the month
  const daysInMonth = utils.daysInMonth(utils.getFullYear(date), utils.getMonth(date))
  for (let j = 1; j <= daysInMonth; j += 1) {
    const dayDate = new Date(date)
    dayDate.setDate(j)
    // if at least one day of this month is NOT disabled,
    // we can conclude that this month SHOULD be selectable
    if (!isDateDisabled(dayDate, disabledDates, utils)) {
      return false
    }
  }
  return true
}

/**
 * Checks if the given year should be disabled according to the specified config
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {DateUtils} utils
 * @return {Boolean}
 */
export const isYearDisabled = (date, disabledDates, utils) => {
  // skip if no config
  if (typeof disabledDates === 'undefined' || !disabledDates) {
    return false
  }

  // check if the whole year is disabled before checking every individual months
  if (typeof disabledDates.to !== 'undefined' && disabledDates.to) {
    if (utils.getFullYear(date) < utils.getFullYear(disabledDates.to)) {
      return true
    }
  }
  if (typeof disabledDates.from !== 'undefined' && disabledDates.from) {
    if (utils.getFullYear(date) > utils.getFullYear(disabledDates.from)) {
      return true
    }
  }

  // now we have to check every months of the year
  for (let j = 0; j < 12; j += 1) {
    const monthDate = new Date(date)
    monthDate.setMonth(j)
    // if at least one month of this year is NOT disabled,
    // we can conclude that this year SHOULD be selectable
    if (!isMonthDisabled(monthDate, disabledDates, utils)) {
      return false
    }
  }
  return true
}
