function addDays(date, days) {
  return new Date(date.setDate(date.getDate() + days))
}

export default class FocusedDate {
  constructor(config) {
    this.cells = config.cells
    this.columns = config.columns
    this.daysFromNextMonth = config.daysFromNextMonth
    this.daysFromPrevMonth = config.daysFromPrevMonth
    this.isRtl = config.isRtl
    this.isDisabledDate = config.isDisabledDate
    this.showEdgeDates = config.showEdgeDates
    this.focusedId = config.focusedCell.id
    this.focusedCell = config.focusedCell
  }

  nextDate(days) {
    const focusedDate = new Date(this.focusedCell.timestamp)

    return addDays(focusedDate, days)
  }

  up() {
    let delta = -this.columns
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledDate(date)
    const minNonBlankCellId = this.showEdgeDates ? 0 : this.daysFromPrevMonth
    const isPreviousMonth = this.focusedId + delta < minNonBlankCellId

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
    if (this.showEdgeDates) {
      return this.daysFromPrevMonth > 0
        ? this.focusedId - 14
        : this.focusedId - 7
    }

    return this.daysFromPrevMonth > 0 ? this.focusedId - 14 : this.focusedId - 7
  }

  down() {
    let delta = this.columns
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledDate(date)
    const maxNonBlankCellId = this.showEdgeDates
      ? this.cells.length - 1
      : this.cells.length - this.daysFromNextMonth - 1
    const isNextMonth = this.focusedId + delta > maxNonBlankCellId

    if (isNextMonth) {
      delta = this.adjustDownDelta()
      onOtherPage = 'Next'
    }

    return {
      delta,
      date,
      isDisabled,
      onOtherPage,
    }
  }

  adjustDownDelta() {
    if (this.showEdgeDates) {
      return this.daysFromNextMonth > 0
        ? (this.focusedId % 7) + 7
        : this.focusedId % 7
    }

    const isLastRow = this.focusedId >= this.cells.length - 7

    if (this.daysFromNextMonth > 0) {
      return isLastRow ? (this.focusedId % 7) + 7 : this.focusedId % 7
    }
    return this.focusedId % 7
  }

  // eslint-disable-next-line complexity,max-statements
  left() {
    let delta = this.isRtl ? 1 : -1
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledDate(date)

    if (this.isRtl) {
      const maxNonBlankCellId = this.showEdgeDates
        ? this.cells.length
        : this.cells.length - this.daysFromNextMonth
      const isNextMonth = this.focusedId + delta >= maxNonBlankCellId

      if (isNextMonth) {
        delta = this.adjustRightDelta()
        onOtherPage = 'Next'
      }
    } else {
      const isPreviousMonth = this.showEdgeDates
        ? this.focusedId === 0
        : this.focusedCell.date === 1

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
    if (this.showEdgeDates) {
      return this.daysFromPrevMonth === 0 ? -1 : -8
    }

    const isFirstCell = this.focusedId === 0

    return isFirstCell ? -1 : this.focusedId - 8
  }

  // eslint-disable-next-line complexity,max-statements
  right() {
    let delta = this.isRtl ? -1 : 1
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledDate(date)

    if (this.isRtl) {
      const isPreviousMonth = this.showEdgeDates
        ? this.focusedId === 0
        : this.focusedCell.date === 1

      if (isPreviousMonth) {
        delta = this.adjustLeftDelta()
        onOtherPage = 'Previous'
      }
    } else {
      const maxNonBlankCellId = this.showEdgeDates
        ? this.cells.length
        : this.cells.length - this.daysFromNextMonth
      const isNextMonth = this.focusedId + delta >= maxNonBlankCellId

      if (isNextMonth) {
        delta = this.adjustRightDelta()
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

  adjustRightDelta() {
    if (this.showEdgeDates) {
      return this.daysFromNextMonth === 0 ? 0 : 7
    }

    const isLastCell = this.focusedId === this.cells.length - 1

    return isLastCell ? 0 : 7 - this.daysFromNextMonth
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
