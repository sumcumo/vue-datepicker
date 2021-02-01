<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderYear" />
    <PickerHeader
      ref="PickerHeader"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      :is-up-disabled="isUpDisabled"
      :show-header="showHeader"
      @check-focus="$emit('check-focus')"
      @focus-first-cell="focusFirstNonDisabledCell"
      @next="nextDecade"
      @previous="previousDecade"
    >
      <span class="decade">{{ pageTitleYear }}</span>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
    </PickerHeader>
    <button
      v-for="cell in cells"
      :ref="cell.id"
      :key="cell.id"
      :class="{ selected: cell.isSelected }"
      class="cell year"
      :disabled="cell.isDisabled"
      @blur="$emit('check-focus')"
      @click.stop="selectYear(cell)"
      @focus="focusedCell = cell"
      @keydown.up.prevent="setFocus(nextCell.up)"
      @keydown.down.prevent="setFocus(nextCell.down)"
      @keydown.left.prevent="setFocus(nextCell.left)"
      @keydown.right.prevent="setFocus(nextCell.right)"
      @keyup.esc="$emit('close')"
    >
      {{ cell.year }}
    </button>
    <slot name="calendarFooterYear" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import DisabledDate from '~/utils/DisabledDate'
import FocusedYear from '~/utils/FocusedYear'

export default {
  name: 'PickerYear',
  mixins: [pickerMixin],
  props: {
    yearRange: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    /**
     * Sets an array with years for a decade (or the no. of years in yearRange)
     * @return {Array}
     */
    cells() {
      const years = []
      const dObj = this.newPageYear()
      const cellsInGrid =
        Math.ceil(this.yearRange / this.columns) * this.columns

      for (let i = 0; i < this.yearRange; i += 1) {
        years.push({
          id: i,
          year: this.utils.getFullYear(dObj),
          timestamp: dObj.valueOf(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj),
        })
        this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1)
      }

      // Fill any remaining cells with blanks to position trailing cells correctly when rtl
      for (let i = years.length; i < cellsInGrid; i += 1) {
        years.push({
          id: i,
          isDisabled: true,
        })
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
     * Determines properties of the next cell up/down/left/right
     * @return {Object}
     */
    nextCell() {
      const config = {
        cells: this.cells,
        columns: this.columns,
        daysFromNextMonth: this.daysFromNextMonth,
        daysFromPrevMonth: this.daysFromPrevMonth,
        focusedCell: this.focusedCell,
        isRtl: this.isRtl,
        isDisabledYear: this.isDisabledYear,
        showEdgeDates: this.showEdgeDates,
        yearRange: this.yearRange,
      }

      return new FocusedYear(config).nextCell
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
     * Get decade name on current page.
     * @return {String}
     */
    pageTitleYear() {
      const { yearSuffix } = this.translation
      return `${this.pageDecadeStart} - ${this.pageDecadeEnd}${yearSuffix}`
    },
  },
  methods: {
    /**
     * Changes the decade (or yearRange) up or down
     * @param {Number} incrementBy
     */
    changeDecade(incrementBy) {
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
    /**
     * Set up a new date object to the first year of the current 'page'
     */
    newPageYear() {
      const d = this.pageDate
      const year = this.useUtc
        ? Math.floor(d.getUTCFullYear() / this.yearRange) * this.yearRange
        : Math.floor(d.getFullYear() / this.yearRange) * this.yearRange

      return this.useUtc
        ? new Date(Date.UTC(year, d.getUTCMonth(), d.getUTCDate()))
        : new Date(
            year,
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
          )
    },
    /**
     * Increments the decade
     */
    nextDecade(viaClick = false) {
      if (this.isNextDisabled) {
        return
      }
      this.changeDecade(this.yearRange)

      if (viaClick) {
        this.focusNav('next')
      }
    },
    /**
     * Decrements the decade
     */
    previousDecade(viaClick = false) {
      if (this.isPreviousDisabled) {
        return
      }
      this.changeDecade(-this.yearRange)

      if (viaClick) {
        this.focusNav('prev')
      }
    },
    /**
     * Emits a selectYear event
     * @param {Object} year
     */
    selectYear(cell) {
      if (!cell.isDisabled) {
        this.$emit('select-year', cell)
      }
    },
  },
}
</script>
