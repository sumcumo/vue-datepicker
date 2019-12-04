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
  mixins: [
    pickerMixin,
  ],
  computed: {
    /**
     * set an object with years for a decade
     * @return {Object[]}
     */
    years() {
      const d = this.pageDate
      const years = []
      // set up a new date object to the beginning of the current 'page'7
      const dObj = this.useUtc
        ? new Date(
          Date.UTC(Math.floor(d.getUTCFullYear() / 10) * 10, d.getUTCMonth(), d.getUTCDate()),
        )
        : new Date(
          Math.floor(
            d.getFullYear() / 10,
          ) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(),
        )
      for (let i = 0; i < 10; i += 1) {
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
      const decadeStart = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10
      const decadeEnd = decadeStart + 9
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
        this.changeYear(-10)
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
      return Math.floor(this.utils.getFullYear(this.disabledDates.to) / 10) * 10
        >= Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10
    },
    /**
     * Increments the decade
     */
    nextDecade() {
      if (!this.isNextDisabled()) {
        this.changeYear(10)
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
      return Math.ceil(this.utils.getFullYear(this.disabledDates.from) / 10) * 10
        <= Math.ceil(this.utils.getFullYear(this.pageDate) / 10) * 10
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
