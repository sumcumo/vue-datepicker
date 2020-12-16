import makeDateUtils from '~/utils/DateUtils'
import { en } from '~/locale'

const dateUtils = makeDateUtils(false)

describe('dateUtils', () => {
  it('should detect invalid date object', () => {
    expect(dateUtils.isValidDate(null)).toEqual(false)
    expect(dateUtils.isValidDate(123)).toEqual(false)
    expect(dateUtils.isValidDate('abc')).toEqual(false)
    expect(dateUtils.isValidDate({})).toEqual(false)
    expect(dateUtils.isValidDate(new Date())).toEqual(true)
  })

  it('should give correct days in a month', () => {
    expect(dateUtils.daysInMonth(2016, 0)).toEqual(31)
    expect(dateUtils.daysInMonth(2016, 1)).toEqual(29)
    expect(dateUtils.daysInMonth(2015, 1)).toEqual(28)
    expect(dateUtils.daysInMonth(2016, 2)).toEqual(31)
    expect(dateUtils.daysInMonth(2016, 3)).toEqual(30)
    expect(dateUtils.daysInMonth(2016, 4)).toEqual(31)
    expect(dateUtils.daysInMonth(2016, 5)).toEqual(30)
    expect(dateUtils.daysInMonth(2016, 6)).toEqual(31)
    expect(dateUtils.daysInMonth(2016, 7)).toEqual(31)
    expect(dateUtils.daysInMonth(2016, 8)).toEqual(30)
    expect(dateUtils.daysInMonth(2016, 9)).toEqual(31)
    expect(dateUtils.daysInMonth(2016, 10)).toEqual(30)
    expect(dateUtils.daysInMonth(2016, 11)).toEqual(31)
  })

  it('should format date strings correctly in English', () => {
    expect(dateUtils.formatDate(new Date(2016, 0, 1), 'd MMMM yyyy')).toEqual(
      '1 January 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yyyy')).toEqual(
      '09 Jan 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 0, 9), 'dd MMM yy')).toEqual(
      '09 Jan 16',
    )
    expect(dateUtils.formatDate(new Date(2016, 2, 9), 'yyyy-MM-dd')).toEqual(
      '2016-03-09',
    )
    expect(dateUtils.formatDate(new Date(2016, 2, 9), 'do MMMM yyyy')).toEqual(
      '9th March 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 2, 1), 'do MMMM yyyy')).toEqual(
      '1st March 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 2, 2), 'do MMMM yyyy')).toEqual(
      '2nd March 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 2, 3), 'do MMMM yyyy')).toEqual(
      '3rd March 2016',
    )
    expect(
      dateUtils.formatDate(new Date(2016, 7, 1), 'E do MMMM yyyy'),
    ).toEqual('Mon 1st August 2016')
    expect(
      dateUtils.formatDate(new Date(2016, 8, 1), 'E do MMMM yyyy'),
    ).toEqual('Thu 1st September 2016')
    expect(
      dateUtils.formatDate(new Date(2016, 7, 7), 'E do MMMM yyyy'),
    ).toEqual('Sun 7th August 2016')
    expect(dateUtils.formatDate(new Date(2016, 11, 2), 'dd MMM yyyy')).toEqual(
      '02 Dec 2016',
    )
  })

  // issue: https://github.com/sumcumo/vue-datepicker/issues/29
  it('should format date strings without formatting issues like 03 Nrdv 2016 instead of 03 Nov 2016', () => {
    expect(dateUtils.formatDate(new Date(2016, 0, 12), 'd MMM yyyy')).toEqual(
      '12 Jan 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 1, 12), 'd MMM yyyy')).toEqual(
      '12 Feb 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 2, 12), 'd MMM yyyy')).toEqual(
      '12 Mar 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 3, 12), 'd MMM yyyy')).toEqual(
      '12 Apr 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 4, 12), 'd MMM yyyy')).toEqual(
      '12 May 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 5, 12), 'd MMM yyyy')).toEqual(
      '12 Jun 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 6, 12), 'd MMM yyyy')).toEqual(
      '12 Jul 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 7, 12), 'd MMM yyyy')).toEqual(
      '12 Aug 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 8, 12), 'd MMM yyyy')).toEqual(
      '12 Sep 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 9, 12), 'd MMM yyyy')).toEqual(
      '12 Oct 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 10, 12), 'd MMM yyyy')).toEqual(
      '12 Nov 2016',
    )
    expect(dateUtils.formatDate(new Date(2016, 11, 12), 'd MMM yyyy')).toEqual(
      '12 Dec 2016',
    )
  })

  it('should parse english dates', () => {
    expect(
      dateUtils.parseDate('16 April 2020', 'd MMMM yyyy', en, null),
    ).toEqual('2020-04-16T00:00:00')
    expect(
      dateUtils.parseDate('16th Apr 2020', 'do MMM yyyy', en, null),
    ).toEqual('2020-04-16T00:00:00')
    expect(
      dateUtils.parseDate('Thu 16th Apr 2020', 'E do MMM yyyy', en, null),
    ).toEqual('2020-04-16T00:00:00')
    expect(dateUtils.parseDate('16.04.2020', 'dd.MM.yyyy', en, null)).toEqual(
      '2020-04-16T00:00:00',
    )
    expect(dateUtils.parseDate('04.16.2020', 'MM.dd.yyyy', en, null)).toEqual(
      '2020-04-16T00:00:00',
    )
  })

  it('should fail to parse because of missing parser', () => {
    expect(() => {
      dateUtils.parseDate('16 April 2020', () => {}, en, null)
    }).toThrowError(
      'Parser need to be a function if you are using a custom formatter',
    )
  })

  it('should give the correct day', () => {
    expect(dateUtils.formatDate(new Date(2016, 8, 12), 'E')).toEqual('Mon')
  })

  it('can create an array of dates', () => {
    const start = new Date(2016, 9, 12)
    const end = new Date(2016, 9, 16)
    const dates = dateUtils.createDateArray(start, end)
    expect(dates.length).toEqual(5)
    let day = 12
    dates.forEach((date) => {
      expect(date.getDate()).toEqual(day)
      day += 1
    })
  })

  it('gives days in a month', () => {
    expect(dateUtils.daysInMonth(2016, 0)).toEqual(31)
    expect(dateUtils.daysInMonth(2016, 1)).toEqual(29)
    expect(dateUtils.daysInMonth(2016, 2)).toEqual(31)
  })

  it('getDayNameAbbr moans if date is not a Date object', () => {
    expect(() => dateUtils.getDayNameAbbr(123, en.months)).toThrow(TypeError)
  })

  it('getMonthName moans if date is not a Date object', () => {
    expect(() => dateUtils.getMonthName('string', en.months)).toThrow(TypeError)
  })

  it('getMonthName complains if missing months array', () => {
    expect(() => dateUtils.getMonthName(new Date())).toThrow(Error)
  })

  it('getMonthName accepts a number', () => {
    expect(dateUtils.getMonthName(3, en.months)).toEqual('April')
  })

  it('getMonthName accepts a Date object', () => {
    expect(dateUtils.getMonthName(new Date(2016, 9, 10), en.months)).toEqual(
      'October',
    )
  })

  it('getMonthNameAbbr moans if date is not a Date object', () => {
    expect(() => dateUtils.getMonthNameAbbr('abc', en.months)).toThrow(
      TypeError,
    )
  })

  it('getMonthNameAbbr complains if missing months array', () => {
    expect(() => dateUtils.getMonthNameAbbr(new Date())).toThrow(Error)
  })

  it('getMonthNameAbbr accepts a Date object', () => {
    expect(
      dateUtils.getMonthNameAbbr(new Date(2016, 9, 10), en.monthsAbbr),
    ).toEqual('Oct')
  })

  it('getMonthName accepts a number return a short name', () => {
    expect(dateUtils.getMonthNameAbbr(3, en.monthsAbbr)).toEqual('Apr')
  })
})

describe('daysInMonth', () => {
  it('should give the correct days in a month', () => {
    expect(dateUtils.daysInMonth(2017, 0)).toEqual(31) // Jan
    expect(dateUtils.daysInMonth(2017, 1)).toEqual(28) // Feb
    expect(dateUtils.daysInMonth(2017, 2)).toEqual(31) // Mar
    expect(dateUtils.daysInMonth(2017, 3)).toEqual(30) // Apr
    expect(dateUtils.daysInMonth(2017, 4)).toEqual(31) // May
    expect(dateUtils.daysInMonth(2017, 5)).toEqual(30) // Jun
    expect(dateUtils.daysInMonth(2017, 6)).toEqual(31) // Jul
    expect(dateUtils.daysInMonth(2017, 7)).toEqual(31) // Aug
    expect(dateUtils.daysInMonth(2017, 8)).toEqual(30) // Sep
    expect(dateUtils.daysInMonth(2017, 9)).toEqual(31) // Oct
    expect(dateUtils.daysInMonth(2017, 10)).toEqual(30) // Nov
    expect(dateUtils.daysInMonth(2017, 11)).toEqual(31) // Dec
  })
})

const getAmbiguousDate = (_) => {
  const timezoneOffset = new Date().getTimezoneOffset() / 60
  const ambiguousHour = 25 - timezoneOffset
  const ambiguousDate = new Date(2018, 11, 31, ambiguousHour)
  return ambiguousDate
}

describe('UTC functions', () => {
  const utcUtils = makeDateUtils(true)

  it('getFullYear', () => {
    const date = getAmbiguousDate()
    expect(dateUtils.getFullYear(date)).toEqual(date.getFullYear())
    expect(utcUtils.getFullYear(date)).toEqual(date.getUTCFullYear())
  })

  it('getMonth', () => {
    const date = getAmbiguousDate()
    expect(dateUtils.getMonth(date)).toEqual(date.getMonth())
    expect(utcUtils.getMonth(date)).toEqual(date.getUTCMonth())
  })

  it('getDate', () => {
    const date = getAmbiguousDate()
    expect(dateUtils.getDate(date)).toEqual(date.getDate())
    expect(utcUtils.getDate(date)).toEqual(date.getUTCDate())
  })

  it('getDay', () => {
    const date = getAmbiguousDate()
    expect(dateUtils.getDay(date)).toEqual(date.getDay())
    expect(utcUtils.getDay(date)).toEqual(date.getUTCDay())
  })

  it('getHours', () => {
    const date = getAmbiguousDate()
    expect(dateUtils.getHours(date)).toEqual(date.getHours())
    expect(utcUtils.getHours(date)).toEqual(date.getUTCHours())
  })

  it('getMinutes', () => {
    const date = getAmbiguousDate()
    expect(dateUtils.getMinutes(date)).toEqual(date.getMinutes())
    expect(utcUtils.getMinutes(date)).toEqual(date.getUTCMinutes())
  })

  it('setFullYear', () => {
    const date = getAmbiguousDate()
    expect(dateUtils.setFullYear(date, 2018)).toEqual(date.setFullYear(2018))
    expect(utcUtils.setFullYear(date, 2018)).toEqual(date.setUTCFullYear(2018))
  })

  it('setMonth', () => {
    const date = getAmbiguousDate()
    expect(dateUtils.setMonth(date, 11)).toEqual(date.setMonth(11))
    expect(utcUtils.setMonth(date, 11)).toEqual(date.setUTCMonth(11))
  })

  it('setDate', () => {
    const date = getAmbiguousDate()
    expect(dateUtils.setDate(date, 31)).toEqual(date.setDate(31))
    expect(utcUtils.setDate(date, 31)).toEqual(date.setUTCDate(31))
  })

  it('returns the correct day number from an abbreviated day name', () => {
    expect(dateUtils.getDayFromAbbr('sun')).toEqual(0)
    expect(dateUtils.getDayFromAbbr('sat')).toEqual(6)
    expect(() => dateUtils.getDayFromAbbr('nonsense')).toThrow(
      'Invalid week day',
    )
  })

  it('getTime', () => {
    expect(dateUtils.getTime()).toEqual('T00:00:00')
    expect(utcUtils.getTime()).toEqual('T00:00:00Z')
  })
})
