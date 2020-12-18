import { configExists, isDefined, isDefinedAsDate } from './cell/CellUtils'
import { isHighlightedVia } from './cell/HighlightedVia'
import CellDisabled from './CellDisabled'

// eslint-disable-next-line complexity
const makeHighlightedConfig = (utils, highlighted) => {
  const hi = highlighted

  const hasFrom = isDefinedAsDate(highlighted, 'from')
  const hasTo = isDefinedAsDate(highlighted, 'to')

  return {
    exists: configExists(highlighted),
    highlighted,
    to: {
      day: hasTo ? utils.getDate(hi.to) : null,
      month: hasTo ? utils.getMonth(hi.to) : null,
      year: hasTo ? utils.getFullYear(hi.to) : null,
    },
    from: {
      day: hasFrom ? utils.getDate(hi.from) : null,
      month: hasFrom ? utils.getMonth(hi.from) : null,
      year: hasFrom ? utils.getFullYear(hi.from) : null,
    },
    has: {
      customPredictor: isDefined(hi, 'customPredictor'),
      daysOfMonth: isDefined(hi, 'daysOfMonth'),
      daysOfWeek: isDefined(hi, 'days'),
      from: hasFrom,
      specificDates: isDefined(hi, 'dates') && hi.dates.length > 0,
      to: hasTo,
      includeDisabled: isDefined(hi, 'includeDisabled') && hi.includeDisabled,
    },
  }
}

/**
 * Whether a date should be highlighted at all
 * @param {Date} date to check if selected
 * @param {Object} utils
 * @param {Object} highlightedConfig
 * @param {Object} disabledDates
 * @return {Boolean}
 */
const isHighlightingNotPossible = (
  date,
  utils,
  highlightedConfig,
  disabledDates,
  // eslint-disable-next-line max-params
) => {
  return (
    !highlightedConfig.exists ||
    (!highlightedConfig.has.includeDisabled &&
      CellDisabled(utils, disabledDates).isDateDisabled(date))
  )
}

const cellHighlighted = {
  utils: null,

  disabledDates: null,

  highlightedConfig: null,

  // eslint-disable-next-line complexity,max-statements
  isDateHighlighted(date) {
    if (
      isHighlightingNotPossible(
        date,
        this.utils,
        this.highlightedConfig,
        this.disabledDates,
      )
    ) {
      return false
    }

    if (isHighlightedVia.to(date, this) && isHighlightedVia.from(date, this)) {
      return true
    }

    if (isHighlightedVia.specificDate(date, this)) {
      return true
    }

    if (isHighlightedVia.daysOfWeek(date, this)) {
      return true
    }

    if (isHighlightedVia.daysOfMonth(date, this)) {
      return true
    }

    return isHighlightedVia.customPredictor(date, this)
  },
}

export default (utils, disabledDates, highlighted) => ({
  ...cellHighlighted,
  utils,
  disabledDates,
  highlightedConfig: makeHighlightedConfig(utils, highlighted),
})
