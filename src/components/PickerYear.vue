<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderYear" />
    <PickerHeader
      ref="PickerHeader"
      :config="headerConfig"
      :next="nextDecade"
      :previous="previousDecade"
      @focus-first-cell="focus(0)"
    >
      <button tabindex="-1">
        {{ getPageDecade }}
      </button>
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
      class="cell year"
      :tabindex="cell.isDisabled ? -1 : null"
      @click.stop="selectYear(cell)"
      @keydown.up.prevent="refocusCellBy(upKeyChange)"
      @keydown.down.prevent="refocusCellBy(downKeyChange)"
      @keydown.left.prevent="refocusCellBy(isRtl ? 1 : -1)"
      @keydown.right.prevent="refocusCellBy(isRtl ? -1 : 1)"
      @keyup.esc="$emit('close')"
      @focus="focusedCell = cell"
    >
      {{ cell.year }}
    </button>
    <slot name="calendarFooterYear" />
  </div>
</template>
<script>
import pickerMixin from '~/mixins/pickerMixin'
import { isYearDisabled } from '~/utils/DisabledDatesUtils'

export default {
  name: 'PickerYear',
  mixins: [
    pickerMixin,
  ],
  computed: {
    /**
     * Set an array with years for a decade
     * @return {Object[]}
     */
    cells() {
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
          id: i,
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
     * Get decade name on current page.
     * @return {String}
     */
    getPageDecade() {
      const decadeStart = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10
      const decadeEnd = decadeStart + 9
      const { yearSuffix } = this.translation
      return `${decadeStart} - ${decadeEnd}${yearSuffix}`
    },
    /**
     * Checks if the next year is disabled or not
     * @return {Boolean}
     */
    previousIsDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      return Math.floor(this.utils.getFullYear(this.disabledDates.to) / 10) * 10
        >= Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10
    },
    /**
     * Checks if the next decade is disabled or not
     * @return {Boolean}
     */
    nextIsDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      return Math.ceil(this.utils.getFullYear(this.disabledDates.from) / 10) * 10
        <= Math.ceil(this.utils.getFullYear(this.pageDate) / 10) * 10
    },
    downKeyChange() {
      switch (this.focusedCell.id) {
        case 7:
        case 8:
          return 4
        case 9:
          return 1
        default:
          return 3
      }
    },
    upKeyChange() {
      switch (this.focusedCell.id) {
        case 0:
          return -1
        case 1:
        case 2:
          return -4
        default:
          return -3
      }
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
     * Emits a selectYear event
     * @param {Object} year
     */
    selectYear(year) {
      if (!year.isDisabled) {
        this.focus(year.id)
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
      if (!this.previousIsDisabled) {
        this.changeYear(-10)
        return true
      }
      return false
    },
    /**
     * Increments the decade
     */
    nextDecade() {
      if (!this.nextIsDisabled) {
        this.changeYear(10)
        return true
      }
      return false
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
