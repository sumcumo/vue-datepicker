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

<script>
export default {
  name: 'PickerCells',
  props: {
    cells: {
      type: Array,
      required: true,
    },
    showEdgeDates: {
      type: Boolean,
      default: true,
    },
    transitionName: {
      type: String,
      default: '',
    },
    view: {
      type: String,
      validator: (val) => ['day', 'month', 'year'].includes(val),
      required: true,
    },
  },
  watch: {
    cells: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          const height = this.getCellWrapperHeight()
          this.$parent.$refs.cellsWrapper.style.height = `${height}px`
        })
      },
    },
  },
  methods: {
    /**
     * Set the classes for a specific cell
     * @return {Array}
     */
    // eslint-disable-next-line complexity
    cellClasses(cell) {
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
    },
    /**
     * Get the cellWrapper height
     */
    /* eslint no-param-reassign: 0 */
    getCellWrapperHeight() {
      const popup = this.$parent.$parent.$el
      const originalDisplay = popup.style.display
      const originalVisibility = popup.style.visibility
      popup.style.display = 'block'
      popup.style.visibility = 'hidden'
      const styles = window.getComputedStyle(this.$el)
      const height =
        this.$el.offsetHeight +
        parseInt(styles.marginTop, 10) +
        parseInt(styles.marginBottom, 10)
      popup.style.display = originalDisplay
      popup.style.visibility = originalVisibility

      return height
    },
  },
}
</script>
