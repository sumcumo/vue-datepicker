<script>
import PickerHeader from '~/components/PickerHeader.vue'
import makeDateUtils from '~/utils/DateUtils'
import DisabledDate from '~/utils/DisabledDate'

export default {
  components: { PickerHeader },
  inheritAttrs: false,
  props: {
    allowedToShowView: {
      type: Function,
      default() {},
    },
    disabledDates: {
      type: Object,
      default() {
        return {}
      },
    },
    hasBeenFocused: {
      type: Boolean,
      default: false,
    },
    isRtl: {
      type: Boolean,
      default: false,
    },
    isInline: {
      type: Boolean,
      default: false,
    },
    openDate: {
      type: Date,
      default: null,
    },
    pageDate: {
      type: Date,
      default: null,
    },
    pageTimestamp: {
      type: Number,
      default: 0,
    },
    selectedDate: {
      type: Date,
      default: null,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    translation: {
      type: Object,
      default() {
        return {}
      },
    },
    typeable: {
      type: Boolean,
      default: false,
    },
    useUtc: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      focusedCell: {},
      utils: makeDateUtils(this.useUtc),
    }
  },
  computed: {
    cellsCount() {
      return this.currentView === 'year' ? this.yearRange : this.cells.length
    },
    cols() {
      return this.currentView === 'day' ? 7 : 3
    },
    currentView() {
      return this.$options.name.replace('Picker', '').toLowerCase()
    },
    /**
     * A look-up object created from 'disabledDates' prop
     * @return {Object}
     */
    disabledConfig() {
      return new DisabledDate(this.utils, this.disabledDates).config
    },
    focusedId() {
      return this.focusedCell.id
    },
    isUpDisabled() {
      return !this.allowedToShowView(this.nextViewUp)
    },
    /**
     * Returns the current page's full year as an integer.
     * @return {Number}
     */
    pageYear() {
      return this.utils.getFullYear(this.pageDate)
    },
    nextViewUp() {
      switch (this.currentView) {
        case 'day':
          return 'month'
        case 'month':
          return 'year'
        case 'year':
          return 'decade'
        default:
          return null
      }
    },
    rows() {
      return Math.ceil(this.cellsCount / this.cols)
    },
  },
  mounted() {
    this.defaultFocus()
  },
  methods: {
    // eslint-disable-next-line max-statements,complexity
    defaultFocus() {
      if (this.typeable || (this.isInline && !this.hasBeenFocused)) {
        return
      }
      if (this.focusPageDate()) {
        return
      }
      if (this.focusSelectedDate()) {
        return
      }
      if (this.focusOpenDate()) {
        return
      }
      if (this.focusTodayDate()) {
        return
      }
      if (this.focusUpButton()) {
        return
      }
      this.focusFirstNonDisabledCell()
    },
    emitCheckFocus() {
      if (!this.typeable) {
        this.$emit('check-focus')
      }
    },
    focus(id) {
      if (this.typeable) {
        return
      }
      const cell = this.$refs[id]
      if (cell && !cell.isDisabled) {
        cell[0].focus()
      }
    },
    focusCellWithTimestamp(timestamp) {
      let cell
      for (let i = 0; i < this.cellsCount; i += 1) {
        cell = this.cells[i]
        if (cell.timestamp === timestamp && !cell.isDisabled) {
          this.focus(cell.id)
          return true
        }
      }
      return false
    },
    focusFirstNonDisabledCell() {
      let cell
      for (let i = 0; i < this.cellsCount; i += 1) {
        cell = this.cells[i]
        if (!cell.isDisabled) {
          this.focus(cell.id)
          return
        }
      }
    },
    focusNav(name) {
      this.$refs.PickerHeader.$refs[name].focus()
    },
    focusIntervalButton(name) {
      if (this.typeable) {
        return
      }
      const intervalButton = this.$refs.PickerHeader.$refs[name]
      this.$nextTick(() => {
        if (intervalButton.disabled) {
          this.defaultFocus()
        } else {
          intervalButton.focus()
        }
      })
    },
    focusOpenDate() {
      if (!this.openDate) {
        return false
      }
      return this.focusCellWithTimestamp(this.openDate.valueOf())
    },
    focusPageDate() {
      if (this.currentView === 'day') {
        return false
      }
      return this.focusCellWithTimestamp(this.pageDate.valueOf())
    },
    focusSelectedDate() {
      let cell
      for (let i = 0; i < this.cellsCount; i += 1) {
        cell = this.cells[i]
        if (cell.isSelected && !cell.isDisabled) {
          this.focus(cell.id)
          return true
        }
      }
      return false
    },
    focusTodayDate() {
      if (this.todayCell && !this.todayCell.isDisabled) {
        this.focus(this.todayCell.id)
        return true
      }
      return false
    },
    focusUpButton() {
      if (this.$refs.up) {
        this.$refs.up.focus()
        return true
      }
      return false
    },
    // eslint-disable-next-line max-statements
    setFocusOnNextPage(delta) {
      if (delta === 1) {
        const newId = this.focusedCell.isNextMonth ? this.cols : 0
        this[`next${this.ucFirst(this.nextViewUp)}`]()
        this.$nextTick(() => {
          this.focus(newId)
        })
        return
      }

      let cellsToSkip = 0
      if (this.currentView === 'day') {
        cellsToSkip = this.cells[this.cellsCount - 1].isNextMonth
          ? this.cols
          : 0
      }
      const newId = this.focusedCell.id + delta + cellsToSkip - this.cellsCount

      this[`next${this.ucFirst(this.nextViewUp)}`]()
      this.$nextTick(() => {
        this.focus(newId)
      })
    },
    // eslint-disable-next-line complexity,max-statements
    setFocusOnPreviousPage(delta) {
      if (delta === -1) {
        const cellsToSkip = this.cells[0].isPreviousMonth ? this.cols : 0
        this[`previous${this.ucFirst(this.nextViewUp)}`]()
        this.$nextTick(() => {
          this.focus(this.cellsCount - cellsToSkip - 1)
        })
        return
      }

      const column = this.focusedCell.id
      let rowsToSkip = 0
      if (this.currentView === 'day' && this.cells[0].isPreviousMonth) {
        rowsToSkip = 1
      }
      if (this.currentView === 'year') {
        const fullRowCells = Math.floor(this.yearRange / this.cols) * this.cols
        const landsOnLastRow = this.yearRange - column > fullRowCells
        if (fullRowCells < this.yearRange && !landsOnLastRow) {
          rowsToSkip = 1
        }
      }
      this[`previous${this.ucFirst(this.nextViewUp)}`]()
      this.$nextTick(() => {
        const row = this.rows - rowsToSkip - 1
        const newId = row * this.cols + column
        this.focus(newId)
      })
    },
    /**
     * Emit an event to show the month (or year) picker
     */
    showPickerCalendar(type) {
      this.$emit(`show-${type}-calendar`)
    },
    ucFirst(str) {
      return str[0].toUpperCase() + str.substring(1)
    },
    updateCellFocus(delta) {
      if (!delta) {
        return
      }
      const newId = this.focusedCell.id + delta

      if (newId < 0) {
        this.setFocusOnPreviousPage(delta)
        return
      }
      if (newId >= this.cellsCount) {
        this.setFocusOnNextPage(delta)
        return
      }
      this.focus(newId)
    },
  },
}
</script>
