<template>
  <div>
    <slot name="beforeCalendarHeaderYear" />

    <PickerHeader
      v-if="showHeader"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      @page-change="changePage($event)"
    >
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
      <span>
        {{ pageTitleYear }}
      </span>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
    </PickerHeader>

    <PickerCells
      ref="cells"
      :key="pageTitleYear"
      v-slot="{ cell }"
      :cells="cells"
      view="year"
      @select="select($event)"
    >
      {{ cell.year }}
    </PickerCells>

    <slot name="calendarFooterYear" />
  </div>
</template>

<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import DisabledDate from '~/utils/DisabledDate'
import PickerCells from './PickerCells.vue'

export default {
  name: 'PickerYear',
  components: { PickerCells },
  mixins: [pickerMixin],
  props: {
    yearRange: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    /**
     * Sets an array with all years to show this decade (or yearRange)
     * @return {Array}
     */
    cells() {
      const d = this.pageDate
      const years = []
      const year = this.useUtc
        ? Math.floor(d.getUTCFullYear() / this.yearRange) * this.yearRange
        : Math.floor(d.getFullYear() / this.yearRange) * this.yearRange
      // set up a new date object to the beginning of the current 'page'
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
    /**
     * Is the next decade disabled?
     * @return {Boolean}
     */
    isNextDisabled() {
      if (!this.disabledConfig.has.from) {
        return false
      }
      return this.disabledConfig.from.year <= this.pageDecadeEnd
    },
    /**
     * Is the previous decade disabled?
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (!this.disabledConfig.has.to) {
        return false
      }
      return this.disabledConfig.to.year >= this.pageDecadeStart
    },
    /**
     * The year at which the current yearRange starts
     * @return {Number}
     */
    pageDecadeStart() {
      return Math.floor(this.pageYear / this.yearRange) * this.yearRange
    },
    /**
     * The year at which the current yearRange ends
     * @return {Number}
     */
    pageDecadeEnd() {
      return this.pageDecadeStart + this.yearRange - 1
    },
    /**
     * Display the current page's decade (or year range) as the title.
     * @return {String}
     */
    pageTitleYear() {
      const { yearSuffix } = this.translation
      return `${this.pageDecadeStart} - ${this.pageDecadeEnd}${yearSuffix}`
    },
  },
  methods: {
    /**
     * Whether a year is disabled
     * @param {Date} date
     * @return {Boolean}
     */
    isDisabledYear(date) {
      return new DisabledDate(this.utils, this.disabledDates).isYearDisabled(
        date,
      )
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
  },
}
</script>
