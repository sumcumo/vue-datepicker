<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderYear" />
    <PickerHeader
      ref="PickerHeader"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      :is-up-disabled="isUpDisabled"
      :next="nextDecade"
      :previous="previousDecade"
      :show-header="showHeader"
      @check-focus="$emit('check-focus')"
      @focus-first-cell="focusFirstNonDisabledCell"
    >
      <span class="decade">
        {{ pageTitleDecade }}
      </span>
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
      @keydown.up.prevent="updateCellFocus(keyUpDelta)"
      @keydown.down.prevent="updateCellFocus(keyDownDelta)"
      @keydown.left.prevent="updateCellFocus(keyLeftDelta)"
      @keydown.right.prevent="updateCellFocus(keyRightDelta)"
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
      const cellsInGrid = Math.ceil(this.yearRange / this.cols) * this.cols

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
     * The number of non-blank cells on the last row
     * @return {Number}
     */
    cellsOnLastRow() {
      return this.yearRange - this.fullRowCells
    },
    disabledYearFrom() {
      return this.disabledDates.from
        ? this.utils.getFullYear(this.disabledDates.from)
        : null
    },
    disabledYearTo() {
      return this.disabledDates.to
        ? this.utils.getFullYear(this.disabledDates.to)
        : null
    },
    /**
     * The number of cells which are not on the last row
     * @return {Number}
     */
    fullRowCells() {
      return Math.floor(this.yearRange / this.cols) * this.cols
    },
    /**
     * Get decade name on current page.
     * @return {String}
     */
    getPageDecade() {
      const { yearSuffix } = this.translation
      return `${this.pageDecadeStart} - ${this.pageDecadeEnd}${yearSuffix}`
    },
    isFocusOnFirstRow() {
      return this.focusedId < this.cols
    },
    isFocusOnLastRow() {
      return this.focusedId >= this.cells.length - this.cols
    },
    isFocusDownForbidden() {
      return (
        this.isNextDisabled &&
        (this.isFocusOnLastRow || this.isNextCellDownBlank)
      )
    },
    isFocusLeftForbidden() {
      if (this.isRtl) {
        return this.focusedCell.year >= this.disabledYearFrom
      }
      return this.focusedCell.year <= this.disabledYearTo
    },
    isFocusRightForbidden() {
      if (this.isRtl) {
        return this.focusedCell.year <= this.disabledYearTo
      }
      return this.focusedCell.year >= this.disabledYearFrom
    },
    isFocusUpForbidden() {
      return this.isPreviousDisabled && this.isFocusOnFirstRow
    },
    isNextCellDownBlank() {
      return this.focusedId + this.cols >= this.yearRange
    },
    isNextCellUpOnLastRow() {
      return this.cellsCount - this.focusedId > this.fullRowCells
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
    keyUpDelta() {
      if (this.isFocusUpForbidden) {
        return 0
      }
      if (this.isNextCellUpOnLastRow) {
        return -this.cellsOnLastRow
      }
      if (this.isFocusOnFirstRow) {
        return -this.cols - this.cellsOnLastRow
      }

      return -this.cols
    },
    keyDownDelta() {
      if (this.isFocusDownForbidden) {
        return 0
      }
      if (this.isFocusOnLastRow) {
        return this.cellsOnLastRow === 0 ? this.cols : this.cellsOnLastRow
      }
      if (this.isNextCellDownBlank) {
        return this.cols + this.cellsOnLastRow
      }
      return this.cols
    },
    keyRightDelta() {
      if (this.isFocusRightForbidden) {
        return 0
      }
      return this.isRtl ? -1 : 1
    },
    keyLeftDelta() {
      if (this.isFocusLeftForbidden) {
        return 0
      }
      return this.isRtl ? 1 : -1
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
    pageTitleDecade() {
      const { yearSuffix } = this.translation
      return `${this.pageDecadeStart} - ${this.pageDecadeEnd}${yearSuffix}`
    },
    todayCell() {
      const today = this.utils.getNewDateObject()
      for (let i = 0; i < this.cells.length; i += 1) {
        if (this.cells[i].id === this.utils.getFullYear(today) % 10) {
          return this.cells[i]
        }
      }
      return null
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
    nextDecade() {
      if (!this.isNextDisabled) {
        this.changeYear(this.yearRange)
        this.focusIntervalButton(this.isRtl ? 'prev' : 'next')
      }
    },
    /**
     * Decrements the decade
     */
    previousDecade() {
      if (!this.isPreviousDisabled) {
        this.changeYear(-this.yearRange)
        this.focusIntervalButton(this.isRtl ? 'next' : 'prev')
      }
    },
    /**
     * Emits a selectYear event
     * @param {Object} year
     */
    selectYear(year) {
      if (!year.isDisabled) {
        this.focus(year.id)
        this.$emit('select-year', year)
      }
    },
  },
}
</script>
