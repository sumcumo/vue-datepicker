export default class FocusedCell {
  constructor(config) {
    this.utils = config.utils
    this.focusedCell = config.focusedCell
    this.disabledConfig = config.disabledConfig
    this.showEdgeDates = config.showEdgeDates
  }

  // get statusDay() {
  // function keyUpChangeAmount() {
  //   const focusedDate = new Date(focusedCell.timestamp)
  //   const previousWeekDate = focusedDate.setDate(focusedDate.getDate() - 7)
  //
  //   if (this.disabledConfig.has.to) {
  //     return previousWeekDate < this.disabledConfig.to.valueOf() ? 0 : -7
  //   }
  //   return -7
  // }
  //
  //   return {
  //     keyDelta: {
  //       left: '',
  //       right: '',
  //       up: '',
  //       down: '',
  //     },
  //     canMove: {
  //       left: '',
  //       right: '',
  //       up: '',
  //       down: '',
  //     },
  //   }
  // }

  canFocusMonthLeft() {
    const config = this.disabledConfig
    if (this.isRtl) {
      return this.isNextDisabled && this.focusedId >= config.from.month
    }
    return !this.isPreviousDisabled && this.focusedId > config.to.month
  }

  canFocusMonthRight() {
    const config = this.disabledConfig
    if (this.isRtl) {
      return this.isPreviousDisabled && this.focusedId <= config.to.month
    }
    return !this.isNextDisabled && this.focusedId < config.from.month
  }

  get statusMonth() {
    return {
      keyDelta: {
        left: '',
        right: '',
        up: '',
        down: '',
      },
      canFocus: {
        left: this.canFocusMonthLeft(),
        right: this.canFocusMonthRight(),
        up: '',
        down: '',
      },
    }
  }
}
