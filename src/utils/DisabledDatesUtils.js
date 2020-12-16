export const hasDisabledFrom = (disabledDates) => {
  return disabledDates && typeof disabledDates.from !== 'undefined'
}

export const hasDisabledTo = (disabledDates) => {
  return disabledDates && typeof disabledDates.to !== 'undefined'
}

const from = (date, config) => {
  return config.has.from && date > config.disabledDates.from
}

const to = (date, config) => {
  return config.has.to && date < config.disabledDates.to
}

const range = (date, config) => {
  if (!config.has.ranges) {
    return false
  }
  const { ranges } = config.disabledDates

  return ranges.some((thisRange) => {
    const hasFrom = hasDisabledFrom(thisRange)
    const hasTo = hasDisabledTo(thisRange)

    return hasFrom && hasTo && date < thisRange.to && date > thisRange.from
  })
}

const customPredictor = (date, config) => {
  return (
    config.has.customPredictor && config.disabledDates.customPredictor(date)
  )
}

const specificDate = (date, utils, config) => {
  if (!config.has.specificDates) {
    return false
  }
  const { dates } = config.disabledDates

  return dates.some((d) => {
    return utils.compareDates(date, d)
  })
}

const daysOfWeek = (date, utils, config) => {
  return (
    config.has.daysOfWeek &&
    config.disabledDates.days.indexOf(utils.getDay(date)) !== -1
  )
}

const daysOfMonth = (date, utils, config) => {
  return (
    config.has.daysOfMonth &&
    config.disabledDates.daysOfMonth.indexOf(utils.getDate(date)) !== -1
  )
}

const isMonthDisabledViaTo = (month, year, config) => {
  const isYearInPast = config.has.to && year < config.to.year

  if (isYearInPast) {
    return true
  }

  return config.has.to && month < config.to.month && year <= config.to.year
}

const isMonthDisabledViaFrom = (month, year, config) => {
  const isYearInFuture = config.has.from && year > config.from.year

  if (isYearInFuture) {
    return true
  }

  return (
    config.has.from && month > config.from.month && year >= config.from.year
  )
}

const isYearDisabledViaTo = (year, config) => {
  return config.has.to && year < config.to.year
}

const isYearDisabledViaFrom = (year, config) => {
  return config.has.from && year > config.from.year
}

export const isDateDisabledVia = {
  to,
  from,
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
