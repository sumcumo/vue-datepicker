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
        {{ pageTitleYear }}
      </UpButton>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
    </PickerHeader>
    <button
      v-for="cell in cells"
      :ref="cell.id"
      :key="cell.id"
      :class="{ selected: cell.isSelected }"
      class="cell month"
      :disabled="cell.isDisabled"
      @blur="$emit('check-focus')"
      @click.stop="selectMonth(cell)"
      @focus="focusedCell = cell"
      @keydown.up.prevent="updateCellFocus(keyUpDelta)"
      @keydown.down.prevent="updateCellFocus(keyDownDelta)"
      @keydown.left.prevent="updateCellFocus(keyLeftDelta)"
      @keydown.right.prevent="updateCellFocus(keyRightDelta)"
      @keyup.esc="$emit('close')"
    >
      {{ cell.month }}
    </button>
    <slot name="calendarFooterMonth" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import UpButton from '~/components/UpButton.vue'
import DisabledDate from '~/utils/DisabledDate'

export default {
  name: 'PickerMonth',
  components: { UpButton },
  mixins: [pickerMixin],
  computed: {
    /**
     * Set an array with all months
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
    // canFocusUp() {},
    // canFocusDown() {},
    canFocusLeft() {
      const config = this.disabledConfig
      if (this.isRtl) {
        return this.isNextDisabled && this.focusedId >= config.from.month
      }
      return !this.isPreviousDisabled && this.focusedId > config.to.month
    },
    canFocusRight() {
      const config = this.disabledConfig
      if (this.isRtl) {
        return this.isPreviousDisabled && this.focusedId <= config.to.month
      }
      return !this.isNextDisabled && this.focusedId < config.from.month
    },
    /**
     * Sets an array with all months
     * Is the next year disabled?
     * @return {Boolean}
     */
    isNextDisabled() {
      if (!this.disabledConfig.has.from) {
        return false
      }
      return this.disabledConfig.from.year <= this.pageYear
    },
    /**
     * Is the previous year disabled?
     * @return {Boolean}
     */
    isPreviousDisabled() {
      if (!this.disabledConfig.has.to) {
        return false
      }
      return this.disabledConfig.to.year >= this.pageYear
    },
    keyDownDelta() {
      const isLastRow = this.focusedId >= this.cells.length - this.cols
      return this.isNextDisabled && isLastRow ? 0 : 3
    },
    keyUpDelta() {
      const isFirstRow = this.focusedId < this.cols
      return this.isPreviousDisabled && isFirstRow ? 0 : -3
    },
    keyRightDelta() {
      if (!this.canFocusRight) {
        return 0
      }
      return this.isRtl ? -1 : 1
    },
    keyLeftDelta() {
      if (!this.canFocusLeft) {
        return 0
      }
      return this.isRtl ? 1 : -1
    },
    /**
     * Which year to display on the current page.
     * @return {String}
     */
    pageTitleYear() {
      const { yearSuffix } = this.translation
      return `${this.pageYear}${yearSuffix}`
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
        : new Date(
            d.getFullYear(),
            0,
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
          )
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
      return new DisabledDate(this.utils, this.disabledDates).isMonthDisabled(
        date,
      )
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
