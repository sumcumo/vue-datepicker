import { isHighlightedVia } from './HighlightedDatesUtils'
import { isDateDisabled } from './DisabledDates'

/**
 * Whether a date should be highlighted at all
 * @param {Date} date to check if selected
 * @param {Object} utils
 * @param highlightedConfig
 * @param disabledConfig
 * @return {Boolean}
 */
const isHighlightingNotPossible = (
  date,
  utils,
  highlightedConfig,
  disabledConfig,
  // eslint-disable-next-line max-params
) => {
  return (
    !highlightedConfig.exists ||
    (!highlightedConfig.has.includeDisabled &&
      isDateDisabled(date, utils, disabledConfig))
  )
}

// eslint-disable-next-line max-params,complexity,max-statements
export const isDateHighlighted = (
  date,
  utils,
  highlightedConfig,
  disabledConfig,
  // eslint-disable-next-line max-params
) => {
  if (
    isHighlightingNotPossible(date, utils, highlightedConfig, disabledConfig)
  ) {
    return false
  }

  if (
    isHighlightedVia.to(date, utils, highlightedConfig) &&
    isHighlightedVia.from(date, utils, highlightedConfig)
  ) {
    return true
  }

  if (isHighlightedVia.specificDate(date, utils, highlightedConfig)) {
    return true
  }

  if (isHighlightedVia.daysOfWeek(date, utils, highlightedConfig)) {
    return true
  }

  if (isHighlightedVia.daysOfMonth(date, utils, highlightedConfig)) {
    return true
  }

  return isHighlightedVia.customPredictor(date, utils, highlightedConfig)
}
