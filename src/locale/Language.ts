import { Days, Months, Translation } from '../../typings'

export default class Language implements Translation {
  language: string

  months: Months

  monthsAbbr: Months

  days: Days

  rtl: boolean

  ymd: boolean

  yearSuffix: string

  // eslint-disable-next-line max-params
  constructor(
    language: string,
    months: Months,
    monthsAbbr: Months,
    days: Days,
    rtl = false,
    ymd = false,
    yearSuffix = '',
  ) {
    this.language = language
    this.months = months
    this.monthsAbbr = monthsAbbr
    this.days = days
    this.rtl = rtl
    this.ymd = ymd
    this.yearSuffix = yearSuffix
  }

  getDaysStartingOn(firstDayOfWeek: number) {
    const firstDays = this.days.slice(firstDayOfWeek)
    const lastDays = this.days.slice(0, firstDayOfWeek)

    return firstDays.concat(lastDays)
  }

  getMonthByAbbrName(name: string) {
    const monthValue = this.monthsAbbr.findIndex((month) => month === name) + 1
    return monthValue < 10 ? `0${monthValue}` : `${monthValue}`
  }

  getMonthByName(name: string) {
    const monthValue = this.months.findIndex((month) => month === name) + 1
    return monthValue < 10 ? `0${monthValue}` : `${monthValue}`
  }
}
