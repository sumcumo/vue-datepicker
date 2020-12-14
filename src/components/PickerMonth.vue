<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderMonth" />
    <PickerHeader
      :config="headerConfig"
      :next="nextYear"
      :previous="previousYear"
    >
      <span
        class="month__year_btn"
        :class="allowedToShowView('year') ? 'up' : ''"
        @click="showPickerCalendar('year')"
      >
        {{ pageYearName }}
      </span>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
    </PickerHeader>
    <span
      v-for="month in months"
      :key="month.timestamp"
      :class="{ selected: month.isSelected, disabled: month.isDisabled }"
      class="cell month"
      @click.stop="selectMonth(month)"
    >
      {{ month.month }}
    </span>
    <slot name="calendarFooterMonth" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import { isDateDisabled, isMonthDisabled } from '~/utils/DisabledDatesUtils'

export default {
  name: 'DatepickerMonthView',
  mixins: [pickerMixin],
  computed: {
    /**
     * Is the next year disabled?
     * @return {Boolean}
     */
    isNextDisabled() {
      if (!this.hasDisabledFrom) {
        return false
      }
      return this.disabledFromYear <= this.pageYear
    },
    /**
     * Is the previous year disabled?
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (!this.hasDisabledTo) {
        return false
      }
      return this.disabledToYear >= this.pageYear
    },
    /**
     * Set an array with all months
     * @return {Array}
     */
    months() {
      const d = this.pageDate
      const months = []
      // set up a new date object to the beginning of the current 'page'
      const dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate()))
        : new Date(
            d.getFullYear(),
            0,
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
          )
      for (let i = 0; i < 12; i += 1) {
        months.push({
          month: this.utils.getMonthName(i, this.translation.months),
          timestamp: dObj.valueOf(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth2(dObj),
        })
        this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1)
      }
      return months
    },
    /**
     * Get year name on current page.
     * @return {String}
     */
    pageYearName() {
      const { yearSuffix } = this.translation
      return `${this.utils.getFullYear(this.pageDate)}${yearSuffix}`
    },
  },
  methods: {
    /**
     * Changes the year up or down
     * @param {Number} incrementBy
     */
    changeYear(incrementBy) {
      const date = this.pageDate
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy)
      this.$emit('changed-year', date)
    },
    /**
     * Whether a month is disabled
     * @param {Date} date
     * @return {Boolean}
     */
    isDisabledMonth(date) {
      return isMonthDisabled(date, this.disabledDates, this.utils)
    },
    // eslint-disable-next-line complexity,max-statements
    isDisabledMonth2(date) {
      if (!this.hasDisabledConfig) {
        return false
      }

      const month = this.utils.getMonth(date)
      const year = this.utils.getFullYear(date)

      const isPastSameYearAndPastMonth =
        this.hasDisabledTo &&
        month < this.disabledToMonth &&
        year <= this.disabledToYear

      const isYearInPast = this.hasDisabledTo && year < this.disabledToYear

      const isFutureSameYearAndFutureMonth =
        this.hasDisabledFrom &&
        month > this.disabledFromMonth &&
        year >= this.disabledFromYear

      const isYearInFuture =
        this.hasDisabledFrom && year > this.disabledFromYear

      // check if the whole month is disabled before checking each individual day
      if (
        (this.hasDisabledTo && isPastSameYearAndPastMonth) ||
        isYearInPast ||
        (this.hasDisabledFrom &&
          isFutureSameYearAndFutureMonth &&
          isYearInFuture)
      ) {
        return true
      }

      // now we have to check each day of the month
      const daysInMonth = this.utils.daysInMonth(year, month)

      for (let i = 1; i <= daysInMonth; i += 1) {
        const dayDate = new Date(date)
        dayDate.setDate(i)
        // if at least one day of this month is NOT disabled,
        // we can conclude that this month SHOULD be selectable
        if (!isDateDisabled(dayDate, this.disabledDates, this.utils)) {
          return false
        }
      }
      return true
    },
    /**
     * Whether the selected date is in this month
     * @param {Date} date
     * @return {Boolean}
     */
    isSelectedMonth(date) {
      const month = this.utils.getMonth(date)
      const year = this.utils.getFullYear(date)

      return (
        this.selectedDate &&
        year === this.utils.getFullYear(this.selectedDate) &&
        month === this.utils.getMonth(this.selectedDate)
      )
    },
    /**
     * Increments the year
     */
    nextYear() {
      if (!this.isNextDisabled) {
        this.changeYear(1)
      }
    },
    /**
     * Decrements the year
     */
    previousYear() {
      if (!this.isPreviousDisabled) {
        this.changeYear(-1)
      }
    },
    /**
     * Emits a selectMonth event
     * @param {Object} month
     */
    selectMonth(month) {
      if (!month.isDisabled) {
        this.$emit('select-month', month)
      }
    },
  },
}
</script>
