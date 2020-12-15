export const hasDisabledFrom = (disabledDates) => {
  return disabledDates && typeof disabledDates.from !== 'undefined'
}

export const hasDisabledTo = (disabledDates) => {
  return disabledDates && typeof disabledDates.to !== 'undefined'
}

const from = (date, disabledDates, config) => {
  return config.hasFrom && date > disabledDates.from
}

const to = (date, disabledDates, config) => {
  return config.hasTo && date < disabledDates.to
}

const range = (date, disabledDates, config) => {
  if (!config.hasRanges) {
    return false
  }
  const { ranges } = disabledDates

  return ranges.some((thisRange) => {
    const hasFrom = hasDisabledFrom(thisRange)
    const hasTo = hasDisabledTo(thisRange)

    return hasFrom && hasTo && date < thisRange.to && date > thisRange.from
  })
}

const customPredictor = (date, disabledDates, config) => {
  return config.hasCustomPredictor && disabledDates.customPredictor(date)
}

// eslint-disable-next-line max-params
const specificDate = (date, disabledDates, utils, config) => {
  if (!config.hasSpecificDates) {
    return false
  }
  const { dates } = disabledDates

  return dates.some((d) => {
    return utils.compareDates(date, d)
  })
}

// eslint-disable-next-line max-params
const daysOfWeek = (date, disabledDates, utils, config) => {
  return (
    config.hasDaysOfWeek &&
    disabledDates.days.indexOf(utils.getDay(date)) !== -1
  )
}

// eslint-disable-next-line max-params
const daysOfMonth = (date, disabledDates, utils, config) => {
  return (
    config.hasDaysOfMonth &&
    disabledDates.daysOfMonth.indexOf(utils.getDate(date)) !== -1
  )
}

const isMonthDisabledViaTo = (month, year, config) => {
  const isYearInPast = config.hasDisabledTo && year < config.disabledToYear

  if (isYearInPast) {
    return true
  }

  return (
    config.hasDisabledTo &&
    month < config.disabledToMonth &&
    year <= config.disabledToYear
  )
}

const isMonthDisabledViaFrom = (month, year, config) => {
  const isYearInFuture =
    config.hasDisabledFrom && year > config.disabledFromYear

  if (isYearInFuture) {
    return true
  }

  return (
    config.hasDisabledFrom &&
    month > config.disabledFromMonth &&
    year >= config.disabledFromYear
  )
}

const isYearDisabledViaTo = (year, config) => {
  return config.hasDisabledTo && year < config.disabledToYear
}

const isYearDisabledViaFrom = (year, config) => {
  return config.hasDisabledFrom && year > config.disabledFromYear
}

export const isDateDisabledVia = {
  from,
  to,
  range,
  customPredictor,
  specificDate,
  daysOfWeek,
  daysOfMonth,
}

export const isMonthDisabledVia = {
  from: isMonthDisabledViaFrom,
  to: isMonthDisabledViaTo,
}

export const isYearDisabledVia = {
  from: isYearDisabledViaFrom,
  to: isYearDisabledViaTo,
}
