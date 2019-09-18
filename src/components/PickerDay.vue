<template>
  <div>
    <slot name="beforeCalendarHeaderDay" />
    <PickerHeader
      :config="headerConfig"
      :next="nextMonth"
      :previous="previousMonth"
    >
      <span
        slot="headerContent"
        :class="allowedToShowView('month') ? 'up' : ''"
        class="day__month_btn"
        @click="showPickerCalendar('month')"
      >
        {{ isYmd ? currYearName : currMonthName }} {{ isYmd ? currMonthName : currYearName }}
      </span>
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
      <template v-if="blankDays > 0">
        <span
          v-for="d in blankDays"
          :key="d.timestamp"
          class="cell day blank"
        />
        <!--    TODO change grid system setup with for example flex to remove the magic    -->
        <!--    the comment arrows in the next two lines are necessary magic to remove the WS   -->
      </template><!--
      --><span
      v-for="day in days"
      :key="day.timestamp"
      :class="dayClasses(day)"
      class="cell day"
      @click="selectDate(day)"
      v-html="dayCellContent(day)"
    />
    </div>
    <slot name="calendarFooterDay" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin'
import { isDateDisabled } from '~/utils/DisabledDatesUtils'

export default {
  mixins: [
    pickerMixin,
  ],
  props: {
    fullMonthName: {
      type: Boolean,
      default: false,
    },
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
    mondayFirst: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek() {
      if (this.mondayFirst) {
        const tempDays = this.translation.days.slice()
        tempDays.push(tempDays.shift())
        return tempDays
      }
      return this.translation.days
    },
    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */
    blankDays() {
      const d = this.pageDate
      const dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
        : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
      if (this.mondayFirst) {
        return this.utils.getDay(dObj) > 0 ? this.utils.getDay(dObj) - 1 : 6
      }
      return this.utils.getDay(dObj)
    },
    /**
     * Set an object with all days inside the month
     * @return {Object[]}
     */
    days() {
      const d = this.pageDate
      const days = []
      // set up a new date object to the beginning of the current 'page'
      const dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
        : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
      const daysInMonth = this.utils.daysInMonth(
        this.utils.getFullYear(dObj), this.utils.getMonth(dObj),
      )
      for (let i = 0; i < daysInMonth; i += 1) {
        days.push({
          date: this.utils.getDate(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: this.utils.compareDates(dObj, new Date()),
          isWeekend: this.utils.getDay(dObj) === 0 || this.utils.getDay(dObj) === 6,
          isSaturday: this.utils.getDay(dObj) === 6,
          isSunday: this.utils.getDay(dObj) === 0,
        })
        this.utils.setDate(dObj, this.utils.getDate(dObj) + 1)
      }
      return days
    },
    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName() {
      const monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr
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
  },
  methods: {
    /**
     * Emits a selectDate event
     * @param {Object} date
     */
    selectDate(date) {
      if (date.isDisabled) {
        this.$emit('selected-disabled', date)
        return false
      }
      this.$emit('select-date', date)
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
      if (!this.isPreviousDisabled()) {
        this.changeMonth(-1)
      }
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
      return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d)
        && this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d)
    },
    /**
     * Increment the current page month
     */
    nextMonth() {
      if (!this.isNextDisabled()) {
        this.changeMonth(+1)
      }
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
      return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d)
        && this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d)
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
  },
}
</script>
