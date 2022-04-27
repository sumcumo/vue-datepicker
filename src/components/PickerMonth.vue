<template>
  <div>
    <div v-if="$slots.beforeCalendarHeaderMonth">
      <slot name="beforeCalendarHeaderMonth" />
    </div>

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

    <div v-if="$slots.calendarFooterMonth">
      <slot name="calendarFooterMonth" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { MonthCell } from '../../typings'
import pickerMixin from '../mixins/pickerMixin.vue'
import DisabledDate from '../utils/DisabledDate'
import PickerCells from './PickerCells.vue'
import UpButton from './UpButton.vue'

@Component({
  components: { PickerCells, UpButton },
})
export default class PickerMonth extends Mixins(pickerMixin) {
  /**
   * Sets an array with all months to show this year
   */
  get cells(): MonthCell[] {
    const d = this.pageDate
    const months: MonthCell[] = []
    // set up a new date object to the beginning of the current 'page'
    const dObj = this.useUtc
      ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate()))
      : new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes())

    const todayMonth = new Date(
      this.utils.setDate(this.utils.getNewDateObject(), 1),
    )

    for (let i = 0; i < 12; i += 1) {
      months.push({
        month: this.utils.getMonthName(i, this.translation.months),
        timestamp: dObj.valueOf(),
        isDisabled: this.isDisabledMonth(dObj),
        isOpenDate: this.isOpenMonth(dObj),
        isSelected: this.isSelectedMonth(dObj),
        isToday: this.utils.compareDates(dObj, todayMonth),
      })
      this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1)
    }

    return months
  }

  /**
   * Is the next year disabled?
   */
  get isNextDisabled() {
    if (!this.disabledConfig.has.from) {
      return false
    }
    return this.disabledConfig.from.year! <= this.pageYear
  }

  /**
   * Is the previous year disabled?
   */
  get isPreviousDisabled() {
    if (!this.disabledConfig.has.to) {
      return false
    }
    return this.disabledConfig.to.year! >= this.pageYear
  }

  /**
   * Display the current page's year as the title.
   */
  get pageTitleMonth() {
    const { yearSuffix } = this.translation
    return `${this.pageYear}${yearSuffix}`
  }

  /**
   * Whether a month is disabled
   */
  isDisabledMonth(date: Date) {
    return new DisabledDate(this.useUtc, this.disabledDates).isMonthDisabled(
      date,
    )
  }

  /**
   * Should the calendar open on this month?
   */
  isOpenMonth(date: Date) {
    if (!this.openDate) {
      return false
    }

    const openDateMonth = this.utils.getMonth(this.openDate)
    const openDateYear = this.utils.getFullYear(this.openDate)
    const thisDateMonth = this.utils.getMonth(date)
    const thisDateYear = this.utils.getFullYear(date)

    return openDateMonth === thisDateMonth && openDateYear === thisDateYear
  }

  /**
   * Whether the selected date is in this month
   */
  isSelectedMonth(date: Date) {
    const month = this.utils.getMonth(date)
    const year = this.utils.getFullYear(date)

    if (!this.selectedDate) {
      return false
    }

    return (
      year === this.utils.getFullYear(this.selectedDate) &&
      month === this.utils.getMonth(this.selectedDate)
    )
  }
}
</script>
