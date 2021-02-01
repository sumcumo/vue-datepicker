<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderMonth" />
    <PickerHeader
      ref="PickerHeader"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      :is-up-disabled="isUpDisabled"
      :show-header="showHeader"
      @check-focus="$emit('check-focus')"
      @focus-first-cell="focusFirstNonDisabledCell"
      @focus-up-button="focusNavUp"
      @next="nextYear"
      @previous="previousYear"
    >
      <button
        ref="up"
        class="up month__year_btn"
        :disabled="isUpDisabled"
        @blur="$emit('check-focus')"
        @click="showPickerCalendar(nextViewUp)"
        @keydown.down.prevent="focusFirstNonDisabledCell"
        @keydown.left.prevent="focusNav(isRtl ? 'next' : 'prev')"
        @keydown.right.prevent="focusNav(isRtl ? 'prev' : 'next')"
        @keyup.esc="$emit('close')"
      >
        {{ pageTitleMonth }}
      </button>
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
      @keydown.up.prevent="setFocus(nextCell.up)"
      @keydown.down.prevent="setFocus(nextCell.down)"
      @keydown.left.prevent="setFocus(nextCell.left)"
      @keydown.right.prevent="setFocus(nextCell.right)"
      @keyup.esc="$emit('close')"
    >
      {{ cell.month }}
    </button>
    <slot name="calendarFooterMonth" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import DisabledDate from '~/utils/DisabledDate'
import FocusedMonth from '~/utils/FocusedMonth'

export default {
  name: 'PickerMonth',
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
        isDisabledMonth: this.isDisabledMonth,
        showEdgeDates: this.showEdgeDates,
      }

      return new FocusedMonth(config).nextCell
    },
    /**
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
    /**
     * Display the current page's year as the title.
     * @return {String}
     */
    pageTitleMonth() {
      const { yearSuffix } = this.translation
      return `${this.pageYear}${yearSuffix}`
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
    nextYear(viaClick = false) {
      if (this.isNextDisabled) {
        return
      }
      this.changeYear(1)

      if (viaClick) {
        this.focusNav('next')
      }
    },
    /**
     * Decrements the year
     */
    previousYear(viaClick = false) {
      if (this.isPreviousDisabled) {
        return
      }
      this.changeYear(-1)

      if (viaClick) {
        this.focusNav('prev')
      }
    },
    /**
     * Emits a selectMonth event
     * @param {Object} month
     */
    selectMonth(cell) {
      if (!cell.isDisabled) {
        this.$emit('select-month', cell)
      }
    },
  },
}
</script>
