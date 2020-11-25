<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderDay" />
    <PickerHeader
      :config="headerConfig"
      :next="nextMonth"
      :previous="previousMonth"
    >
      <span
        :class="allowedToShowView('month') ? 'up' : ''"
        class="day__month_btn"
        @click="showPickerCalendar('month')"
      >
        {{ isYmd ? currYearName : currMonthName }}
        {{ isYmd ? currMonthName : currYearName }}
      </span>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
    </PickerHeader>
    <div :class="isRtl ? 'flex-rtl' : ''">
      <span v-for="d in daysOfWeek" :key="d.timestamp" class="cell day-header">
        {{ d }}
      </span>
      <span
        v-for="day in days"
        :key="day.timestamp"
        class="cell day"
        :class="dayClasses(day)"
        @click="selectDate(day)"
      >
        {{ dayCellContent(day) }}
      </span>
    </div>
    <slot name="calendarFooterDay" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import { isDateDisabled } from '~/utils/DisabledDatesUtils'

export default {
  name: 'DatepickerDayView',
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
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName() {
      const monthName = this.showFullMonthName
        ? this.translation.months
        : this.translation.monthsAbbr
      return this.utils.getMonthNameAbbr(
        this.utils.getMonth(this.pageDate),
        monthName,
      )
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
     * Sets an array with all days to show this month
     * @return {Array}
     */
    days() {
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
    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      const d = this.pageDate
      return (
        this.utils.getMonth(this.disabledDates.from) <=
          this.utils.getMonth(d) &&
        this.utils.getFullYear(this.disabledDates.from) <=
          this.utils.getFullYear(d)
      )
    },
    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      const d = this.pageDate
      return (
        this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d) &&
        this.utils.getFullYear(this.disabledDates.to) >=
          this.utils.getFullYear(d)
      )
    },
    /**
     * Is this translation using year/month/day format?
     * @return {Boolean}
     */
    isYmd() {
      return this.translation.ymd && this.translation.ymd === true
    },
    nextPageDate() {
      const d = new Date(this.pageTimestamp)
      return new Date(this.utils.setMonth(d, this.utils.getMonth(d) + 1))
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
     * set the class for a specific day
     * @param {Object} day
     * @return {Object}
     */
    dayClasses(day) {
      return {
        'selected': day.isSelected,
        'disabled': day.isDisabled,
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
     * @return {Number}
     */
    getPageMonth() {
      return this.utils.getMonth(this.pageDate)
    },
    /**
     * Helper
     * @param  {all}  prop
     * @return {Boolean}
     */
    isDefined(prop) {
      return typeof prop !== 'undefined' && prop
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
        !(this.highlighted && this.highlighted.includeDisabled) &&
        this.isDisabledDate(dateWithoutTime)
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

      if (
        this.isDefined(this.highlighted.from) &&
        this.isDefined(this.highlighted.to)
      ) {
        highlighted =
          dateWithoutTime >= this.highlighted.from &&
          dateWithoutTime <= this.highlighted.to
      }

      if (
        typeof this.highlighted.days !== 'undefined' &&
        this.highlighted.days.indexOf(this.utils.getDay(dateWithoutTime)) !== -1
      ) {
        highlighted = true
      }

      if (
        typeof this.highlighted.daysOfMonth !== 'undefined' &&
        this.highlighted.daysOfMonth.indexOf(
          this.utils.getDate(dateWithoutTime),
        ) !== -1
      ) {
        highlighted = true
      }

      if (
        typeof this.highlighted.customPredictor === 'function' &&
        this.highlighted.customPredictor(dateWithoutTime)
      ) {
        highlighted = true
      }

      return highlighted
    },
    /**
     * Whether a day is highlighted and it is the last date
     * in the highlighted range of dates
     * @param {Date} date end highlight
     * @return {Boolean}
     */
    isHighlightEnd(date) {
      return (
        this.isHighlightedDate(date) &&
        this.highlighted.to instanceof Date &&
        this.utils.getFullYear(this.highlighted.to) ===
          this.utils.getFullYear(date) &&
        this.utils.getMonth(this.highlighted.to) ===
          this.utils.getMonth(date) &&
        this.utils.getDate(this.highlighted.to) === this.utils.getDate(date)
      )
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date} date start highlight
     * @return {Boolean}
     */
    isHighlightStart(date) {
      return (
        this.isHighlightedDate(date) &&
        this.highlighted.from instanceof Date &&
        this.utils.getFullYear(this.highlighted.from) ===
          this.utils.getFullYear(date) &&
        this.utils.getMonth(this.highlighted.from) ===
          this.utils.getMonth(date) &&
        this.utils.getDate(this.highlighted.from) === this.utils.getDate(date)
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
     * Defines the objects within the days array
     * @param  {id}  id
     * @param  {Date}  dObj
     * @return {Object}
     */
    makeDay(id, dObj) {
      const isNextMonth = dObj >= this.nextPageDate
      const isPreviousMonth = dObj < this.pageDate
      const isSaturday = this.utils.getDay(dObj) === 6
      const isSunday = this.utils.getDay(dObj) === 0
      const showDate = this.showEdgeDates || !(isPreviousMonth || isNextMonth)

      return {
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
      }
    },
    /**
     * Decrement the page month
     */
    previousMonth() {
      if (!this.isPreviousDisabled) {
        this.changeMonth(-1)
      }
    },
    /**
     * Emits a selectDate event
     * @param {Object} date
     */
    selectDate(date) {
      if (date.isDisabled) {
        this.$emit('selected-disabled', date)
      } else {
        this.$emit('select-date', date)
      }
    },
  },
}
</script>
