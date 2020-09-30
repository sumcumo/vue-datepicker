<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderMonth" />
    <PickerHeader
      ref="PickerHeader"
      :config="headerConfig"
      :next="nextYear"
      :previous="previousYear"
      @focus-first-cell="focus(0)"
      @focus-up-button="focusUpButton"
    >
      <UpButton
        ref="up"
        class="month__year_btn"
        :is-disabled="upIsDisabled"
        :is-rtl="isRtl"
        @focus-first-cell="focus(0)"
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
      :class="{ 'selected': cell.isSelected, 'disabled': cell.isDisabled }"
      class="cell month"
      :tabindex="cell.isDisabled ? -1 : null"
      @click.stop="selectMonth(cell)"
      @keydown.up.prevent="refocusCellBy(-3)"
      @keydown.down.prevent="refocusCellBy(3)"
      @keydown.left.prevent="refocusCellBy(isRtl ? 1 : -1)"
      @keydown.right.prevent="refocusCellBy(isRtl ? -1 : 1)"
      @keyup.esc="$emit('close')"
      @focus="focusedCell = cell"
    >
      {{ cell.month }}
    </button>
    <slot name="calendarFooterMonth" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin'
import { isMonthDisabled } from '~/utils/DisabledDatesUtils'
import UpButton from '~/components/UpButton'

export default {
  name: 'PickerMonth',
  components: { UpButton },
  mixins: [
    pickerMixin,
  ],
  computed: {
    /**
     * Set an array with all months
     * @return {Object[]}
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
     * Checks if the previous year is disabled or not
     * @return {Boolean}
     */
    previousIsDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      return this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(this.pageDate)
    },
    /**
     * Checks if the next year is disabled or not
     * @return {Boolean}
     */
    nextIsDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      return this.utils.getFullYear(
        this.disabledDates.from,
      ) <= this.utils.getFullYear(this.pageDate)
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
     * Emits a selectMonth event
     * @param {Object} month
     */
    selectMonth(month) {
      if (!month.isDisabled) {
        this.focus(month.id)
        this.$emit('select-month', month)
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
      this.$emit('changed-year', date)
    },
    /**
     * Decrements the year
     */
    previousYear() {
      if (!this.previousIsDisabled) {
        this.changeYear(-1)
      }
    },
    /**
     * Increments the year
     */
    nextYear() {
      if (!this.nextIsDisabled) {
        this.changeYear(1)
      }
    },
    /**
     * Whether the selected date is in this month
     * @return {Boolean}
     * @param date {Date}
     */
    isSelectedMonth(date) {
      return (this.selectedDate
        && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date)
        && this.utils.getMonth(this.selectedDate) === this.utils.getMonth(date))
    },
    /**
     * Whether a month is disabled
     * @return {Boolean}
     * @param date {Date}
     */
    isDisabledMonth(date) {
      return isMonthDisabled(date, this.disabledDates, this.utils)
    },
  },
}
</script>
