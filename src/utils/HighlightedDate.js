/* eslint-disable no-underscore-dangle */

import { configExists, isDefined, isDefinedAsDate } from './CellUtils'
import DisabledDate from './DisabledDate'

export default class HighlightedDate {
  constructor(utils, disabledDates, highlighted) {
    this.utils = utils
    this.disabledDates = disabledDates
    this.highlighted = highlighted
  }

  set utils(utils) {
    if (typeof utils !== 'object') {
      throw new TypeError('utils must be an object')
    }

    this._utils = utils
  }

  set disabledDates(disabledDates) {
    if (typeof disabledDates !== 'object') {
      this._disabledDates = undefined
    }
    this._disabledDates = disabledDates
  }

  set highlighted(highlighted) {
    if (typeof highlighted !== 'object') {
      this._highlighted = undefined
    }
    this._highlighted = highlighted
  }

  // eslint-disable-next-line complexity
  get config() {
    const hi = this._highlighted
    const utils = this._utils
    const hasFrom = isDefinedAsDate(hi, 'from')
    const hasTo = isDefinedAsDate(hi, 'to')

    return {
      exists: configExists(hi),
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

  isDateDisabled(date) {
    const utils = this._utils
    const disabledDates = this._disabledDates

    return new DisabledDate(utils, disabledDates).isDateDisabled(date)
  }

  isHighlightingNotPossible = (date) => {
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
