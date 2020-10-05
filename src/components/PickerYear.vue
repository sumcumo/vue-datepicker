<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderYear" />
    <PickerHeader
      :config="headerConfig"
      :next="nextDecade"
      :previous="previousDecade"
    >
      <span slot="headerContent">
        {{ getPageDecade }}
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

    <span
      v-for="year in years"
      :key="year.timestamp"
      :class="{ 'selected': year.isSelected, 'disabled': year.isDisabled }"
      class="cell year"
      @click.stop="selectYear(year)"
    >
      {{ year.year }}
    </span>
    <slot name="calendarFooterYear" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin'
import { isYearDisabled } from '~/utils/DisabledDatesUtils'

export default {
  name: 'DatepickerYearView',
  mixins: [
    pickerMixin,
  ],
  props: {
    yearPickerRange: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    /**
     * set an object with years for a decade
     * @return {Object[]}
     */
    years() {
      const d = this.pageDate
      const years = []

      const year = this.useUtc
        ? Math.floor(d.getUTCFullYear() / this.yearPickerRange) * this.yearPickerRange
        : Math.floor(d.getFullYear() / this.yearPickerRange) * this.yearPickerRange

      // set up a new date object to the beginning of the current 'page'7
      const dObj = this.useUtc
        ? new Date(
          Date.UTC(year, d.getUTCMonth(), d.getUTCDate()),
        )
        : new Date(
          year, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(),
        )
      for (let i = 0; i < this.yearPickerRange; i += 1) {
        years.push({
          year: this.utils.getFullYear(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj),
        })
        this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1)
      }
      return years
    },
    /**
     * Get decade name on current page.
     * @return {String}
     */
    getPageDecade() {
      const yearPageDate = this.utils.getFullYear(this.pageDate)

      const decadeStart = Math.floor(yearPageDate / this.yearPickerRange) * this.yearPickerRange
      const decadeEnd = decadeStart + (this.yearPickerRange - 1)
      const { yearSuffix } = this.translation
      return `${decadeStart} - ${decadeEnd}${yearSuffix}`
    },
  },
  methods: {
    /**
     * Emits a selectYear event
     * @param {Object} year
     */
    selectYear(year) {
      if (!year.isDisabled) {
        this.$emit('select-year', year)
        return true
      }
      return false
    },
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
     * Decrements the decade
     */
    previousDecade() {
      if (!this.isPreviousDisabled()) {
        this.changeYear(-this.yearPickerRange)
        return true
      }
      return false
    },
    /**
     * Checks if the next year is disabled or not
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      const yearTo = this.utils.getFullYear(this.disabledDates.to)
      const yearPageDate = this.utils.getFullYear(this.pageDate)

      return Math.floor(yearTo / this.yearPickerRange) * this.yearPickerRange
        >= Math.floor(yearPageDate / this.yearPickerRange) * this.yearPickerRange
    },
    /**
     * Increments the decade
     */
    nextDecade() {
      if (!this.isNextDisabled()) {
        this.changeYear(this.yearPickerRange)
        return true
      }
      return false
    },
    /**
     * Checks if the next decade is disabled or not
     * @return {Boolean}
     */
    isNextDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      const yearFrom = this.utils.getFullYear(this.disabledDates.from)
      const yearPageDate = this.utils.getFullYear(this.pageDate)

      return Math.ceil(yearFrom / this.yearPickerRange) * this.yearPickerRange
        <= Math.ceil(yearPageDate / this.yearPickerRange) * this.yearPickerRange
    },

    /**
     * Whether the selected date is in this year
     * @param {Date} date
     * @return {Boolean}
     */
    isSelectedYear(date) {
      return this.selectedDate
        && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date)
    },
    /**
     * Whether a year is disabled
     * @param {Date} date
     * @return {Boolean}
     */
    isDisabledYear(date) {
      return isYearDisabled(date, this.disabledDates, this.utils)
    },
  },
}
</script>
