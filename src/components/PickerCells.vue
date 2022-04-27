<template>
  <div class="picker-cells" data-test-picker-cells>
    <button
      v-for="(cell, id) in cells"
      :key="cell.timestamp"
      :ref="cell.isOpenDate ? 'openDate' : null"
      :class="cellClasses(cell)"
      :data-id="id"
      :data-test-tabbable-cell="id === tabbableCellId"
      :data-test-open-date="cell.isOpenDate"
      :data-test-today-cell="cell.isToday"
      :disabled="cell.isDisabled"
      type="button"
      @click="$emit('select', cell)"
      @keydown.up.prevent="handleArrow(id, -columns)"
      @keydown.down.prevent="handleArrow(id, columns)"
      @keydown.left.prevent="handleArrow(id, isRtl ? 1 : -1)"
      @keydown.right.prevent="handleArrow(id, isRtl ? -1 : 1)"
    >
      <slot :cell="cell" />
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DayCell, MonthCell, View, YearCell } from '../../typings'

@Component
export default class PickerCells extends Vue {
  @Prop({ default: false }) bootstrapStyling: boolean

  @Prop({ required: true }) cells: DayCell[] | MonthCell[] | YearCell[]

  @Prop({ default: false }) isRtl: boolean

  @Prop({ default: false }) showEdgeDates: boolean

  @Prop({ default: null }) tabbableCellId: number | null

  @Prop({ required: true }) view: View

  /**
   * The number of columns in the picker
   */
  get columns(): number {
    return this.view === 'day' ? 7 : 3
  }

  /**
   * Set the classes for a specific cell
   */
  // eslint-disable-next-line complexity
  cellClasses(cell: DayCell | MonthCell | YearCell): ['cell', View, object] {
    let dayClasses = {}

    if (cell.type === 'day') {
      dayClasses = {
        'highlight-start': cell.isHighlightStart,
        'highlight-end': cell.isHighlightEnd,
        'highlighted': cell.isHighlighted,
        'muted': cell.isPreviousMonth || cell.isNextMonth,
        'sat': cell.isSaturday,
        'sun': cell.isSunday,
        'selected': this.showEdgeDates
          ? cell.isSelected
          : cell.isSelected && !cell.isPreviousMonth && !cell.isNextMonth,
        'today': this.showEdgeDates
          ? cell.isToday
          : cell.isToday && !cell.isPreviousMonth && !cell.isNextMonth,
        'weekend': cell.isWeekend,
      }
    }

    return [
      'cell',
      this.view,
      {
        btn: this.$props.bootstrapStyling,
        disabled: cell.isDisabled,
        open: cell.isOpenDate,
        selected: cell.isSelected,
        today: cell.isToday,
        ...dayClasses,
      },
    ]
  }

  /**
   * Emits an `arrow` event
   */
  handleArrow(cellId: number, delta: number) {
    this.$emit('arrow', { cellId, delta })
  }
}
</script>
