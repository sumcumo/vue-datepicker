/* eslint-disable no-underscore-dangle */

import makeCellUtils from './cellUtils'
import DisabledDate from './DisabledDate'

export default class HighlightedDate {
  constructor(utils, disabledDates, highlighted) {
    this._utils = utils
    this._disabledDates = disabledDates
    this._highlighted = highlighted
  }

  get config() {
    const highlightedDates = this._highlighted
    const utils = makeCellUtils(this._utils)

    return {
      exists: utils.configExists(highlightedDates),
      to: utils.dayMonthYear(highlightedDates, 'to'),
      from: utils.dayMonthYear(highlightedDates, 'from'),
      has: {
        customPredictor: utils.isDefined(highlightedDates, 'customPredictor'),
        daysOfMonth: utils.hasArray(highlightedDates, 'daysOfMonth'),
        daysOfWeek: utils.hasArray(highlightedDates, 'days'),
        from: utils.hasDate(highlightedDates, 'from'),
        specificDates: utils.hasArray(highlightedDates, 'dates'),
        to: utils.hasDate(highlightedDates, 'to'),
        includeDisabled:
          utils.isDefined(highlightedDates, 'includeDisabled') &&
          highlightedDates.includeDisabled,
      },
    }
  }

  isDateDisabled(date) {
    const utils = this._utils
    const disabledDates = this._disabledDates

    return new DisabledDate(utils, disabledDates).isDateDisabled(date)
  }

  isHighlightingNotPossible(date) {
    const { config } = this

    if (!config.exists) return false

    return !config.has.includeDisabled && this.isDateDisabled(date)
  }

  isDateHighlightedVia(date) {
    const highlightedDates = this._highlighted
    const { has } = this.config

    return {
      to: () => {
        return has.to && date <= highlightedDates.to
      },
      from: () => {
        return has.from && date >= highlightedDates.from
      },
      customPredictor: () => {
        return has.customPredictor && highlightedDates.customPredictor(date)
      },
      specificDate: () => {
        if (!has.specificDates) return false

        return highlightedDates.dates.some((d) => {
          return this._utils.compareDates(date, d)
        })
      },
      daysOfWeek: () => {
        if (!has.daysOfWeek) return false

        return highlightedDates.days.indexOf(this._utils.getDay(date)) !== -1
      },
      daysOfMonth: () => {
        if (!has.daysOfMonth) return false

        return (
          highlightedDates.daysOfMonth.indexOf(this._utils.getDate(date)) !== -1
        )
      },
    }
  }

  // eslint-disable-next-line complexity,max-statements
  isDateHighlighted(date) {
    if (this.isHighlightingNotPossible(date)) return false

    const isHighlightedVia = this.isDateHighlightedVia(date)

    return (
      (isHighlightedVia.to() && isHighlightedVia.from()) ||
      isHighlightedVia.specificDate() ||
      isHighlightedVia.daysOfWeek() ||
      isHighlightedVia.daysOfMonth() ||
      isHighlightedVia.customPredictor()
    )
  }
}
