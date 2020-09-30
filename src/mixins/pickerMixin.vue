<script>
import PickerHeader from '~/components/PickerHeader'
import { makeDateUtils } from '~/utils/DateUtils'

export default ({
  components: { PickerHeader },
  inheritAttrs: false,
  props: {
    allowedToShowView: {
      type: Function,
      default() {
      },
    },
    disabledDates: {
      type: Object,
      default() {
        return {}
      },
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
      utils: makeDateUtils(this.useUtc),
      focusedCell: {},
      headerConfig: {
        showHeader: this.showHeader,
        isRtl: this.isRtl,
        upIsDisabled: this.upIsDisabled,
        /**
         * Need to be set inside the different pickers for month, year, decade
         */
        nextIsDisabled: this.nextIsDisabled,
        previousIsDisabled: this.previousIsDisabled,
      },
    }
  },
  computed: {
    currentView() {
      return this.$options.name.replace('Picker', '')
        .toLowerCase()
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
    selectedCell() {
      for (let i = 0; i < this.cells.length; i += 1) {
        if (this.cells[i].isSelected) {
          return this.cells[i]
        }
      }
      return null
    },
    cols() {
      return this.currentView === 'day' ? 7 : 3
    },
    rows() {
      return Math.ceil(this.cells.length / this.cols)
    },
    upIsDisabled() {
      return !this.allowedToShowView(this.nextViewUp)
    },
  },
  mounted() {
    this.initialFocus()
  },
  methods: {
    /**
     * Emit an event to show the month picker
     */
    showPickerCalendar(type) {
      this.$emit(`show-${type}-calendar`)
    },
    focusNav(name) {
      this.$refs.PickerHeader.$refs[name].focus()
    },
    focusUpButton() {
      this.$refs.up.$el.focus()
    },
    initialFocus() {
      if (this.typeable || this.isInline) {
        return
      }
      if (this.cells.some((cell) => cell.isSelected)) {
        this.focus(this.selectedCell.id)
        return
      }
      if (this.openDate) {
        let openCell
        for (let i = 0; i < this.cells.length; i += 1) {
          if (this.cells[i].timestamp === this.openDate.valueOf()) {
            openCell = this.cells[i]
            break
          }
        }
        this.focus(openCell.id)
        return
      }
      if (this.todayCell) {
        this.focus(this.todayCell.id)
        return
      }
      if (this.allowedToShowView(this.nextViewUp.toLowerCase())) {
        this.$refs.PickerHeader.$slots.default[0].elm.focus()
        return
      }
      this.focus(0)
    },
    focus(id) {
      const cell = this.$refs[id]
      if (cell && !cell.isDisabled) {
        cell[0].focus()
      }
    },
    refocusCellBy(delta) {
      const newId = this.focusedCell.id + delta
      if (newId < 0) {
        this.focusPreviousPage(delta)
        return
      }

      if (newId >= this.cells.length) {
        this.focusNextPage(delta)
        return
      }

      this.focus(newId)
    },
    focusPreviousPage(delta) {
      if (delta === -1) {
        const cellsToSkip = this.cells[0].isPreviousMonth ? this.cols : 0
        this[`previous${this.ucFirst(this.nextViewUp)}`]()
        this.$nextTick(() => {
          this.focus(this.cells.length - cellsToSkip - 1)
        })
        return
      }

      const column = this.focusedCell.id
      let rowsToSkip = 0

      if (this.currentView === 'day' && this.cells[0].isPreviousMonth) {
        rowsToSkip = 1
      }

      if (this.currentView === 'year' && this.cells.length + column > 10) {
        rowsToSkip = 1
      }

      this[`previous${this.ucFirst(this.nextViewUp)}`]()
      this.$nextTick(() => {
        const row = this.rows - rowsToSkip - 1
        const newId = (row * this.cols) + column
        this.focus(newId)
      })
    },
    focusNextPage(delta) {
      if (delta === 1) {
        const newId = this.focusedCell.isNextMonth ? this.cols : 0
        this[`next${this.ucFirst(this.nextViewUp)}`]()
        this.$nextTick(() => {
          this.focus(newId)
        })
        return
      }

      const cellsToSkip = this.cells[this.cells.length - 1].isNextMonth ? this.cols : 0
      const newId = this.focusedCell.id + delta + cellsToSkip - this.cells.length
      this[`next${this.ucFirst(this.nextViewUp)}`]()
      this.$nextTick(() => {
        this.focus(newId)
      })
    },
    ucFirst(str) {
      return str[0].toUpperCase() + str.substring(1)
    },
  },
})
</script>
