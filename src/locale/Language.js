export default class Language {
  constructor(language, months, monthsAbbr, days) {
    this.language = language
    this.months = months
    this.monthsAbbr = monthsAbbr
    this.days = days
    this.rtl = false
    this.ymd = false
    this.yearSuffix = ''
  }

  /* eslint-disable no-underscore-dangle */
  get language() {
    return this._language
  }

  set language(language) {
    if (typeof language !== 'string') {
      throw new TypeError('Language must be a string')
    }
    this._language = language
  }

  get months() {
    return this._months
  }

  set months(months) {
    if (months.length !== 12) {
      throw new RangeError(`There must be 12 months for ${this.language} language`)
    }
    this._months = months
  }

  get monthsAbbr() {
    return this._monthsAbbr
  }

  set monthsAbbr(monthsAbbr) {
    if (monthsAbbr.length !== 12) {
      throw new RangeError(`There must be 12 abbreviated months for ${this.language} language`)
    }
    this._monthsAbbr = monthsAbbr
  }

  get days() {
    return this._days
  }

  set days(days) {
    if (days.length !== 7) {
      throw new RangeError(`There must be 7 days for ${this.language} language`)
    }
    this._days = days
  }

  getDaysStartingOn(firstDayOfWeek) {
    const firstDays = this._days.slice(firstDayOfWeek)
    const lastDays = this._days.slice(0, firstDayOfWeek)

    return firstDays.concat(lastDays)
  }

  getMonthByAbbrName(name) {
    let index = -1
    this._monthsAbbr.some((month, i) => {
      if (month === name) {
        index = i
        return true
      }
      return false
    })
    const monthValue = index + 1
    return monthValue < 10 ? `0${monthValue}` : `${monthValue}`
  }

  getMonthByName(name) {
    let index = -1
    this._months.some((month, i) => {
      if (month === name) {
        index = i
        return true
      }
      return false
    })
    const monthValue = index + 1
    return monthValue < 10 ? `0${monthValue}` : `${monthValue}`
  }
}
