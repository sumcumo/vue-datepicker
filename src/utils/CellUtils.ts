import { DayMonthYear, DisabledOrHighlighted, Highlighted } from '../../typings'
import DateUtils from './DateUtils'

export default class CellUtils extends DateUtils {
  configExists(obj: DisabledOrHighlighted) {
    return typeof obj !== 'undefined' && Object.keys(obj).length > 0
  }

  isDefined(obj: any, prop: keyof Highlighted) {
    return this.configExists(obj) && typeof obj[prop] !== 'undefined'
  }

  hasArray(obj: DisabledOrHighlighted, prop: keyof DisabledOrHighlighted) {
    return this.isDefined(obj, prop) && Array.isArray(obj[prop])
  }

  hasDate(obj: DisabledOrHighlighted, prop: keyof DisabledOrHighlighted) {
    return this.isDefined(obj, prop) && this.isValidDate(obj[prop])
  }

  dayMonthYear(
    obj: DisabledOrHighlighted,
    prop: keyof DisabledOrHighlighted,
  ): DayMonthYear {
    const hasDate = this.hasDate(obj, prop)

    const d: Date = obj[prop] as Date

    return {
      day: hasDate ? this.getDate(d) : undefined,
      month: hasDate ? this.getMonth(d) : undefined,
      year: hasDate ? this.getFullYear(d) : undefined,
    }
  }
}
