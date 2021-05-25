<script>
import PickerHeader from '~/components/PickerHeader.vue'
import makeDateUtils from '~/utils/DateUtils'
import DisabledDate from '~/utils/DisabledDate'

export default {
  components: { PickerHeader },
  inheritAttrs: false,
  props: {
    rowHeight: {
      type: Number,
      default: 40,
    },
    disabledDates: {
      type: Object,
      default() {
        return {}
      },
    },
    headerHeight: {
      type: Number,
      default: 40,
    },
    isRtl: {
      type: Boolean,
      default: false,
    },
    isTypeable: {
      type: Boolean,
      default: false,
    },
    isUpDisabled: {
      type: Boolean,
      default: false,
    },
    isMinimumView: {
      type: Boolean,
      default: true,
    },
    openDate: {
      type: [String, Date, Number],
      default: null,
      validator: (val) =>
        /* istanbul ignore next */
        val === null ||
        val instanceof Date ||
        typeof val === 'string' ||
        typeof val === 'number',
    },
    pageDate: {
      type: Date,
      default: null,
    },
    selectedDate: {
      type: Date,
      default: null,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    slideDuration: {
      type: Number,
      default: 300,
    },
    tabbableCellId: {
      type: Number,
      default: null,
    },
    transitionName: {
      type: String,
      default: '',
    },
    translation: {
      type: Object,
      default() {
        return {}
      },
    },
    useUtc: {
      type: Boolean,
      default: false,
    },
    view: {
      type: String,
      default: 'day',
    },
    width: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      sections: [],
      utils: makeDateUtils(this.useUtc),
    }
  },
  computed: {
    cellsHeight() {
      const columns = this.view === 'day' ? 7 : 3
      const rows = Math.ceil(this.cells.length / columns)

      return rows * this.rowHeight
    },
    /**
     * A look-up object created from 'disabledDates' prop
     * @return {Object}
     */
    disabledConfig() {
      return new DisabledDate(this.utils, this.disabledDates).config
    },
    hasSlot() {
      const view = this.ucFirst(this.view)

      return {
        header: !!this.$slots[`beforeCalendarHeader${view}`],
        footer: !!this.$slots[`calendarFooter${view}`],
      }
    },
    /**
     * Returns the current page's full year as an integer.
     * @return {Number}
     */
    pageYear() {
      return this.utils.getFullYear(this.pageDate)
    },
    pickerHeight() {
      return Object.values(this.sectionHeights).reduce(
        (total, current) => total + current,
        0,
      )
    },
    sectionHeights() {
      if (!this.sections.length) return { total: 0 }

      const view = this.ucFirst(this.view)
      const headerSlot = this.$refs[`beforeCalendarHeader${view}`]
      const footerSlot = this.$refs[`calendarFooter${view}`]
      const { pickerHeader, dayHeader } = this.$refs

      return {
        headerSlot: this.getElementHeight(headerSlot),
        header: this.getElementHeight(pickerHeader && pickerHeader.$el),
        dayHeader: this.getElementHeight(dayHeader),
        cells: this.cellsHeight,
        footerSlot: this.getElementHeight(footerSlot),
      }
    },
  },
  watch: {
    pickerHeight: {
      immediate: true,
      handler() {
        this.$emit('change-picker-height', this.pickerHeight)
      },
    },
  },
  mounted() {
    this.setPickerSections()
  },
  methods: {
    /**
     * Used when an arrow key press would cause the focus to land on a disabled date
     * @param {Object} options
     */
    addMoreSteps(options) {
      if (options.stepsRemaining <= 0 && Math.abs(options.delta) > 1) {
        return Math.abs(options.delta)
      }
      return options.stepsRemaining
    },
    /**
     * Changes the page up or down
     * @param {Number} incrementBy
     * @param {[String]} focusRefs
     */
    changePage({ incrementBy, focusRefs }) {
      const { pageDate, utils } = this
      const units =
        this.view === 'year' ? incrementBy * this.yearRange : incrementBy

      this.setPickerSections()
      this.$emit('set-transition-name', incrementBy)

      if (this.view === 'day') {
        utils.setMonth(pageDate, utils.getMonth(pageDate) + units)
      } else {
        utils.setFullYear(pageDate, utils.getFullYear(pageDate) + units)
      }

      this.$emit('page-change', { focusRefs, pageDate })
    },
    /**
     * Changes the page and focuses the cell that is being 'arrowed' to
     * @param {Object} options
     */
    changePageAndSetFocus(options) {
      const { delta } = options
      const isPageDisabled =
        (delta > 0 && this.isNextDisabled) ||
        (delta < 0 && this.isPreviousDisabled)

      if (isPageDisabled) {
        return
      }

      this.changePage({
        incrementBy: Math.sign(delta),
        focusRefs: ['arrow-to-cell'],
      })

      this.$nextTick(() => {
        this.setFocusOnNewPage(options)
      })
    },
    /**
     * Returns the element that should be focused when navigating via an arrow key
     * @param  {HTMLElement} currentElement  The element currently being iterated on
     * @param  {Number}      delta           The number of cells that the focus should move
     * @param  {Number}      stepsRemaining  The number of steps remaining in the iteration
     * @return {HTMLElement}
     */
    getElement({ currentElement, delta, stepsRemaining }) {
      const element = this.getElementSibling(currentElement, delta)
      const options = {
        currentElement: element,
        delta,
        stepsRemaining: stepsRemaining - 1,
      }

      if (!element) {
        return this.changePageAndSetFocus(options)
      }

      if (this.isMutedOrDisabled(element)) {
        options.stepsRemaining = this.addMoreSteps(options)

        return this.getElement(options)
      }

      if (stepsRemaining > 1 && options.currentElement) {
        return this.getElement(options)
      }

      return element
    },
    /**
     * Finds the height of an element
     * @param  {HTMLElement|Vue} element
     * @return {Number}
     */
    getElementHeight(element) {
      if (!element) return 0

      const originalPickerDisplay = this.$parent.$el.style.display
      const originalPickerVisibility = this.$parent.$el.style.visibility

      this.$parent.$el.style.display = 'block'
      this.$parent.$el.style.visibility = 'block'

      const styles = window.getComputedStyle(element)
      const height =
        element.offsetHeight +
        parseInt(styles.marginTop, 10) +
        parseInt(styles.marginBottom, 10)

      this.$parent.$el.style.display = originalPickerDisplay
      this.$parent.$el.style.visibility = originalPickerVisibility

      return height
    },
    /**
     * Returns the element directly next to the currentElement
     * @param  {HTMLElement} currentElement  The element currently being iterated on
     * @param  {Number}      delta           The number of cells that the focus should move
     * @return {HTMLElement}
     */
    getElementSibling(currentElement, delta) {
      const isNext = delta > 0

      return isNext
        ? currentElement.nextElementSibling
        : currentElement.previousElementSibling
    },
    /**
     * Returns the first or last cell, depending on the direction of the search
     * @param  {Number} delta The number of cells that the focus should move
     * @return {HTMLElement}
     */
    getFirstOrLastElement(delta) {
      const isNext = delta > 0
      const elements = this.$refs.cells.$el.children

      return isNext ? elements[0] : elements[elements.length - 1]
    },
    /**
     * Moves the focused cell up/down/left/right
     * @param {Object}
     */
    handleArrow({ delta }) {
      const stepsRemaining = Math.abs(delta)
      const options = {
        currentElement: document.activeElement,
        delta,
        stepsRemaining,
      }

      this.setFocusToAvailableCell(options)
    },
    /**
     * Returns true if the calendar has been passed the given slot
     * @param  {String} slotName The name of the slot
     * @return {Boolean}
     */
    // hasSlot(slotName) {
    //   return !!this.$slots[slotName]
    // },
    /**
     * Determines which transition to use (for edge dates) and emits a 'select' event
     * @param {Object} cell
     */
    select(cell) {
      if (cell.isPreviousMonth) {
        this.$emit('set-transition-name', -1)
      }

      if (cell.isNextMonth) {
        this.$emit('set-transition-name', 1)
      }

      this.$emit('select', cell)
    },
    /**
     * Returns true if the given element cannot be focused
     * @param {HTMLElement} element The element in question
     * @return {Boolean}
     */
    isMutedOrDisabled(element) {
      const isMuted = element.classList.value.split(' ').includes('muted')
      const isDisabled = element.disabled

      return isMuted || isDisabled
    },
    /**
     * Sets the focus on the correct cell following a page change
     * @param {Object} options
     */
    setFocusOnNewPage({ delta, stepsRemaining }) {
      const currentElement = this.getFirstOrLastElement(delta)
      const options = {
        currentElement,
        delta,
        stepsRemaining,
      }

      if (stepsRemaining <= 0) {
        if (this.isMutedOrDisabled(currentElement)) {
          options.stepsRemaining = Math.abs(options.delta)

          setTimeout(() => {
            this.setFocusToAvailableCell(options)
          }, this.slideDuration)

          return
        }

        setTimeout(() => {
          currentElement.focus()
        }, this.slideDuration)

        return
      }

      setTimeout(() => {
        this.setFocusToAvailableCell(options)
      }, this.slideDuration)
    },
    /**
     * Sets the focus on the next focusable cell when an arrow key is pressed
     * @param {Object} options
     */
    setFocusToAvailableCell(options) {
      const element = this.getElement(options)

      if (element) {
        element.focus()
      }
    },
    /**
     * Populates an array of sections that comprise the picker: e.g. headerSlot, header, footerSlot
     */
    setPickerSections() {
      if (!this.$el.children) return

      this.$nextTick(() => {
        this.sections = [...this.$el.children]
      })
    },
    /**
     * Capitalizes the first letter
     * @param {String} str The string to capitalize
     * @returns {String}
     */
    ucFirst(str) {
      return str[0].toUpperCase() + str.substring(1)
    },
  },
}
</script>
