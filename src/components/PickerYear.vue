<template>
  <div>
    <div v-if="$slots.beforeCalendarHeaderYear">
      <slot name="beforeCalendarHeaderYear" />
    </div>

    <PickerHeader
      v-if="showHeader"
      ref="pickerHeader"
      :bootstrap-styling="bootstrapStyling"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      :is-up-disabled="true"
      @focus-input="focusInput"
      @page-change="changePage($event)"
      @set-focus="$emit('set-focus', $event)"
    >
      <template #prevIntervalBtn>
        <slot name="prevIntervalBtn" />
      </template>
      {{ pageTitleYear }}
      <template #nextIntervalBtn>
        <slot name="nextIntervalBtn" />
      </template>
    </PickerHeader>

    <div class="cells-wrapper">
      <Transition :name="transitionName">
        <PickerCells
          ref="cells"
          :key="pageTitleYear"
          v-slot="{ cell }"
          :bootstrap-styling="bootstrapStyling"
          :cells="cells"
          :is-rtl="isRtl"
          :tabbable-cell-id="tabbableCellId"
          view="year"
          @arrow="handleArrow($event)"
          @select="select($event)"
        >
          {{ cell.year }}
        </PickerCells>
      </Transition>
    </div>

    <div v-if="$slots.calendarFooterYear">
      <slot name="calendarFooterYear" />
    </div>
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
  emits: {
    'set-focus': (refArray) => {
      return refArray.every((ref) => {
        return ['input', 'prev', 'up', 'next', 'tabbableCell'].includes(ref)
      })
    },
  },
  computed: {
    /**
     * Sets an array with all years to show this decade (or yearRange)
     * @return {Array}
     */
    cells() {
      const { utils } = this
      const years = []
      const dObj = this.firstYearCellDate()

      for (let i = 0; i < this.yearRange; i += 1) {
        years.push({
          year: utils.getFullYear(dObj),
          timestamp: dObj.valueOf(),
          isDisabled: this.isDisabledYear(dObj),
          isOpenDate: this.isOpenYear(dObj),
          isSelected: this.isSelectedYear(dObj),
          isToday: this.isTodayYear(dObj),
        })
        utils.setFullYear(dObj, utils.getFullYear(dObj) + 1)
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
     * Set up a new date object to the first year of the current 'page'
     * @return {Date}
     */
    firstYearCellDate() {
      const { utils } = this
      const pageDate = new Date(this.pageDate)
      const firstYear =
        Math.floor(utils.getFullYear(pageDate) / this.yearRange) *
        this.yearRange

      return new Date(utils.setFullYear(pageDate, firstYear))
    },
    /**
     * Whether a year is disabled
     * @param {Date} date
     * @return {Boolean}
     */
    isDisabledYear(date) {
      if (!this.disabledDates) return false

      return new DisabledDate(this.utils, this.disabledDates).isYearDisabled(
        date,
      )
    },
    /**
     * Should the calendar open on this year?
     * @param {Date} date
     * @return {Boolean}
     */
    isOpenYear(date) {
      if (!this.openDate) return false

      const openDateYear = this.utils.getFullYear(this.openDate)
      const thisDateYear = this.utils.getFullYear(date)

      return openDateYear === thisDateYear
    },
    /**
     * Whether the selected date is in this year
     * @param {Date} date
     * @return {Boolean}
     */
    isSelectedYear(date) {
      if (!this.selectedDate) return false

      const year = this.utils.getFullYear(date)

      return (
        this.selectedDate && year === this.utils.getFullYear(this.selectedDate)
      )
    },
    /**
     * Whether the date has the same year as today's date
     * @param {Date} date
     * @return {Boolean}
     */
    isTodayYear(date) {
      const { utils } = this
      const todayYear = utils.getFullYear(utils.getNewDateObject())

      return utils.getFullYear(date) === todayYear
    },
  },
}
</script>
