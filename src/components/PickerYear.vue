<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderYear" />
    <PickerHeader
      :config="headerConfig"
      :next="nextDecade"
      :previous="previousDecade"
    >
      <span>
        {{ getPageDecade }}
      </span>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
    </PickerHeader>

    <span
      v-for="year in years"
      :key="year.timestamp"
      :class="{ selected: year.isSelected, disabled: year.isDisabled }"
      class="cell year"
      @click.stop="selectYear(year)"
    >
      {{ year.year }}
    </span>
    <slot name="calendarFooterYear" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import { isMonthDisabled, isYearDisabled } from '~/utils/DisabledDatesUtils'

export default {
  name: 'DatepickerYearView',
  mixins: [pickerMixin],
  props: {
    yearRange: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    /**
     * Is the next decade disabled?
     * @return {Boolean}
     */
    isNextDisabled() {
      if (!this.hasDisabledFrom) {
        return false
      }
      return this.disabledFromYear <= this.pageDecadeEnd
    },
    /**
     * Is the previous decade disabled?
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (!this.hasDisabledTo) {
        return false
      }
      return this.disabledToYear >= this.pageDecadeStart
    },
    /**
     * Get decade name on current page.
     * @return {String}
     */
    getPageDecade() {
      const { yearSuffix } = this.translation
      return `${this.pageDecadeStart} - ${this.pageDecadeEnd}${yearSuffix}`
    },
    /**
     * Set an array with years for a decade
     * @return {Array}
     */
    years() {
      const d = this.pageDate
      const years = []
      const year = this.useUtc
        ? Math.floor(d.getUTCFullYear() / this.yearRange) * this.yearRange
        : Math.floor(d.getFullYear() / this.yearRange) * this.yearRange

      // set up a new date object to the beginning of the current 'page'7
      const dObj = this.useUtc
        ? new Date(Date.UTC(year, d.getUTCMonth(), d.getUTCDate()))
        : new Date(
            year,
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
          )
      for (let i = 0; i < this.yearRange; i += 1) {
        years.push({
          year: this.utils.getFullYear(dObj),
          timestamp: dObj.valueOf(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj),
        })
        this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1)
      }
      return years
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
      this.$emit('changed-decade', date)
    },
    /**
     * Whether a year is disabled
     * @param {Date} date
     * @return {Boolean}
     */
    isDisabledYear(date) {
      return isYearDisabled(date, this.disabledDates, this.utils)
    },
    // eslint-disable-next-line complexity,max-statements
    isYearDisabled2(date) {
      if (!this.hasDisabledConfig) {
        return false
      }

      const year = this.utils.getFullYear(date)
      const isDisabledTo = this.hasDisabledTo && year < this.disabledToYear
      const isDisabledFrom =
        this.hasDisabledFrom && year > this.disabledFromYear

      // check if the whole year is disabled before checking each individual month
      if (isDisabledTo || isDisabledFrom) {
        return true
      }

      // now we have to check each month of the year
      for (let i = 0; i < 12; i += 1) {
        const monthDate = new Date(date)
        monthDate.setMonth(i)
        // if at least one month of this year is NOT disabled,
        // we can conclude that this year SHOULD be selectable
        if (!isMonthDisabled(monthDate, this.disabledDates, this.utils)) {
          return false
        }
      }
      return true
    },
    /**
     * Whether the selected date is in this year
     * @param {Date} date
     * @return {Boolean}
     */
    isSelectedYear(date) {
      const year = this.utils.getFullYear(date)

      return (
        this.selectedDate && year === this.utils.getFullYear(this.selectedDate)
      )
    },
    /**
     * Increments the decade
     */
    nextDecade() {
      if (!this.isNextDisabled) {
        this.changeYear(this.yearRange)
      }
    },
    /**
     * Decrements the decade
     */
    previousDecade() {
      if (!this.isPreviousDisabled) {
        this.changeYear(-this.yearRange)
      }
    },
    /**
     * Emits a selectYear event
     * @param {Object} year
     */
    selectYear(year) {
      if (!year.isDisabled) {
        this.$emit('select-year', year)
      }
    },
  },
}
</script>
