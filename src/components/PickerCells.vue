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
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

const showEdgeDatesValidator = (value: any): boolean => {
  return ['day', 'month', 'year'].includes(value)
}

export interface Cell {
  date: string
  timestamp: number
  isOpenDate: boolean
  isDisabled: boolean
  isHighlightStart: boolean
  isHighlightEnd: boolean
  isHighlighted: boolean
  isPreviousMonth: boolean
  isNextMonth: boolean
  isSaturday: boolean
  isSunday: boolean
  isSelected: boolean
  isToday: boolean
  isWeekend: boolean
}

@Component
export default class PickerCells extends Vue {
  @Prop() value: string | null

  @Prop({ required: true }) cells: Cell[]

  @Prop({
    default: true,
  })
  showEdgeDates: boolean

  @Prop({
    default: true,
  })
  isRtl: boolean

  @Prop({
    default: true,
  })
  bootstrapStyling: boolean

  @Prop() tabbableCellId: Number

  @Prop({ required: true, validator: showEdgeDatesValidator }) view: string

  /**
   * The number of columns in the picker
   * @return {Number}
   */
  get columns() {
    return this.view === 'day' ? 7 : 3
  }

  /**
   * Set the classes for a specific cell
   * @return {Array}
   */
  // eslint-disable-next-line complexity
  cellClasses(cell: Cell) {
    return [
      'cell',
      this.view,
      {
        'btn': this.bootstrapStyling,
        'disabled': cell.isDisabled,
        'highlight-start': cell.isHighlightStart,
        'highlight-end': cell.isHighlightEnd,
        'highlighted': cell.isHighlighted,
        'muted': cell.isPreviousMonth || cell.isNextMonth,
        'open': cell.isOpenDate,
        'sat': cell.isSaturday,
        'sun': cell.isSunday,
        'selected': this.showEdgeDates
          ? cell.isSelected
          : cell.isSelected && !cell.isPreviousMonth && !cell.isNextMonth,
        'today': this.showEdgeDates
          ? cell.isToday
          : cell.isToday && !cell.isPreviousMonth && !cell.isNextMonth,
        'weekend': cell.isWeekend,
      },
    ]
  }

  /**
   * Emits an `arrow` event
   */
  handleArrow(cellId: string, delta: number) {
    this.$emit('arrow', { cellId, delta })
  }
}
</script>
