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
    isOpen: {
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
    cellLookupTable() {
      const lookupTable = {}

      for (let i = 0; i < this.cells.length; i += 1) {
        lookupTable[this.cells[i].timestamp] = i
      }

      return lookupTable
    },
    columns() {
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
        case 'year':
          return 'decade'
        case 'month':
          return 'year'
        default:
          return 'month'
      }
    },
    todayCell() {
      let today = this.utils.getNewDateObject()

      if (this.currentView !== 'day') {
        today = this.utils.setDate(today, 1)
      }

      return this.findCellByTimestamp(today.valueOf())
    },
  },
  mounted() {
    this.defaultFocus()
  },
  methods: {
    // eslint-disable-next-line max-statements,complexity
    defaultFocus() {
      return (
        this.focusNothing() ||
        this.focusPageDate() ||
        this.focusSelectedDate() ||
        this.focusOpenDate() ||
        this.focusTodayDate() ||
        this.focusNavUp ||
        this.focusFirstNonDisabledCell()
      )
    },
    findCellByTimestamp(timestamp) {
      return this.cells[this.cellLookupTable[timestamp]]
    },
    focusCell(id) {
      if (this.typeable) {
        return
      }
      const cellElement = this.$refs[id]

      if (cellElement && cellElement[0]) {
        cellElement[0].focus()
      }
    },
    focusCellWithTimestamp(timestamp) {
      const cell = this.findCellByTimestamp(timestamp)

      if (cell && !cell.isDisabled) {
        this.focusCell(cell.id)
        return true
      }

      return false
    },
    focusFirstNonDisabledCell() {
      const cell = this.cells.find((c) => c.isDisabled === false)

      if (cell) {
        this.focusCell(cell.id)
        return true
      }

      return false
    },
    focusNav(name) {
      const navButton = this.$refs.PickerHeader.$refs[name]
      this.$nextTick(() => {
        if (navButton.disabled) {
          this.defaultFocus()
        } else {
          navButton.focus()
        }
      })
    },
    focusNavUp() {
      if (this.$refs.up) {
        this.$refs.up.focus()
      }
    },
    focusNothing() {
      return this.typeable || (this.isInline && !this.hasBeenFocused)
    },
    focusOpenDate() {
      return (
        this.openDate && this.focusCellWithTimestamp(this.openDate.valueOf())
      )
    },
    focusPageDate() {
      if (this.currentView === 'day') {
        return false
      }
      return this.focusCellWithTimestamp(this.pageDate.valueOf())
    },
    focusSelectedDate() {
      if (!this.selectedDate) {
        return false
      }
      const selectedCell = this.findCellByTimestamp(this.selectedDate.valueOf())

      if (selectedCell && !selectedCell.isDisabled) {
        this.focusCell(selectedCell.id)
        return true
      }

      return false
    },
    focusTodayDate() {
      if (this.todayCell && !this.todayCell.isDisabled) {
        this.focusCell(this.todayCell.id)
        return true
      }
      return false
    },
    setFocus(cell) {
      if (this.typeable || cell.isDisabled) {
        return
      }
      if (cell.onOtherPage) {
        this[`setFocus${cell.onOtherPage}`](cell)
        return
      }

      this.focusCell(this.focusedCell.id + cell.delta)
    },
    setFocusPrevious(cell) {
      this[`previous${this.ucFirst(this.nextViewUp)}`]()
      this.$nextTick(() => {
        const newId = this.cells.length + cell.delta
        this.focusCell(newId)
      })
    },
    setFocusNext(cell) {
      this[`next${this.ucFirst(this.nextViewUp)}`]()
      this.$nextTick(() => {
        const newId = cell.delta
        this.focusCell(newId)
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
  },
}
</script>
