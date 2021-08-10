<template>
  <div>
    <slot name="beforeCalendarHeaderYear" />

    <PickerHeader
      v-if="showHeader"
      ref="pickerHeader"
      :bootstrap-styling="bootstrapStyling"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      @focus-input="focusInput"
      @page-change="changePage($event)"
      @set-focus="$emit('set-focus', $event)"
    >
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
      <UpButton
        ref="up"
        :class="{ btn: bootstrapStyling }"
        :is-disabled="true"
        :is-rtl="isRtl"
      >
        {{ pageTitleYear }}
      </UpButton>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
    </PickerHeader>

    <div class="cells-wrapper">
      <Transition :name="transitionName">
        <PickerCells
          ref="cells"
          :key="pageTitleYear"
          v-slot="{ cell }"
          :bootstrap-styling="bootstrapStyling"
          :cells="cells"
          :tabbable-cell-id="tabbableCellId"
          view="year"
          @select="select($event)"
        >
          {{ cell.year }}
        </PickerCells>
      </Transition>
    </div>

    <slot name="calendarFooterYear" />
  </div>
</template>

<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import DisabledDate from '~/utils/DisabledDate'
import PickerCells from './PickerCells.vue'
import UpButton from './UpButton.vue'

export default {
  name: 'PickerYear',
  components: { PickerCells, UpButton },
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
    // eslint-disable-next-line complexity,max-statements
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
      const todayYear = new Date(
        this.utils.setDate(this.utils.getNewDateObject(), 1),
      )

      for (let i = 0; i < this.yearRange; i += 1) {
        years.push({
          year: this.utils.getFullYear(dObj),
          timestamp: dObj.valueOf(),
          isDisabled: this.isDisabledYear(dObj),
          isOpenDate:
            this.isMinimumView &&
            this.openDate &&
            this.utils.compareDates(dObj, this.openDate),
          isSelected: this.isSelectedYear(dObj),
          isToday: this.utils.compareDates(dObj, todayYear),
        })
        this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1)
      }

      // Fill any remaining cells with blanks to position trailing cells correctly when rtl
      const cellsInGrid = Math.ceil(this.yearRange / 3) * 3
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
