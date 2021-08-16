<template>
  <div class="picker-cells">
    <span
      v-for="cell in cells"
      :key="cell.timestamp"
      :class="cellClasses(cell)"
      @click="$emit('select', cell)"
    >
      <slot :cell="cell" />
    </span>
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

  @Prop() cells: Cell[]

  @Prop({
    default: true,
    validator: showEdgeDatesValidator,
  })
  showEdgeDates: boolean

  @Prop() view: string

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
        'disabled': cell.isDisabled,
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
      },
    ]
  }
}
</script>
