<template>
  <div class="picker-view">
    <slot name="beforeCalendarHeaderMonth" />
    <PickerHeader
      v-if="showHeader"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      @next="nextPage"
      @previous="previousPage"
    >
      <slot slot="prevIntervalBtn" name="prevIntervalBtn" />
      <span
        class="month__year_btn"
        :class="{ up: !isUpDisabled }"
        @click="$emit('set-view', 'year')"
      >
        {{ pageTitleMonth }}
      </span>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
    </PickerHeader>
    <div ref="cells">
      <span
        v-for="cell in cells"
        :key="cell.timestamp"
        class="cell month"
        :class="{ selected: cell.isSelected, disabled: cell.isDisabled }"
        @click="select(cell)"
      >
        {{ cell.month }}
      </span>
    </div>
    <slot name="calendarFooterMonth" />
  </div>
</template>

<script>
import pickerMixin from '~/mixins/pickerMixin.vue'
import DisabledDate from '~/utils/DisabledDate'

export default {
  name: 'PickerMonth',
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

      for (let i = 0; i < 12; i += 1) {
        months.push({
          month: this.utils.getMonthName(i, this.translation.months),
          timestamp: dObj.valueOf(),
          isDisabled: this.isDisabledMonth(dObj),
          isSelected: this.isSelectedMonth(dObj),
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
