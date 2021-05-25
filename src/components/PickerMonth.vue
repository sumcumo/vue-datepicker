<template>
  <div
    class="picker-view"
    @keydown.tab="$emit('tab', $event)"
    @focusin="$emit('focusin', $event)"
  >
    <div v-if="hasSlot.header" ref="beforeCalendarHeaderMonth">
      <slot name="beforeCalendarHeaderMonth" />
    </div>

    <PickerHeader
      v-if="showHeader"
      ref="pickerHeader"
      :height="headerHeight"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      :is-typeable="isTypeable"
      :is-up-disabled="isUpDisabled"
      @clear-date="$emit('clear-date')"
      @page-change="changePage($event)"
      @reset-tabbable-cell="$emit('reset-tabbable-cell')"
      @set-focus="$emit('set-focus', $event)"
    >
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
      <UpButton
        ref="up"
        class="month__year_btn"
        :is-disabled="isUpDisabled"
        :is-rtl="isRtl"
        :is-typeable="isTypeable"
        @clear-date="$emit('clear-date')"
        @select="$emit('set-view', 'year')"
        @set-focus="$emit('set-focus', $event)"
      >
        {{ pageTitleMonth }}
      </UpButton>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
    </PickerHeader>

    <div
      class="cells-wrapper"
      :style="`transition-duration: ${slideDuration}ms; height: ${cellsHeight}px`"
    >
      <Transition :name="transitionName">
        <PickerCells
          ref="cells"
          :key="pageTitleMonth"
          v-slot="{ cell }"
          :cells="cells"
          :is-rtl="isRtl"
          :row-height="rowHeight"
          :style="`transition-duration: ${slideDuration}ms`"
          :tabbable-cell-id="tabbableCellId"
          view="month"
          @arrow="handleArrow($event)"
          @clear-date="$emit('clear-date')"
          @select="select($event)"
        >
          {{ monthCellContent(cell) }}
        </PickerCells>
      </Transition>
    </div>

    <div v-if="hasSlot.footer" ref="calendarFooterMonth">
      <slot name="calendarFooterMonth" />
    </div>
  </div>
</template>

<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import DisabledDate from '~/utils/DisabledDate'
import PickerCells from './PickerCells.vue'
import UpButton from './UpButton.vue'

export default {
  name: 'PickerMonth',
  components: { PickerCells, UpButton },
  props: {
    monthCellContent: {
      type: Function,
      default: (month) => month.month,
    },
  },
  mixins: [pickerMixin],
  computed: {
    /**
     * Sets an array with all months to show this year
     * @return {Array}
     */
    cells() {
      const d = this.pageDate
      const months = []
      // set up a new date object to the beginning of the current 'page'
      const dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate()))
        : new Date(
            d.getFullYear(),
            0,
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
          )
      const { translation } = this
      const todayMonth = new Date(
        this.utils.setDate(this.utils.getNewDateObject(), 1),
      )

      for (let i = 0; i < 12; i += 1) {
        months.push({
          month: this.utils.getMonthName(i, translation.months),
          monthAbbr: this.utils.getMonthNameAbbr(i, translation.monthsAbbr),
          timestamp: dObj.valueOf(),
          isDisabled: this.isDisabledMonth(dObj),
          isOpenDate:
            this.isMinimumView &&
            this.openDate &&
            this.utils.compareDates(dObj, this.openDate),
          isSelected: this.isSelectedMonth(dObj),
          isToday: this.utils.compareDates(dObj, todayMonth),
        })
        this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1)
      }

      return months
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
  },
}
</script>
