<script>
import PickerHeader from '~/components/PickerHeader.vue'
import makeDateUtils from '~/utils/DateUtils'
import DisabledDate from '~/utils/DisabledDate'

export default {
  components: { PickerHeader },
  props: {
    bootstrapStyling: {
      type: Boolean,
      default: false,
    },
    disabledDates: {
      type: Object,
      default: null,
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
      default: 250,
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
  },
  emits: {
    pageChange: (config) => {
      return typeof config === 'object'
    },
    select: (cell) => {
      return typeof cell === 'object'
    },
    setFocus: (refArray) => {
      return refArray === ['input']
    },
    setSkipReviewFocus: (value) => {
      return typeof value === 'boolean'
    },
    setTransitionName: (incrementBy) => {
      return incrementBy === -1 || incrementBy === 1
    },
  },
  data() {
    return {
      utils: makeDateUtils(this.useUtc),
    }
  },
  computed: {
    /**
     * A look-up object created from 'disabledDates' prop
     * @return {Object}
     */
    disabledConfig() {
      if (!this.disabledDates) {
        return {
          has: {
            from: false,
            to: false,
          },
        }
      }

      return new DisabledDate(this.utils, this.disabledDates).config
    },
    earliestPossibleDate() {
      if (!this.disabledDates) return null

      return new DisabledDate(
        this.utils,
        this.disabledDates,
      ).getEarliestPossibleDate(this.disabledDates.to)
    },
    latestPossibleDate() {
      if (!this.disabledDates) return null

      return new DisabledDate(
        this.utils,
        this.disabledDates,
      ).getLatestPossibleDate(this.disabledDates.from)
    },
    /**
     * Returns the current page's full year as an integer.
     * @return {Number}
     */
    pageYear() {
      return this.utils.getFullYear(this.pageDate)
    },
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

      this.$emit('setTransitionName', incrementBy)

      if (this.view === 'day') {
        utils.setMonth(pageDate, utils.getMonth(pageDate) + units)
      } else {
        utils.setFullYear(pageDate, utils.getFullYear(pageDate) + units)
      }

      this.$emit('pageChange', { focusRefs, pageDate })
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

      this.$emit('setSkipReviewFocus', true)

      this.changePage({
        incrementBy: Math.sign(delta),
        focusRefs: ['arrow-to-cell'],
      })

      this.$nextTick(() => {
        this.setFocusOnNewPage(options)
        this.$emit('setSkipReviewFocus', false)
      })
    },
    /**
     * Focuses the input field, if typeable
     */
    focusInput() {
      if (this.isTypeable) {
        this.$emit('setFocus', ['input'])
      }
    },
    /**
     * Returns the element that should be focused when navigating via an arrow key
     * @param  {HTMLButtonElement} currentElement  The element currently being iterated on
     * @param  {Number}            delta           The number of cells that the focus should move
     * @param  {Number}            stepsRemaining  The number of steps remaining in the iteration
     * @return {HTMLButtonElement | void}
     */
    // eslint-disable-next-line complexity,max-statements
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

      if (this.isBeyondPossibleDate(options)) {
        return this.firstOrLastPossibleDate(options)
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
     * Returns the element directly next to the currentElement
     * @param  {HTMLButtonElement} currentElement The element currently being iterated on
     * @param  {Number}            delta          The number of cells that the focus should move
     * @return {HTMLButtonElement}
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
     * @return {HTMLButtonElement}
     */
    getFirstOrLastElement(delta) {
      const isNext = delta > 0
      const elements = this.$refs.cells.$el.children

      return isNext ? elements[0] : elements[elements.length - 1]
    },
    /**
     * Returns the first or last non-disabled date, depending on the direction of the search
     * @param  {HTMLButtonElement} currentElement  The element currently being iterated on
     * @param  {Number}            delta           The number of cells that the focus should move
     */
    firstOrLastPossibleDate({ currentElement, delta }) {
      if (delta > 0) {
        return this.getElementSibling(currentElement, -1)
      }

      return this.getElementSibling(currentElement, 1)
    },
    /**
     * Moves the focused cell up/down/left/right
     * @param {Object}
     */
    handleArrow({ delta }) {
      const activeElement = document.activeElement.shadowRoot
        ? document.activeElement.shadowRoot.activeElement
        : document.activeElement
      const stepsRemaining = Math.abs(delta)
      const options = {
        currentElement: activeElement,
        delta,
        stepsRemaining,
      }

      this.setFocusToAvailableCell(options)
    },
    /**
     * Determines which transition to use (for edge dates) and emits a 'select' event
     * @param {Object} cell
     */
    select(cell) {
      if (cell.isPreviousMonth) {
        this.$emit('setTransitionName', -1)
      }

      if (cell.isNextMonth) {
        this.$emit('setTransitionName', 1)
      }

      this.$emit('select', cell)
    },
    /**
     * Returns true if the given element cannot be focused
     * @param  {HTMLButtonElement} currentElement  The element currently being iterated on
     * @param  {Number}            delta           The number of cells that the focus should move
     * @return {Boolean}
     */
    isBeyondPossibleDate({ currentElement, delta }) {
      if (delta > 0 && this.latestPossibleDate) {
        return this.isDatePossible(currentElement, delta)
      }

      if (delta < 0 && this.earliestPossibleDate) {
        return this.isDatePossible(currentElement, delta)
      }

      return false
    },
    /**
     * Returns true if the current element's date is NOT possible, given the `disabled-dates`
     * @param  {HTMLButtonElement} element The element in question
     * @param  {Number}            delta   Used to determine direction of travel
     * @return {Boolean}
     */
    isDatePossible(element, delta) {
      const cellId = element.getAttribute('data-id')
      const cellDate = new Date(this.cells[cellId].timestamp)

      if (delta > 0) {
        return (
          cellDate >
          this.utils.adjustDateToView(this.latestPossibleDate, this.view)
        )
      }

      return (
        cellDate <
        this.utils.adjustDateToView(this.earliestPossibleDate, this.view)
      )
    },
    /**
     * Returns true if the given element cannot be focused
     * @param  {HTMLButtonElement} element The element in question
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
    // eslint-disable-next-line max-statements
    setFocusOnNewPage({ delta, stepsRemaining }) {
      const currentElement = this.getFirstOrLastElement(delta)
      const options = {
        currentElement,
        delta,
        stepsRemaining,
      }
      const delay = this.slideDuration

      if (stepsRemaining <= 0) {
        if (this.isMutedOrDisabled(currentElement)) {
          options.stepsRemaining = Math.abs(options.delta)

          setTimeout(() => {
            this.setFocusToAvailableCell(options)
          }, delay)

          return
        }

        setTimeout(() => {
          currentElement.focus()
        }, delay)

        return
      }

      setTimeout(() => {
        this.setFocusToAvailableCell(options)
      }, delay)
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
  },
}
</script>
