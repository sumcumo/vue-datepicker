function addMonth(date, months) {
  return new Date(date.setMonth(date.getMonth() + months))
}

export default class FocusedMonth {
  constructor(config) {
    this.cells = config.cells
    this.columns = config.columns
    this.daysFromNextMonth = config.daysFromNextMonth
    this.daysFromPrevMonth = config.daysFromPrevMonth
    this.isRtl = config.isRtl
    this.isDisabledMonth = config.isDisabledMonth
    this.showEdgeDates = config.showEdgeDates
    this.focusedId = config.focusedCell.id
    this.focusedCell = config.focusedCell
  }

  nextDate(days) {
    const focusedDate = new Date(this.focusedCell.timestamp)

    return addMonth(focusedDate, days)
  }

  up() {
    let delta = -this.columns
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledMonth(date)
    const isPreviousMonth = this.focusedId + delta < 0

    if (isPreviousMonth) {
      delta = this.focusedId + delta
      onOtherPage = 'Previous'
    }

    return {
      delta,
      date,
      isDisabled,
      onOtherPage,
    }
  }

  down() {
    let delta = this.columns
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledMonth(date)
    const isNextMonth = this.focusedId + delta > 11

    if (isNextMonth) {
      delta = this.focusedId % 3
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
    let onOtherPage = false
    let delta = this.isRtl ? 1 : -1
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledMonth(date)

    if (this.isRtl) {
      const isNextMonth = this.focusedId + delta > 11

      if (isNextMonth) {
        delta = 0
        onOtherPage = 'Next'
      }
    } else {
      const isPreviousMonth = this.focusedId === 0

      if (isPreviousMonth) {
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

  // eslint-disable-next-line max-statements
  right() {
    let delta = this.isRtl ? -1 : 1
    let onOtherPage = false
    const date = this.nextDate(delta)
    const isDisabled = this.isDisabledMonth(date)

    if (this.isRtl) {
      const isPreviousMonth = this.focusedId === 0

      if (isPreviousMonth) {
        onOtherPage = 'Previous'
      }
    } else {
      const isNextMonth = this.focusedId + delta > 11

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
