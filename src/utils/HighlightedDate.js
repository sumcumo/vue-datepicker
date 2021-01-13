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
    const hi = this._highlighted
    const u = makeCellUtils(this._utils)

    return {
      exists: u.configExists(hi),
      to: u.dayMonthYear(hi, 'to'),
      from: u.dayMonthYear(hi, 'from'),
      has: {
        customPredictor: u.isDefined(hi, 'customPredictor'),
        daysOfMonth: u.hasArray(hi, 'daysOfMonth'),
        daysOfWeek: u.hasArray(hi, 'days'),
        from: u.hasDate(hi, 'from'),
        specificDates: u.hasArray(hi, 'dates'),
        to: u.hasDate(hi, 'to'),
        includeDisabled:
          u.isDefined(hi, 'includeDisabled') && hi.includeDisabled,
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
    const hi = this._highlighted
    const { has } = this.config

    return {
      to: () => {
        return has.to && date <= hi.to
      },
      from: () => {
        return has.from && date >= hi.from
      },
      customPredictor: () => {
        return has.customPredictor && hi.customPredictor(date)
      },
      specificDate: () => {
        if (!has.specificDates) return false

        return hi.dates.some((d) => {
          return this._utils.compareDates(date, d)
        })
      },
      daysOfWeek: () => {
        if (!has.daysOfWeek) return false

        return hi.days.indexOf(this._utils.getDay(date)) !== -1
      },
      daysOfMonth: () => {
        if (!has.daysOfMonth) return false

        return hi.daysOfMonth.indexOf(this._utils.getDate(date)) !== -1
      },
    }
  }

  // eslint-disable-next-line complexity,max-statements
  isDateHighlighted(date) {
    if (this.isHighlightingNotPossible(date)) return false

    const isHighlightedVia = this.isDateHighlightedVia(date)

    if (isHighlightedVia.to() && isHighlightedVia.from()) {
      return true
    }

    if (isHighlightedVia.specificDate()) {
      return true
    }

    if (isHighlightedVia.daysOfWeek()) {
      return true
    }

    if (isHighlightedVia.daysOfMonth()) {
      return true
    }

    return isHighlightedVia.customPredictor()
  }
}
