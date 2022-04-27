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

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { YearCell } from '../../typings'
import pickerMixin from '../mixins/pickerMixin.vue'
import DisabledDate from '../utils/DisabledDate'
import PickerCells from './PickerCells.vue'
import UpButton from './UpButton.vue'

@Component({
  components: { PickerCells, UpButton },
})
export default class PickerYear extends Mixins(pickerMixin) {
  @Prop({ default: 10 }) yearRange: number = 10

  /**
   * Sets an array with all years to show this decade (or yearRange)
   */
  // eslint-disable-next-line complexity,max-statements
  get cells(): YearCell[] {
    const d = this.pageDate
    const years = []
    const year = this.useUtc
      ? Math.floor(d.getUTCFullYear() / this.yearRange) * this.yearRange
      : Math.floor(d.getFullYear() / this.yearRange) * this.yearRange
    // set up a new date object to the beginning of the current 'page'
    const dObj = this.useUtc
      ? new Date(Date.UTC(year, d.getUTCMonth(), d.getUTCDate()))
      : new Date(year, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
    const todayYear = this.utils.getFullYear(this.utils.getNewDateObject())

    for (let i = 0; i < this.yearRange; i += 1) {
      years.push({
        year: this.utils.getFullYear(dObj).toString(),
        timestamp: dObj.valueOf(),
        isDisabled: this.isDisabledYear(dObj),
        isOpenDate: this.isOpenYear(dObj),
        isSelected: this.isSelectedYear(dObj),
        isToday: dObj.getFullYear() === todayYear,
      })
      this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1)
    }

    // Fill any remaining cells with blanks to position trailing cells correctly when rtl
    const cellsInGrid = Math.ceil(this.yearRange / 3) * 3
    for (let i = years.length; i < cellsInGrid; i += 1) {
      years.push({
        year: '',
        timestamp: 0,
        isDisabled: true,
        isOpenDate: false,
        isSelected: false,
        isToday: false,
      })
    }

    return years
  }

  /**
   * Is the next decade disabled?
   */
  get isNextDisabled() {
    if (!this.disabledConfig.has.from) {
      return false
    }

    return this.disabledConfig.from.year! <= this.pageDecadeEnd
  }

  /**
   * Is the previous decade disabled?
   */
  get isPreviousDisabled() {
    if (!this.disabledConfig.has.to) {
      return false
    }

    return this.disabledConfig.to.year! >= this.pageDecadeStart
  }

  /**
   * The year at which the current yearRange starts
   */
  get pageDecadeStart() {
    return Math.floor(this.pageYear / this.yearRange) * this.yearRange
  }

  /**
   * The year at which the current yearRange ends
   */
  get pageDecadeEnd() {
    return this.pageDecadeStart + this.yearRange - 1
  }

  /**
   * Display the current page's decade (or year range) as the title.
   */
  get pageTitleYear() {
    const { yearSuffix } = this.translation
    return `${this.pageDecadeStart} - ${this.pageDecadeEnd}${yearSuffix}`
  }

  /**
   * Whether a year is disabled
   */
  isDisabledYear(date: Date) {
    return new DisabledDate(this.useUtc, this.disabledDates).isYearDisabled(
      date,
    )
  }

  /**
   * Should the calendar open on this year?
   */
  isOpenYear(date: Date) {
    if (!this.openDate) {
      return false
    }

    const openDateYear = this.utils.getFullYear(this.openDate)
    const thisDateYear = this.utils.getFullYear(date)

    return openDateYear === thisDateYear
  }

  /**
   * Whether the selected date is in this year
   */
  isSelectedYear(date: Date) {
    const year = this.utils.getFullYear(date)

    if (!this.selectedDate) {
      return false
    }

    return year === this.utils.getFullYear(this.selectedDate)
  }
}
</script>
