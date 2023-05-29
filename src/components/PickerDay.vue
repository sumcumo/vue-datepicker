<template>
  <div>
    <div v-if="$slots.beforeCalendarHeaderDay">
      <slot name="beforeCalendarHeaderDay" />
    </div>

    <PickerHeader
      v-if="showHeader"
      ref="pickerHeader"
      :bootstrap-styling="bootstrapStyling"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      :is-up-disabled="isUpDisabled"
      next-view-up="month"
      @focus-input="focusInput"
      @page-change="changePage($event)"
      @set-focus="$emit('setFocus', $event)"
      @set-view="$emit('setView', $event)"
    >
      <template #prevIntervalBtn>
        <slot name="prevIntervalBtn" />
      </template>
      {{ pageTitleDay }}
      <template #nextIntervalBtn>
        <slot name="nextIntervalBtn" />
      </template>
    </PickerHeader>

    <div>
      <div class="day-header">
        <span
          v-for="day in daysOfWeek"
          :key="day"
        >
          {{ day }}
        </span>
      </div>

      <div class="cells-wrapper">
        <Transition :name="transitionName">
          <PickerCells
            ref="cells"
            :key="pageTitleDay"
            v-slot="{ cell }"
            :bootstrap-styling="bootstrapStyling"
            :cells="cells"
            :is-rtl="isRtl"
            :show-edge-dates="showEdgeDates"
            :tabbable-cell-id="tabbableCellId"
            view="day"
            @arrow="handleArrow($event)"
            @select="select($event)"
          >
            <slot
              name="dayCellContent"
              :cell="cell"
            >
              {{ dayCellContent(cell) }}
            </slot>
          </PickerCells>
        </Transition>
      </div>
    </div>

    <div v-if="$slots.calendarFooterDay">
      <slot name="calendarFooterDay" />
    </div>
  </div>
</template>

<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import DisabledDate from '~/utils/DisabledDate'
import HighlightedDate from '~/utils/HighlightedDate'
import PickerCells from './PickerCells.vue'

export default {
  name: 'PickerDay',
  components: { PickerCells },
  mixins: [pickerMixin],
  props: {
    dayCellContent: {
      type: Function,
      default: (day) => day.date,
    },
    firstDayOfWeek: {
      type: String,
      default: 'sun',
    },
    highlighted: {
      type: Object,
      default() {
        return {}
      },
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
  emits: {
    setFocus: (refArray) => {
      return refArray.every((ref) => {
        return ['input', 'prev', 'up', 'next', 'tabbableCell'].includes(ref)
      })
    },
    setView: (view) => {
      return view === 'month'
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
      const dObj = this.firstDayCellDate()

      for (let i = 0; i < daysInCalendar; i += 1) {
        days.push(this.makeDay(dObj))
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
      return this.utils.getDaysInMonth(this.pageDate)
    },
    /**
     * Calculates how many days to show from the previous month
     * @return {number}
     */
    daysFromPrevMonth() {
      const firstOfMonthDayNumber = this.utils.getDay(this.pageDate)
      return (7 - this.firstDayOfWeekNumber + firstOfMonthDayNumber) % 7
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
     * The first day of the next page's month.
     * @return {Date}
     */
    firstOfNextMonth() {
      const d = new Date(this.pageDate)
      return new Date(this.utils.setMonth(d, this.utils.getMonth(d) + 1))
    },
    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextDisabled() {
      if (!this.disabledConfig.has.from) {
        return false
      }

      const { from } = this.disabledConfig
      const disabledFromMonth = this.utils.monthYearDate(from.year, from.month)
      const pageMonth = this.utils.monthYearDate(this.pageYear, this.pageMonth)

      return disabledFromMonth <= pageMonth
    },
    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (!this.disabledConfig.has.to) {
        return false
      }

      const { to } = this.disabledConfig
      const disabledToMonth = this.utils.monthYearDate(to.year, to.month)
      const pageMonth = this.utils.monthYearDate(this.pageYear, this.pageMonth)

      return disabledToMonth >= pageMonth
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
  },
  methods: {
    /**
     * Set up a new date object to the first day of the current 'page'
     * @return {Date}
     */
    firstDayCellDate() {
      const pageDate = new Date(this.pageDate)

      return new Date(this.utils.setDate(pageDate, 1 - this.daysFromPrevMonth))
    },
    /**
     * Whether a day is disabled
     * @param {Date} date to check if disabled
     * @return {Boolean}
     */
    isDisabledDate(date) {
      if (!this.disabledDates) return false

      return new DisabledDate(this.utils, this.disabledDates).isDateDisabled(
        date,
      )
    },
    /**
     * Whether a day is highlighted (N.B. Disabled dates are not highlighted unless
     * `highlighted.includeDisabled` is true)
     * @param {Date} date to check if highlighted
     * @return {Boolean}
     */
    isHighlightedDate(date) {
      if (!this.highlighted) return false

      return new HighlightedDate(
        this.utils,
        this.disabledDates,
        this.highlighted,
      ).isDateHighlighted(date)
    },
    /**
     * Whether a date is the last in a range of highlighted dates
     * @param {Date} date
     * @return {Boolean}
     */
    isHighlightEnd(date) {
      if (!this.highlighted) return false

      return new HighlightedDate(
        this.utils,
        this.disabledDates,
        this.highlighted,
      ).isHighlightEnd(date)
    },
    /**
     * Whether a date is the first in a range of highlighted dates
     * @param {Date} date
     * @return {Boolean}
     */
    isHighlightStart(date) {
      if (!this.highlighted) return false

      return new HighlightedDate(
        this.utils,
        this.disabledDates,
        this.highlighted,
      ).isHighlightStart(date)
    },
    /**
     * Whether a day is selected
     * @param {Date} dObj to check if selected
     * @return {Boolean}
     */
    isSelectedDate(dObj) {
      if (!this.selectedDate) return false

      return this.utils.compareDates(this.selectedDate, dObj)
    },
    /**
     * Defines the objects within the days array
     * @param  {Date} dObj
     * @return {Object}
     */
    // eslint-disable-next-line complexity
    makeDay(dObj) {
      const { utils } = this
      const dayOfWeek = utils.getDay(dObj)
      const isNextMonth = dObj >= this.firstOfNextMonth
      const isPreviousMonth = dObj < this.pageDate
      const isSaturday = dayOfWeek === 6
      const isSunday = dayOfWeek === 0
      const showDate = this.showEdgeDates || !(isPreviousMonth || isNextMonth)

      return {
        date: showDate ? utils.getDate(dObj) : '',
        timestamp: dObj.valueOf(),
        isSelected: this.isSelectedDate(dObj),
        isDisabled: showDate ? this.isDisabledDate(dObj) : true,
        isHighlighted: this.isHighlightedDate(dObj),
        isHighlightStart: this.isHighlightStart(dObj),
        isHighlightEnd: this.isHighlightEnd(dObj),
        isOpenDate: utils.compareDates(dObj, this.openDate),
        isToday: utils.compareDates(dObj, utils.getNewDateObject()),
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
