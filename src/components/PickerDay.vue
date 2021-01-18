<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderDay" />
    <PickerHeader
      ref="PickerHeader"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      :is-up-disabled="isUpDisabled"
      :next="nextMonth"
      :previous="previousMonth"
      :show-header="showHeader"
      @check-focus="$emit('check-focus')"
      @focus-first-cell="focusFirstNonDisabledCell"
      @focus-up-button="focusUpButton"
    >
      <button
        ref="up"
        class="up day__month_btn"
        :disabled="isUpDisabled"
        @blur="emitCheckFocus"
        @click="showPickerCalendar(nextViewUp)"
        @keydown.down.prevent="focusFirstNonDisabledCell"
        @keydown.left.prevent="focusNav(isRtl ? 'next' : 'prev')"
        @keydown.right.prevent="focusNav(isRtl ? 'prev' : 'next')"
      >
        {{ pageTitleDay }}
      </button>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
    </PickerHeader>
    <div :class="{ 'flex-rtl': isRtl }">
      <span v-for="d in daysOfWeek" :key="d.timestamp" class="day-header">
        {{ d }}
      </span>
      <button
        v-for="cell in cells"
        :ref="cell.id"
        :key="cell.id"
        class="cell day"
        :class="dayClasses(cell)"
        :disabled="cell.isDisabled"
        @blur="$emit('check-focus')"
        @click="selectDate(cell)"
        @focus="focusedCell = cell"
        @keydown.up.prevent="updateCellFocus(keyUpDelta)"
        @keydown.down.prevent="updateCellFocus(keyDownDelta)"
        @keydown.left.prevent="
          updateCellFocus(isRtl ? keyRightDelta : keyLeftDelta)
        "
        @keydown.right.prevent="
          updateCellFocus(isRtl ? keyLeftDelta : keyRightDelta)
        "
        @keyup.esc="$emit('close')"
      >
        {{ dayCellContent(cell) }}
      </button>
    </div>
    <slot name="calendarFooterDay" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import DisabledDate from '~/utils/DisabledDate'
import HighlightedDate from '~/utils/HighlightedDate'
import FocusedCell from '~/utils/FocusedCell'

export default {
  name: 'PickerDay',
  mixins: [pickerMixin],
  props: {
    dayCellContent: {
      type: Function,
      default: (day) => day.date,
    },
    highlighted: {
      type: Object,
      default() {
        return {}
      },
    },
    firstDayOfWeek: {
      type: String,
      default: 'sun',
    },
    showFullMonthName: {
      type: Boolean,
      default: false,
    },
    showEdgeDates: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    /**
     * Sets an array with all days to show this month
     * @return {Array}
     */
    cells() {
      const days = []
      const daysInCalendar =
        this.daysFromPrevMonth + this.daysInMonth + this.daysFromNextMonth
      const firstOfMonth = this.newPageDate()
      const dObj = new Date(
        firstOfMonth.setDate(firstOfMonth.getDate() - this.daysFromPrevMonth),
      )
      for (let i = 0; i < daysInCalendar; i += 1) {
        days.push(this.makeDay(i, dObj))
        this.utils.setDate(dObj, this.utils.getDate(dObj) + 1)
      }
      return days
    },
    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName() {
      const monthName = this.showFullMonthName
        ? this.translation.months
        : this.translation.monthsAbbr

      return this.utils.getMonthNameAbbr(this.pageMonth, monthName)
    },
    /**
     * Gets the name of the year that current page is on
     * @return {String}
     */
    currYearName() {
      const { yearSuffix } = this.translation
      return `${this.pageYear}${yearSuffix}`
    },
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek() {
      return this.translation.getDaysStartingOn(this.firstDayOfWeekNumber)
    },
    /**
     * Returns the number of days in this month
     * @return {String[]}
     */
    daysInMonth() {
      const dObj = this.newPageDate()
      return this.utils.getDaysInMonth(dObj)
    },
    /**
     * Calculates how many days to show from the previous month
     * @return {number}
     */
    daysFromPrevMonth() {
      const dObj = this.newPageDate()
      return (7 - this.firstDayOfWeekNumber + this.utils.getDay(dObj)) % 7
    },
    /**
     * Calculates how many days to show from the next month
     * @return {number}
     */
    daysFromNextMonth() {
      const daysThisAndPrevMonth = this.daysFromPrevMonth + this.daysInMonth
      return Math.ceil(daysThisAndPrevMonth / 7) * 7 - daysThisAndPrevMonth
    },
    /**
     * Returns first-day-of-week as a number (Sunday is 0)
     * @return {Number}
     */
    firstDayOfWeekNumber() {
      return this.utils.getDayFromAbbr(this.firstDayOfWeek)
    },
    focusedCellStatus() {
      const config = {
        focusedCell: this.focusedCell,
        showEdgeDates: this.showEdgeDates,
        disabledConfig: this.disabledConfig
        utils: this.utils
      }

      return new FocusedCell(config).statusDay
    },
    highlightedConfig() {
      return new HighlightedDate(
        this.utils,
        this.disabledDates,
        this.highlighted,
      ).config
    },
    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextDisabled() {
      if (!this.disabledConfig.has.from) {
        return false
      }
      return (
        this.disabledConfig.from.month <= this.pageMonth &&
        this.disabledConfig.from.year <= this.pageYear
      )
    },
    isPreviousWeekBlank() {
      return this.focusedId > 6 && this.focusedId - 7 < this.daysFromPrevMonth
    },
    isNextWeekBlank() {
      return (
        this.daysFromNextMonth > 0 &&
        this.focusedId > (this.rows - 2) * 7 &&
        this.focusedId <= (this.rows - 1) * 7 &&
        this.focusedId + 7 >= this.cellsCount - this.daysFromNextMonth
      )
    },
    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (!this.disabledConfig.has.to) {
        return false
      }
      return (
        this.disabledConfig.to.month >= this.pageMonth &&
        this.disabledConfig.to.year >= this.pageYear
      )
    },
    keyUpDelta() {
      if (this.showEdgeDates) {
        return this.keyUpChangeAmount
      }

      return this.isPreviousWeekBlank
        ? this.keyUpChangeAmount - 7
        : this.keyUpChangeAmount
    },
    keyUpChangeAmount() {
      const focusedDate = new Date(this.focusedCell.timestamp)
      const previousWeekDate = focusedDate.setDate(focusedDate.getDate() - 7)

      if (this.disabledDates.to) {
        return previousWeekDate < this.disabledDates.to.valueOf() ? 0 : -7
      }
      return -7
    },
    keyDownDelta() {
      if (this.showEdgeDates) {
        return this.keyDownChangeAmount
      }

      if (this.isNextWeekBlank) {
        const newId = this.focusedId % 7
        this.nextMonth()
        this.$nextTick(() => {
          this.focus(newId)
        })
      }
      return this.keyDownChangeAmount
    },
    keyDownChangeAmount() {
      const focusedDate = new Date(this.focusedCell.timestamp)
      const nextWeekDate = focusedDate.setDate(focusedDate.getDate() + 7)

      if (this.disabledDates.from) {
        return nextWeekDate > this.disabledDates.from.valueOf() ? 0 : 7
      }
      return 7
    },
    keyLeftDelta() {
      if (this.showEdgeDates) {
        // return this.isRtl ? 1 : -1
        return -1
      }
      const isFirstCell = this.focusedCell.id - this.daysFromPrevMonth === 0

      if (isFirstCell && this.focusedCell.id > 0) {
        this.previousMonth()
        this.$nextTick(() => {
          const newId = this.daysInMonth + this.daysFromPrevMonth - 1
          this.focus(newId)
        })
      }
      return this.isRtl ? 1 : -1
      // return -1
    },
    keyRightDelta() {
      if (this.showEdgeDates) {
        // return this.isRtl ? -1 : 1
        return 1
      }
      const isLastCell =
        this.focusedCell.id === this.daysInMonth + this.daysFromPrevMonth - 1

      if (isLastCell && this.daysFromNextMonth > 0) {
        this.nextMonth()
        this.$nextTick(() => {
          const newId = this.daysFromPrevMonth
          this.focus(newId)
        })
      }
      return this.isRtl ? -1 : 1
      // return 1
    },
    /**
     * Returns the current page's month as an integer.
     * @return {Number}
     */
    pageMonth() {
      return this.utils.getMonth(this.pageDate)
    },
    /**
     * Display the current page's month & year as the title.
     * @return {String}
     */
    pageTitleDay() {
      return this.translation.ymd
        ? `${this.currYearName} ${this.currMonthName}`
        : `${this.currMonthName} ${this.currYearName}`
    },
    /**
     * The first day of the next page's month.
     * @return {Date}
     */
    nextPageDate() {
      const d = new Date(this.pageTimestamp)
      return new Date(this.utils.setMonth(d, this.utils.getMonth(d) + 1))
    },
    todayCell() {
      const today = this.utils.getNewDateObject()
      for (let i = 0; i < this.cells.length; i += 1) {
        if (this.cells[i].timestamp === today.valueOf()) {
          return this.cells[i]
        }
      }
      return null
    },
  },
  methods: {
    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    changeMonth(incrementBy) {
      const date = this.pageDate
      this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy)
      this.$emit('changed-month', date)
    },
    /**
     * Set the class for a specific day
     * @param {Object} day
     * @return {Object}
     */
    dayClasses(day) {
      return {
        'selected': day.isSelected,
        'highlighted': day.isHighlighted,
        'muted': day.isPreviousMonth || day.isNextMonth,
        'today': day.isToday,
        'weekend': day.isWeekend,
        'sat': day.isSaturday,
        'sun': day.isSunday,
        'highlight-start': day.isHighlightStart,
        'highlight-end': day.isHighlightEnd,
      }
    },
    /**
     * Whether a day is disabled
     * @param {Date} date to check if disabled
     * @return {Boolean}
     */
    isDisabledDate(date) {
      return new DisabledDate(this.utils, this.disabledDates).isDateDisabled(
        date,
      )
    },
    /**
     * Whether a day is highlighted
     * (only if it is not disabled already except when highlighted.includeDisabled is true)
     * @param {Date} date to check if highlighted
     * @return {Boolean}
     */
    isHighlightedDate(date) {
      const dateWithoutTime = this.utils.resetDateTime(date)

      return new HighlightedDate(
        this.utils,
        this.disabledDates,
        this.highlighted,
      ).isDateHighlighted(dateWithoutTime)
    },
    /**
     * Whether a day is highlighted and it is the last date
     * in the highlighted range of dates
     * @param {Date} date end highlight
     * @return {Boolean}
     */
    isHighlightEnd(date) {
      const config = this.highlightedConfig

      return (
        this.isHighlightedDate(date) &&
        config.to.year === this.utils.getFullYear(date) &&
        config.to.month === this.utils.getMonth(date) &&
        config.to.day === this.utils.getDate(date)
      )
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date} date start highlight
     * @return {Boolean}
     */
    isHighlightStart(date) {
      const config = this.highlightedConfig

      return (
        this.isHighlightedDate(date) &&
        config.from.year === this.utils.getFullYear(date) &&
        config.from.month === this.utils.getMonth(date) &&
        config.from.day === this.utils.getDate(date)
      )
    },
    /**
     * Whether a day is selected
     * @param {Date} dObj to check if selected
     * @return {Boolean}
     */
    isSelectedDate(dObj) {
      return (
        this.selectedDate && this.utils.compareDates(this.selectedDate, dObj)
      )
    },
    /**
     * Defines the objects within the cells array
     * @param  {id}  id
     * @param  {Date}  dObj
     * @return {Object}
     */
    // eslint-disable-next-line complexity
    makeDay(id, dObj) {
      const isNextMonth = dObj >= this.nextPageDate
      const isPreviousMonth = dObj < this.pageDate
      const isSaturday = this.utils.getDay(dObj) === 6
      const isSunday = this.utils.getDay(dObj) === 0
      const showDate = this.showEdgeDates || !(isPreviousMonth || isNextMonth)

      return {
        id,
        date: showDate ? this.utils.getDate(dObj) : '',
        timestamp: dObj.valueOf(),
        isSelected: this.isSelectedDate(dObj),
        isDisabled: showDate ? this.isDisabledDate(dObj) : true,
        isHighlighted: this.isHighlightedDate(dObj),
        isHighlightStart: this.isHighlightStart(dObj),
        isHighlightEnd: this.isHighlightEnd(dObj),
        isToday: this.utils.compareDates(dObj, new Date()),
        isWeekend: isSaturday || isSunday,
        isSaturday,
        isSunday,
        isPreviousMonth,
        isNextMonth,
      }
    },
    /**
     * Set up a new date object to the first day of the current 'page'
     * @return Date
     */
    newPageDate() {
      const d = this.pageDate
      return this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
        : new Date(
            d.getFullYear(),
            d.getMonth(),
            1,
            d.getHours(),
            d.getMinutes(),
          )
    },
    /**
     * Increment the current page month
     */
    nextMonth() {
      if (!this.isNextDisabled) {
        this.changeMonth(+1)
        this.focusIntervalButton(this.isRtl ? 'prev' : 'next')
      }
    },
    /**
     * Decrement the page month
     */
    previousMonth() {
      if (!this.isPreviousDisabled) {
        this.changeMonth(-1)
        this.focusIntervalButton(this.isRtl ? 'next' : 'prev')
      }
    },
    /**
     * Emits a selectDate event
     * @param {Object} date
     */
    // eslint-disable-next-line max-statements
    selectDate(date) {
      if (date.isDisabled) {
        this.$emit('selected-disabled', date)
        return
      }
      if (date.isPreviousMonth) {
        this.selectDateOnPreviousMonth(date)
        return
      }
      if (date.isNextMonth) {
        this.selectDateOnNextMonth(date)
        return
      }
      this.focus(date.id)
      this.$emit('select-date', date)
    },
    selectDateOnPreviousMonth(date) {
      const { timestamp } = date
      this.previousMonth()
      this.$nextTick(() => {
        const newCell = this.cells.find((cell) => cell.timestamp === timestamp)
        this.focus(newCell.id)
        this.$emit('select-date', date)
      })
    },
    selectDateOnNextMonth(date) {
      const { timestamp } = date
      this.nextMonth()
      this.$nextTick(() => {
        const newCell = this.cells.find((cell) => cell.timestamp === timestamp)
        this.focus(newCell.id)
        this.$emit('select-date', newCell)
      })
    },
  },
}
</script>
