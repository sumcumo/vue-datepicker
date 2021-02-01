function addYears(date, years) {
  return new Date(date.setFullYear(date.getFullYear() + years))
}

export default class FocusedYear {
  constructor(config) {
    this.cells = config.cells
    this.columns = config.columns
    this.daysFromNextMonth = config.daysFromNextMonth
    this.daysFromPrevMonth = config.daysFromPrevMonth
    this.isRtl = config.isRtl
    this.isDisabledYear = config.isDisabledYear
    this.showEdgeDates = config.showEdgeDates
    this.focusedId = config.focusedCell.id
    this.focusedCell = config.focusedCell
    this.yearRange = config.yearRange
  }

  nextDate(years) {
    const focusedDate = new Date(this.focusedCell.timestamp)

    return addYears(focusedDate, years)
  }

  up() {
    let delta = -this.columns
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledYear(date)
    const isPreviousMonth = this.focusedId + delta < 0

    if (isPreviousMonth) {
      delta = this.adjustUpDelta()
      onOtherPage = 'Previous'
    }

    return {
      delta,
      date,
      isDisabled,
      onOtherPage,
    }
  }

  adjustUpDelta() {
    let delta = this.focusedId - this.columns
    const blankCellsCount =
      (this.columns - (this.yearRange % this.columns)) % this.columns

    if (blankCellsCount > 0) {
      if (delta >= -blankCellsCount) {
        delta -= this.columns
      }
      return delta
    }

    return delta
  }

  down() {
    let delta = this.columns
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledYear(date)
    const isNextMonth = this.focusedId + delta >= this.yearRange

    if (isNextMonth) {
      delta = this.focusedId % this.columns
      onOtherPage = 'Next'
    }

    return {
      delta,
      date,
      isDisabled,
      onOtherPage,
    }
  }

  // eslint-disable-next-line max-statements
  left() {
    let delta = this.isRtl ? 1 : -1
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledYear(date)
    if (this.isRtl) {
      const isNextMonth = this.focusedId + delta > this.yearRange - 1

      if (isNextMonth) {
        delta = 0
        onOtherPage = 'Next'
      }
    } else {
      const isPreviousMonth = this.focusedId === 0

      if (isPreviousMonth) {
        delta = this.adjustLeftDelta()
        onOtherPage = 'Previous'
      }
    }

    return {
      delta,
      date,
      isDisabled,
      onOtherPage,
    }
  }

  adjustLeftDelta() {
    const blankCellsCount =
      (this.columns - (this.yearRange % this.columns)) % this.columns

    if (blankCellsCount === 0) {
      return -1
    }

    return -this.columns
  }

  // eslint-disable-next-line max-statements
  right() {
    let delta = this.isRtl ? -1 : 1
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledYear(date)

    if (this.isRtl) {
      const isPreviousMonth = this.focusedId === 0

      if (isPreviousMonth) {
        delta = this.adjustLeftDelta()
        onOtherPage = 'Previous'
      }
    } else {
      const isNextMonth = this.focusedId + delta > this.yearRange - 1

      if (isNextMonth) {
        delta = 0
        onOtherPage = 'Next'
      }
    }

    return {
      delta,
      date,
      isDisabled,
      onOtherPage,
    }
  }

  get nextCell() {
    return {
      focusedCell: this.focusedCell,
      up: this.up(),
      down: this.down(),
      left: this.left(),
      right: this.right(),
    }
  }
}
