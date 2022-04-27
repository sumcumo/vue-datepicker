<template>
  <div>
    <div v-if="$slots.beforeCalendarHeaderDay">
      <slot name="beforeCalendarHeaderDay" />
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
        @select="$emit('set-view', 'month')"
        @set-focus="$emit('set-focus', $event)"
      >
        {{ pageTitleDay }}
      </UpButton>
      <slot slot="nextIntervalBtn" name="nextIntervalBtn" />
    </PickerHeader>

    <div>
      <div class="day-header">
        <span v-for="day in daysOfWeek" :key="day">
          {{ day }}
        </span>
      </div>

      <div class="cells-wrapper">
        <Transition :name="transitionName">
          <PickerCells
            ref="cells"
            :key="pageTitleDay"
            v-slot="{ cell }"
            :bootstrap-styling="bootstrapStyling"
            :cells="cells"
            :is-rtl="isRtl"
            :show-edge-dates="showEdgeDates"
            :tabbable-cell-id="tabbableCellId"
            view="day"
            @arrow="handleArrow($event)"
            @select="select($event)"
          >
            <slot name="dayCellContent" :cell="cell">
              {{ dayCellContent(cell) }}
            </slot>
          </PickerCells>
        </Transition>
      </div>
    </div>

    <div v-if="$slots.calendarFooterDay">
      <slot name="calendarFooterDay" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { DayCell, Highlighted } from '../../typings'
import pickerMixin from '../mixins/pickerMixin.vue'
import DisabledDate from '../utils/DisabledDate'
import HighlightedDate from '../utils/HighlightedDate'
import PickerCells from './PickerCells.vue'
import UpButton from './UpButton.vue'

@Component({
  components: { PickerCells, UpButton },
})
export default class PickerDay extends Mixins(pickerMixin) {
  @Prop({ default: (day: DayCell) => day.date }) dayCellContent: string

  @Prop({ default: 'sun' }) firstDayOfWeek: string

  @Prop({ default: {} }) highlighted: Highlighted

  @Prop({ default: false }) showFullMonthName: boolean

  @Prop({ default: true }) showEdgeDates: boolean

  /**
   * Sets an array with all days to show this month
   */
  get cells() {
    const days = []
    const daysInCalendar =
      this.daysFromPrevMonth + this.daysInMonth + this.daysFromNextMonth
    const dObj = this.firstCellDate()

    for (let i = 0; i < daysInCalendar; i += 1) {
      days.push(this.makeDay(dObj))
      this.utils.setDate(dObj, this.utils.getDate(dObj) + 1)
    }

    return days
  }

  /**
   * Gets the name of the month the current page is on
   */
  get currMonthName() {
    const monthName = this.showFullMonthName
      ? this.translation.months
      : this.translation.monthsAbbr

    return this.utils.getMonthNameAbbr(this.pageMonth, monthName)
  }

  /**
   * Gets the name of the year that current page is on
   */
  get currYearName() {
    const { yearSuffix } = this.translation
    return `${this.pageYear}${yearSuffix}`
  }

  /**
   * Returns an array of day names
   */
  get daysOfWeek() {
    return this.translation.getDaysStartingOn(this.firstDayOfWeekNumber)
  }

  /**
   * Returns the number of days in this month
   */
  get daysInMonth() {
    return this.utils.getDaysInMonth(this.pageDate)
  }

  /**
   * Calculates how many days to show from the previous month
   */
  get daysFromPrevMonth() {
    const firstOfMonthDayNumber = this.utils.getDay(this.pageDate)
    return (7 - this.firstDayOfWeekNumber + firstOfMonthDayNumber) % 7
  }

  /**
   * Calculates how many days to show from the next month
   */
  get daysFromNextMonth() {
    const daysThisAndPrevMonth = this.daysFromPrevMonth + this.daysInMonth
    return Math.ceil(daysThisAndPrevMonth / 7) * 7 - daysThisAndPrevMonth
  }

  /**
   * Returns first-day-of-week as a number (Sunday is 0)
   */
  get firstDayOfWeekNumber() {
    return this.utils.getDayFromAbbr(this.firstDayOfWeek)
  }

  /**
   * The first day of the next page's month.
   */
  get firstOfNextMonth() {
    const d = new Date(this.pageDate)
    return new Date(this.utils.setMonth(d, this.utils.getMonth(d) + 1))
  }

  /**
   * A look-up object created from 'highlighted' prop
   */
  get highlightedConfig() {
    return new HighlightedDate(
      this.useUtc,
      this.disabledDates,
      this.highlighted,
    ).config
  }

  /**
   * Is the next month disabled?
   */
  get isNextDisabled() {
    if (!this.disabledConfig.has.from) {
      return false
    }

    return (
      this.disabledConfig.from.month! <= this.pageMonth &&
      this.disabledConfig.from.year! <= this.pageYear
    )
  }

  /**
   * Is the previous month disabled?
   */
  get isPreviousDisabled() {
    if (!this.disabledConfig.has.to) {
      return false
    }

    return (
      this.disabledConfig.to.month! >= this.pageMonth &&
      this.disabledConfig.to.year! >= this.pageYear
    )
  }

  /**
   * Returns the current page's month as an integer.
   */
  get pageMonth() {
    return this.utils.getMonth(this.pageDate)
  }

  /**
   * Display the current page's month & year as the title.
   */
  get pageTitleDay() {
    return this.translation.ymd
      ? `${this.currYearName} ${this.currMonthName}`
      : `${this.currMonthName} ${this.currYearName}`
  }

  /**
   * Set up a new date object to the first day of the current 'page'
   */
  firstCellDate() {
    const d = this.pageDate

    const firstOfMonth = this.useUtc
      ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
      : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())

    return new Date(
      firstOfMonth.setDate(firstOfMonth.getDate() - this.daysFromPrevMonth),
    )
  }

  /**
   * Whether a day is disabled
   * @param date to check if disabled
   */
  isDisabledDate(date: Date) {
    return new DisabledDate(this.useUtc, this.disabledDates).isDateDisabled(
      date,
    )
  }

  /**
   * Whether a day is highlighted
   * (only if it is not disabled already except when highlighted.includeDisabled is true)
   * @param date to check if highlighted
   */
  isHighlightedDate(date: Date) {
    const dateWithoutTime = this.utils.resetDateTime(date)

    return new HighlightedDate(
      this.useUtc,
      this.disabledDates,
      this.highlighted,
    ).isDateHighlighted(dateWithoutTime)
  }

  /**
   * Whether a day is highlighted and it is the last date
   * in the highlighted range of dates
   * @param date end highlight
   */
  isHighlightEnd(date: Date) {
    const config = this.highlightedConfig

    return (
      this.isHighlightedDate(date) &&
      config.to.year === this.utils.getFullYear(date) &&
      config.to.month === this.utils.getMonth(date) &&
      config.to.day === this.utils.getDate(date)
    )
  }

  /**
   * Whether a day is highlighted and it is the first date
   * in the highlighted range of dates
   * @param date start highlight
   */
  isHighlightStart(date: Date) {
    const config = this.highlightedConfig

    return (
      this.isHighlightedDate(date) &&
      config.from.year === this.utils.getFullYear(date) &&
      config.from.month === this.utils.getMonth(date) &&
      config.from.day === this.utils.getDate(date)
    )
  }

  /**
   * Whether a day is the openDate
   * @param dObj Date to check if openDate
   */
  isOpenDate(dObj: Date) {
    if (!this.openDate) {
      return false
    }

    return this.utils.compareDates(this.openDate, dObj)
  }

  /**
   * Whether a day is selected
   * @param dObj Date to check if selected
   */
  isSelectedDate(dObj: Date) {
    if (!this.selectedDate) {
      return false
    }

    return this.utils.compareDates(this.selectedDate, dObj)
  }

  /**
   * Defines the objects within the days array
   * @param  dObj
   */
  // eslint-disable-next-line complexity
  makeDay(dObj: Date): DayCell {
    const isNextMonth = dObj >= this.firstOfNextMonth
    const isPreviousMonth = dObj < this.pageDate
    const isSaturday = this.utils.getDay(dObj) === 6
    const isSunday = this.utils.getDay(dObj) === 0
    const showDate = this.showEdgeDates || !(isPreviousMonth || isNextMonth)

    return {
      date: showDate ? this.utils.getDate(dObj).toString() : '',
      timestamp: dObj.valueOf(),
      isSelected: this.isSelectedDate(dObj),
      isDisabled: showDate ? this.isDisabledDate(dObj) : true,
      isHighlighted: this.isHighlightedDate(dObj),
      isHighlightStart: this.isHighlightStart(dObj),
      isHighlightEnd: this.isHighlightEnd(dObj),
      isOpenDate: this.isOpenDate(dObj),
      isToday: this.utils.compareDates(dObj, new Date()),
      isWeekend: isSaturday || isSunday,
      isSaturday,
      isSunday,
      isPreviousMonth,
      isNextMonth,
    }
  }
}
</script>
