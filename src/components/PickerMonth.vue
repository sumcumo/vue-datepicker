<template>
  <div>
    <slot name="beforeCalendarHeaderMonth" />

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
        :is-disabled="isUpDisabled"
        :is-rtl="isRtl"
        @focus-input="focusInput"
        @select="$emit('set-view', 'year')"
        @set-focus="$emit('set-focus', $event)"
      >
        {{ pageTitleMonth }}
      </UpButton>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
    </PickerHeader>

    <div class="cells-wrapper">
      <Transition :name="transitionName">
        <PickerCells
          ref="cells"
          :key="pageTitleMonth"
          v-slot="{ cell }"
          :bootstrap-styling="bootstrapStyling"
          :cells="cells"
          :is-rtl="isRtl"
          :tabbable-cell-id="tabbableCellId"
          view="month"
          @arrow="handleArrow($event)"
          @select="select($event)"
        >
          {{ cell.month }}
        </PickerCells>
      </Transition>
    </div>

    <slot name="calendarFooterMonth" />
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

      const todayMonth = new Date(
        this.utils.setDate(this.utils.getNewDateObject(), 1),
      )

      for (let i = 0; i < 12; i += 1) {
        months.push({
          month: this.utils.getMonthName(i, this.translation.months),
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
