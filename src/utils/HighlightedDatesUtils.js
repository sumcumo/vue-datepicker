/**
 * Whether a date should be highlighted based on `highlighted.to`
 * @param {Date} date to check if selected
 * @param utils
 * @param config
 * @return {Boolean}
 */
const to = (date, utils, config) => {
  return config.has.to && date <= config.highlighted.to
}

/**
 * Whether a date should be highlighted based on `highlighted.from`
 * @param {Date} date to check if selected
 * @param utils
 * @param config
 * @return {Boolean}
 */
const from = (date, utils, config) => {
  return config.has.from && date >= config.highlighted.from
}

/**
 * Whether a date should be highlighted based on `highlighted.customPredictor`
 * @param {Date} date to check if selected
 * @param utils
 * @param config
 * @return {Boolean}
 */
const customPredictor = (date, utils, config) => {
  return config.has.customPredictor && config.highlighted.customPredictor(date)
}

/**
 * Whether a date should be highlighted based on `highlighted.dates`
 * @param {Date} date to check if selected
 * @param utils
 * @param config
 * @return {Boolean}
 */
const specificDate = (date, utils, config) => {
  if (!config.has.specificDates) {
    return false
  }
  return config.highlighted.dates.some((d) => {
    return utils.compareDates(date, d)
  })
}

/**
 * Whether a date should be highlighted based on `highlighted.days`
 * @param {Date} date to check if selected
 * @param utils
 * @param config
 * @return {Boolean}
 */
const daysOfWeek = (date, utils, config) => {
  return (
    config.has.daysOfWeek &&
    config.highlighted.days.indexOf(utils.getDay(date)) !== -1
  )
}

/**
 * Whether a date should be highlighted based on `highlighted.daysOfMonth`
 * @param {Date} date to check if selected
 * @param utils
 * @param config
 * @return {Boolean}
 */
const daysOfMonth = (date, utils, config) => {
  return (
    config.has.daysOfMonth &&
    config.highlighted.daysOfMonth.indexOf(utils.getDate(date)) !== -1
  )
}

export const isHighlightedVia = {
  to,
  from,
  customPredictor,
  specificDate,
  daysOfWeek,
  daysOfMonth,
}
