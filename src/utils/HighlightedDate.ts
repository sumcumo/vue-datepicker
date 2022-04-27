import CellUtils from './CellUtils'
import DisabledDate from './DisabledDate'
import { DisabledDates, Highlighted } from '../../typings'

export default class HighlightedDate {
  readonly #utils: CellUtils

  readonly #disabledDates: DisabledDates

  readonly #highlighted: Highlighted

  constructor(
    useUTC: boolean,
    disabledDates: DisabledDates,
    highlighted: Highlighted,
  ) {
    this.#utils = new CellUtils(useUTC)
    this.#disabledDates = disabledDates
    this.#highlighted = highlighted
  }

  get config() {
    const highlightedDates = this.#highlighted
    const utils = this.#utils

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

  isDateDisabled(date: Date) {
    const utils = this.#utils
    const disabledDates = this.#disabledDates

    return new DisabledDate(utils.useUtc, disabledDates).isDateDisabled(date)
  }

  isHighlightingNotPossible(date: Date) {
    const { config } = this

    if (!config.exists) return false

    return !config.has.includeDisabled && this.isDateDisabled(date)
  }

  isDateHighlightedVia(date: Date) {
    const highlightedDates = this.#highlighted
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
          return this.#utils.compareDates(date, d)
        })
      },
      daysOfWeek: () => {
        if (!has.daysOfWeek) return false

        return highlightedDates.days.indexOf(this.#utils.getDay(date)) !== -1
      },
      daysOfMonth: () => {
        if (!has.daysOfMonth) return false

        return (
          highlightedDates.daysOfMonth.indexOf(this.#utils.getDate(date)) !== -1
        )
      },
    }
  }

  // eslint-disable-next-line complexity,max-statements
  isDateHighlighted(date: Date) {
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
