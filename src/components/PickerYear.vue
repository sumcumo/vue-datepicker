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

    <button
      v-for="cell in cells"
      :ref="cell.id"
      :key="cell.id"
      :class="{ 'selected': cell.isSelected }"
      class="cell year"
      :disabled="cell.isDisabled"
      @blur="$emit('check-focus')"
      @click.stop="selectYear(cell)"
      @focus="focusedCell = cell"
      @keydown.up.prevent="updateCellFocus(keyUpChange)"
      @keydown.down.prevent="updateCellFocus(keyDownChange)"
      @keydown.left.prevent="updateCellFocus(keyLeftChange)"
      @keydown.right.prevent="updateCellFocus(keyRightChange)"
      @keyup.esc="$emit('close')"
    >
      {{ cell.year }}
    </button>
    <slot name="calendarFooterYear" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import { isYearDisabled } from '~/utils/DisabledDatesUtils'

export default {
  name: 'PickerYear',
  mixins: [
    pickerMixin,
  ],
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
      return this.disabledDates.from ? this.utils.getFullYear(this.disabledDates.from) : null
    },
    disabledYearTo() {
      return this.disabledDates.to ? this.utils.getFullYear(this.disabledDates.to) : null
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
      const yearPageDate = this.utils.getFullYear(this.pageDate)

      const decadeStart = Math.floor(yearPageDate / this.yearRange) * this.yearRange
      const decadeEnd = decadeStart + (this.yearRange - 1)
      const { yearSuffix } = this.translation
      return `${decadeStart} - ${decadeEnd}${yearSuffix}`
    },
    /**
     * Is the next decade disabled?
     * @return {Boolean}
     */
    isNextDisabled() {
      if (this.disabledFromDateNotUsed) {
        return false
      }
      const lastCellYear = this.cells[this.yearRange - 1].year

      return this.disabledYearFrom <= lastCellYear
    },
    /**
     * Is the previous decade disabled?
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (this.disabledToDateNotUsed) {
        return false
      }
      const yearPageDate = this.utils.getFullYear(this.pageDate)

      return Math.floor(this.disabledYearTo / this.yearRange) * this.yearRange
        >= Math.floor(yearPageDate / this.yearRange) * this.yearRange
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
    keyUpChange() {
      const isFirstRow = this.focusedCell.id < this.cols
      const landsOnLastRow = this.cellsCount - this.focusedCell.id > this.fullRowCells

      if (this.isPreviousDisabled && isFirstRow) {
        return 0
      }
      if (landsOnLastRow) {
        return -this.cellsOnLastRow
      }
      if (isFirstRow) {
        return -this.cols - this.cellsOnLastRow
      }

      return -this.cols
    },
    keyDownChange() {
      const isLastRow = this.focusedCell.id >= this.cells.length - this.cols
      const nextCellIsBlank = (this.focusedCell.id + this.cols) >= this.yearRange

      if (this.isNextDisabled && (isLastRow || nextCellIsBlank)) {
        return 0
      }
      if (isLastRow) {
        return this.cellsOnLastRow === 0 ? this.cols : this.cellsOnLastRow
      }
      if (nextCellIsBlank) {
        return this.cols + this.cellsOnLastRow
      }
      return this.cols
    },
    keyRightChange() {
      if (this.isRtl && !this.disabledYearTo) {
        return -1
      }
      if (!this.isRtl && !this.disabledYearFrom) {
        return 1
      }
      if (this.isRtl) {
        return this.focusedCell.year <= this.disabledYearTo ? 0 : -1
      }
      return this.focusedCell.year >= this.disabledYearFrom ? 0 : 1
    },
    keyLeftChange() {
      if (this.isRtl && !this.disabledYearFrom) {
        return 1
      }
      if (!this.isRtl && !this.disabledYearTo) {
        return -1
      }
      if (this.isRtl) {
        return this.focusedCell.year >= this.disabledYearFrom ? 0 : 1
      }
      return this.focusedCell.year <= this.disabledYearTo ? 0 : -1
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
     * Set up a new date object to the first year of the current 'page'
     */
    newPageYear() {
      const d = this.pageDate
      const year = this.useUtc
        ? Math.floor(d.getUTCFullYear() / this.yearRange) * this.yearRange
        : Math.floor(d.getFullYear() / this.yearRange) * this.yearRange

      return this.useUtc
        ? new Date(Date.UTC(year, d.getUTCMonth(), d.getUTCDate()))
        : new Date(year, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
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
