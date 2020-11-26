<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderMonth" />
    <PickerHeader
      ref="PickerHeader"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      :is-up-disabled="isUpDisabled"
      :next="nextYear"
      :previous="previousYear"
      :show-header="showHeader"
      @check-focus="$emit('check-focus')"
      @focus-first-cell="focusFirstNonDisabledCell"
      @focus-up-button="focusUpButton"
    >
      <UpButton
        ref="up"
        class="month__year_btn"
        :is-disabled="isUpDisabled"
        :is-rtl="isRtl"
        @check-focus="$emit('check-focus')"
        @focus-first-cell="focusFirstNonDisabledCell"
        @focus-nav="focusNav($event)"
        @next-view-up="showPickerCalendar(nextViewUp)"
      >
        {{ pageYearName }}
      </UpButton>
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
      class="cell month"
      :disabled="cell.isDisabled"
      @blur="$emit('check-focus')"
      @click.stop="selectMonth(cell)"
      @focus="focusedCell = cell"
      @keydown.up.prevent="updateCellFocus(keyUpChange)"
      @keydown.down.prevent="updateCellFocus(keyDownChange)"
      @keydown.left.prevent="updateCellFocus(keyLeftChange)"
      @keydown.right.prevent="updateCellFocus(keyRightChange)"
      @keyup.esc="$emit('close')"
    >
      {{ cell.month }}
    </button>
    <slot name="calendarFooterMonth" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import { isMonthDisabled } from '~/utils/DisabledDatesUtils'
import UpButton from '~/components/UpButton.vue'

export default {
  name: 'PickerMonth',
  components: { UpButton },
  mixins: [
    pickerMixin,
  ],
  computed: {
    /**
     * Sets an array with all months
     * @return {Array}
     */
    cells() {
      const months = []
      const dObj = this.newPageMonth()

      for (let i = 0; i < 12; i += 1) {
        months.push({
          id: i,
          month: this.utils.getMonthName(i, this.translation.months),
          timestamp: dObj.valueOf(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj),
        })
        this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1)
      }
      return months
    },
    disabledMonthFrom() {
      return this.utils.getMonth(this.disabledDates.from)
    },
    disabledMonthTo() {
      return this.utils.getMonth(this.disabledDates.to)
    },
    /**
     * Is the next year disabled?
     * @return {Boolean}
     */
    isNextDisabled() {
      if (this.disabledFromDateNotUsed) {
        return false
      }
      return this.utils.getFullYear(
        this.disabledDates.from,
      ) <= this.utils.getFullYear(this.pageDate)
    },
    /**
     * Is the previous year disabled?
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (this.disabledToDateNotUsed) {
        return false
      }
      return this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(this.pageDate)
    },
    /**
     * Get year name on current page.
     * @return {String}
     */
    pageYearName() {
      const { yearSuffix } = this.translation
      return `${this.utils.getFullYear(this.pageDate)}${yearSuffix}`
    },
    todayCell() {
      const today = this.utils.getNewDateObject()
      for (let i = 0; i < this.cells.length; i += 1) {
        if (this.cells[i].id === this.utils.getMonth(today)) {
          return this.cells[i]
        }
      }
      return null
    },
    keyDownChange() {
      const isLastRow = this.focusedCell.id >= this.cells.length - this.cols
      return this.isNextDisabled && isLastRow ? 0 : 3
    },
    keyUpChange() {
      const isFirstRow = this.focusedCell.id < this.cols
      return this.isPreviousDisabled && isFirstRow ? 0 : -3
    },
    keyRightChange() {
      if (this.isRtl) {
        return this.isPreviousDisabled && this.focusedCell.id <= this.disabledMonthTo ? 0 : -1
      }
      return this.isNextDisabled && this.focusedCell.id >= this.disabledMonthFrom ? 0 : 1
    },
    keyLeftChange() {
      if (this.isRtl) {
        return this.isNextDisabled && this.focusedCell.id >= this.disabledMonthFrom ? 0 : 1
      }
      return this.isPreviousDisabled && this.focusedCell.id <= this.disabledMonthTo ? 0 : -1
    },
  },
  methods: {
    /**
     * Set up a new date object to the first month of the current 'page'
     * @return Date
     */
    newPageMonth() {
      const d = this.pageDate
      return this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate()))
        : new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes())
    },
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
    /**
     * Whether the selected date is in this month
     * @param {Date} date
     * @return {Boolean}
     */
    isSelectedMonth(date) {
      return (this.selectedDate
        && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date)
        && this.utils.getMonth(this.selectedDate) === this.utils.getMonth(date))
    },
    /**
     * Increments the year
     */
    nextYear() {
      if (!this.isNextDisabled) {
        this.changeYear(1)
        this.focusIntervalButton(this.isRtl ? 'prev' : 'next')
      }
    },
    /**
     * Decrements the year
     */
    previousYear() {
      if (!this.isPreviousDisabled) {
        this.changeYear(-1)
        this.focusIntervalButton(this.isRtl ? 'next' : 'prev')
      }
    },
    /**
     * Emits a selectMonth event
     * @param {Object} month
     */
    selectMonth(month) {
      if (!month.isDisabled) {
        this.focus(month.id)
        this.$emit('select-month', month)
      }
    },
  },
}
</script>
