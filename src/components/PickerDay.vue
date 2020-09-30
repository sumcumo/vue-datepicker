<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderDay" />
    <PickerHeader
      ref="PickerHeader"
      :config="headerConfig"
      :next="nextMonth"
      :previous="previousMonth"
      @focus-first-cell="focus(0)"
      @focus-up-button="focusUpButton"
    >
      <UpButton
        ref="up"
        class="day__month_btn"
        :is-disabled="upIsDisabled"
        :is-rtl="isRtl"
        @focus-first-cell="focus(0)"
        @focus-nav="focusNav($event)"
        @next-view-up="showPickerCalendar(nextViewUp)"
      >
        {{ isYmd ? currYearName : currMonthName }} {{ isYmd ? currMonthName : currYearName }}
      </UpButton>
      <slot
        slot="nextIntervalBtn"
        name="nextIntervalBtn"
      />
      <slot
        slot="prevIntervalBtn"
        name="prevIntervalBtn"
      />
    </PickerHeader>
    <div :class="isRtl ? 'flex-rtl' : ''">
      <span
        v-for="d in daysOfWeek"
        :key="d.timestamp"
        class="cell day-header"
      >
        {{ d }}
      </span>
      <button
        v-for="cell in cells"
        :ref="cell.id"
        :key="cell.id"
        :class="dayClasses(cell)"
        class="cell day"
        :tabindex="cell.isDisabled ? -1 : null"
        @click="selectDate(cell)"
        @keydown.up.prevent="refocusCellBy(-7)"
        @keydown.down.prevent="refocusCellBy(7)"
        @keydown.left.prevent="refocusCellBy(isRtl ? 1 : -1)"
        @keydown.right.prevent="refocusCellBy(isRtl ? -1 : 1)"
        @keyup.esc="$emit('close')"
        @focus="focusedCell = cell"
      >
        {{ dayCellContent(cell) }}
      </button>
    </div>
    <slot name="calendarFooterDay" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin'
import { isDateDisabled } from '~/utils/DisabledDatesUtils'
import UpButton from '~/components/UpButton'

export default {
  name: 'PickerDay',
  components: { UpButton },
  mixins: [
    pickerMixin,
  ],
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
      type: Number,
      default: 0,
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
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek() {
      return this.translation.getDaysStartingOn(this.firstDayOfWeek)
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
      return (7 - this.firstDayOfWeek + this.utils.getDay(dObj)) % 7
    },
    /**
     * Calculates how many days to show from the next month
     * @return {number}
     */
    daysFromNextMonth() {
      const daysThisAndPrevMonth = this.daysFromPrevMonth + this.daysInMonth
      return (Math.ceil(daysThisAndPrevMonth / 7) * 7) - daysThisAndPrevMonth
    },
    /**
     * Sets an array with all days to show this month
     * @return {[]}
     */
    cells() {
      const days = []
      const daysInCalendar = this.daysFromPrevMonth + this.daysInMonth + this.daysFromNextMonth
      const firstOfMonth = this.newPageDate()
      const dObj = new Date(firstOfMonth.setDate(firstOfMonth.getDate() - this.daysFromPrevMonth))
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
        ? this.translation.months : this.translation.monthsAbbr
      return this.utils.getMonthNameAbbr(this.utils.getMonth(this.pageDate), monthName)
    },
    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    currYearName() {
      const { yearSuffix } = this.translation
      return `${this.utils.getFullYear(this.pageDate)}${yearSuffix}`
    },
    /**
     * Is this translation using year/month/day format?
     * @return {Boolean}
     */
    isYmd() {
      return this.translation.ymd && this.translation.ymd === true
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
    nextPageDate() {
      const d = new Date(this.pageTimestamp)
      return new Date(this.utils.setMonth(d, this.utils.getMonth(d) + 1))
    },
    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    previousIsDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      const d = this.pageDate
      return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d)
        && this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d)
    },
    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    nextIsDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      const d = this.pageDate
      return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d)
        && this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d)
    },
  },
  methods: {
    /**
     * Set up a new date object to the first day of the current 'page'
     * @return Date
     */
    newPageDate() {
      const d = this.pageDate
      return this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
        : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
    },
    /**
     * Emits a selectDate event
     * @param {Object} date
     */
    selectDate(date) {
      if (date.isDisabled) {
        this.$emit('selected-disabled', date)
        return false
      }
      if (date.isPreviousMonth) {
        const { timestamp } = date
        this.previousMonth()
        this.$nextTick(() => {
          const newCell = this.cells.find((cell) => cell.timestamp === timestamp)
          this.focus(newCell.id)
          this.$emit('set-date', newCell.timestamp)
        })
        return true
      }
      if (date.isNextMonth) {
        const { timestamp } = date
        this.nextMonth()
        this.$nextTick(() => {
          const newCell = this.cells.find((cell) => cell.timestamp === timestamp)
          this.focus(newCell.id)
          this.$emit('set-date', newCell.timestamp)
        })
        return true
      }
      this.focus(date.id)
      this.$emit('set-date', date.timestamp)
      return true
    },
    /**
     * @return {Number}
     */
    getPageMonth() {
      return this.utils.getMonth(this.pageDate)
    },
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
     * Decrement the page month
     */
    previousMonth() {
      if (!this.previousIsDisabled) {
        this.changeMonth(-1)
      }
    },
    /**
     * Increment the current page month
     */
    nextMonth() {
      if (!this.nextIsDisabled) {
        this.changeMonth(+1)
      }
    },
    /**
     * Whether a day is selected
     * @param {Date} dObj to check if selected
     * @return {Boolean}
     */
    isSelectedDate(dObj) {
      return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj)
    },
    /**
     * Whether a day is disabled
     * @param {Date} date to check if disabled
     * @return {Boolean}
     */
    isDisabledDate(date) {
      return isDateDisabled(date, this.disabledDates, this.utils)
    },
    /**
     * Whether a day is highlighted
     * (only if it is not disabled already except when highlighted.includeDisabled is true)
     * @param {Date} date to check if highlighted
     * @return {Boolean}
     */
    isHighlightedDate(date) {
      const dateWithoutTime = this.utils.resetDateTime(date)
      if (
        !(this.highlighted && this.highlighted.includeDisabled)
        && this.isDisabledDate(dateWithoutTime)
      ) {
        return false
      }

      let highlighted = false

      if (typeof this.highlighted === 'undefined') {
        return false
      }

      if (typeof this.highlighted.dates !== 'undefined') {
        this.highlighted.dates.forEach((d) => {
          if (this.utils.compareDates(dateWithoutTime, d)) {
            highlighted = true
          }
        })
      }

      if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
        highlighted = dateWithoutTime >= this.highlighted.from
          && dateWithoutTime <= this.highlighted.to
      }

      if (
        typeof this.highlighted.days !== 'undefined'
        && this.highlighted.days.indexOf(this.utils.getDay(dateWithoutTime)) !== -1
      ) {
        highlighted = true
      }

      if (
        typeof this.highlighted.daysOfMonth !== 'undefined'
        && this.highlighted.daysOfMonth.indexOf(this.utils.getDate(dateWithoutTime)) !== -1
      ) {
        highlighted = true
      }

      if (
        typeof this.highlighted.customPredictor === 'function'
        && this.highlighted.customPredictor(dateWithoutTime)
      ) {
        highlighted = true
      }

      return highlighted
    },
    /**
     * set the class for a specific day
     * @param {Object} day
     * @return {Object}
     */
    dayClasses(day) {
      return {
        selected: day.isSelected,
        disabled: day.isDisabled,
        highlighted: day.isHighlighted,
        muted: day.isPreviousMonth || day.isNextMonth,
        today: day.isToday,
        weekend: day.isWeekend,
        sat: day.isSaturday,
        sun: day.isSunday,
        'highlight-start': day.isHighlightStart,
        'highlight-end': day.isHighlightEnd,
      }
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date} date start highlight
     * @return {Boolean}
     */
    isHighlightStart(date) {
      return this.isHighlightedDate(date)
        && (this.highlighted.from instanceof Date)
        && (this.utils.getFullYear(this.highlighted.from) === this.utils.getFullYear(date))
        && (this.utils.getMonth(this.highlighted.from) === this.utils.getMonth(date))
        && (this.utils.getDate(this.highlighted.from) === this.utils.getDate(date))
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date} date end highlight
     * @return {Boolean}
     */
    isHighlightEnd(date) {
      return this.isHighlightedDate(date)
        && (this.highlighted.to instanceof Date)
        && (this.utils.getFullYear(this.highlighted.to) === this.utils.getFullYear(date))
        && (this.utils.getMonth(this.highlighted.to) === this.utils.getMonth(date))
        && (this.utils.getDate(this.highlighted.to) === this.utils.getDate(date))
    },
    /**
     * Helper
     * @param  {all}  prop
     * @return {Boolean}
     */
    isDefined(prop) {
      return typeof prop !== 'undefined' && prop
    },
    makeDay(id, dObj) {
      const isPreviousMonth = dObj < this.pageDate
      const isNextMonth = dObj >= this.nextPageDate
      const isSaturday = this.utils.getDay(dObj) === 6
      const isSunday = this.utils.getDay(dObj) === 0
      const showDate = !(isPreviousMonth || isNextMonth) || this.showEdgeDates

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
  },
}
</script>
