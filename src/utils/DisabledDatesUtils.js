const checkForDisabledTo = (disabledDates) => {
  return typeof disabledDates.to !== 'undefined' && disabledDates.to
}
const checkForDisabledFrom = (disabledDates) => {
  return typeof disabledDates.from !== 'undefined' && disabledDates.from
}
const checkDateSpecific = (date, disabledDates, utils) => {
  const hasDates =
    typeof disabledDates.dates !== 'undefined' && disabledDates.dates.length
  if (!hasDates) {
    return false
  }
  const { dates } = disabledDates
  for (let i = 0; i < dates.length; i += 1) {
    if (utils.compareDates(date, dates[i])) {
      return true
    }
  }
  return false
}

// eslint-disable-next-line complexity
const checkDateDisabledFromTo = (date, disabledDates) => {
  const isDisabledTo =
    checkForDisabledTo(disabledDates) && date < disabledDates.to
  const isDisabledFrom =
    checkForDisabledFrom(disabledDates) && date > disabledDates.from

  return isDisabledTo || isDisabledFrom
}

// eslint-disable-next-line complexity,max-statements
const checkDateRange = (date, disabledDates) => {
  const hasRange =
    typeof disabledDates.ranges !== 'undefined' && disabledDates.ranges.length
  if (!hasRange) {
    return false
  }
  const { ranges } = disabledDates
  for (let i = 0; i < ranges.length; i += 1) {
    const range = ranges[i]
    const hasFrom = checkForDisabledFrom(range)
    const hasTo = checkForDisabledTo(range)
    if (hasFrom && hasTo && date < range.to && date > range.from) {
      return true
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
// eslint-disable-next-line complexity
export const isDateDisabled = (date, disabledDates, utils) => {
  // skip if no config
  if (typeof disabledDates === 'undefined') {
    return false
  }
  const hasDisabledDays =
    typeof disabledDates.days !== 'undefined' &&
    disabledDates.days.indexOf(utils.getDay(date)) !== -1
  const hasDisabledDates =
    typeof disabledDates.daysOfMonth !== 'undefined' &&
    disabledDates.daysOfMonth.indexOf(utils.getDate(date)) !== -1
  const hasCustomPredictor =
    typeof disabledDates.customPredictor === 'function' &&
    disabledDates.customPredictor(date)
  // check specific dates && heck date ranges
  return !!(
    checkDateSpecific(date, disabledDates, utils) ||
    checkDateDisabledFromTo(date, disabledDates) ||
    checkDateRange(date, disabledDates) ||
    hasDisabledDays ||
    hasDisabledDates ||
    hasCustomPredictor
  )
}

/**
 * Checks if the given month should be disabled according to the specified config
 * @param {Date} date
 * @param {Object} disabledDates
 * @param {DateUtils} utils
 * @return {Boolean}
 */
// eslint-disable-next-line complexity,max-statements
export const isMonthDisabled = (date, disabledDates, utils) => {
  // skip if no config
  if (typeof disabledDates === 'undefined') {
    return false
  }

  const hasTo = typeof disabledDates.to !== 'undefined' && disabledDates.to
  const hasFrom =
    typeof disabledDates.from !== 'undefined' && disabledDates.from

  const isPastSameYearAndPastMonth =
    hasTo &&
    utils.getMonth(date) < utils.getMonth(disabledDates.to) &&
    utils.getFullYear(date) <= utils.getFullYear(disabledDates.to)
  const isInPastYear =
    hasTo && utils.getFullYear(date) < utils.getFullYear(disabledDates.to)

  const isFutureSameYearAndFutureMonth =
    hasFrom &&
    utils.getMonth(date) > utils.getMonth(disabledDates.from) &&
    utils.getFullYear(date) >= utils.getFullYear(disabledDates.from)
  const isInFutureYear =
    hasFrom && utils.getFullYear(date) > utils.getFullYear(disabledDates.from)

  // check if the whole month is disabled before checking every individual days
  if (
    (checkForDisabledTo(disabledDates) && isPastSameYearAndPastMonth) ||
    isInPastYear ||
    (checkForDisabledFrom(disabledDates) &&
      isFutureSameYearAndFutureMonth &&
      isInFutureYear)
  ) {
    return true
  }

  // now we have to check every days of the month
  const daysInMonth = utils.daysInMonth(
    utils.getFullYear(date),
    utils.getMonth(date),
  )
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
// eslint-disable-next-line complexity,max-statements
export const isYearDisabled = (date, disabledDates, utils) => {
  // skip if no config
  if (typeof disabledDates === 'undefined' || !disabledDates) {
    return false
  }

  const isDisabledTo =
    checkForDisabledTo(disabledDates) &&
    utils.getFullYear(date) < utils.getFullYear(disabledDates.to)
  const isDisabledFrom =
    checkForDisabledFrom(disabledDates) &&
    utils.getFullYear(date) > utils.getFullYear(disabledDates.from)

  // check if the whole year is disabled before checking every individual months
  if (isDisabledTo || isDisabledFrom) {
    return true
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
