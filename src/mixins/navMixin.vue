<script>
export default {
  data() {
    return {
      allElements: [],
      focus: {
        delay: 0,
        refs: [],
      },
      isRevertingToOpenDate: false,
      navElements: [],
      navElementsFocusedIndex: 0,
      resetTabbableCell: false,
      tabbableCell: null,
      transitionName: '',
    }
  },
  computed: {
    tabbableCellId() {
      return (
        this.tabbableCell && Number(this.tabbableCell.getAttribute('data-id'))
      )
    },
    fallbackElementToFocus() {
      return this.typeable ? 'input' : 'tabbableCell'
    },
    focusedDateTimestamp() {
      const pageDate = new Date(this.pageTimestamp)

      if (this.hasClass(this.tabbableCell, 'day')) {
        return this.utils.setDate(pageDate, this.tabbableCell.innerHTML.trim())
      }

      if (this.hasClass(this.tabbableCell, 'month')) {
        return this.utils.setMonth(pageDate, this.tabbableCellId)
      }

      const fullYear = this.utils.getFullYear(pageDate) - 1
      return this.utils.setFullYear(pageDate, fullYear + this.tabbableCellId)
    },
  },
  methods: {
    /**
     * Focuses the first non-disabled element found in the `focus.refs` array and sets `navElementsFocusedIndex`
     */
    applyFocus() {
      const focusRefs = [...this.focus.refs, this.fallbackElementToFocus]

      for (let i = 0; i < focusRefs.length; i += 1) {
        const element = this.getElementByRef(focusRefs[i])

        if (element && !element.getAttribute('disabled')) {
          element.focus()
          this.setNavElementsFocusedIndex()
          break
        }
      }
    },
    /**
     * Returns the currently focused cell element, if there is one...
     */
    getActiveCell() {
      const isActiveElementACell = this.hasClass(document.activeElement, 'cell')
      const isOnSameView = this.hasClass(document.activeElement, this.view)

      if (isActiveElementACell && isOnSameView && !this.resetTabbableCell) {
        return document.activeElement
      }

      return null
    },
    /**
     * Returns true if the calendar has been passed the given slot
     * @param  {String} slotName The name of the slot
     * @return {Boolean}
     */
    hasSlot(slotName) {
      return !!this.$slots[slotName]
    },
    /**
     * Finds an element by its `ref` attribute
     * @param {string} ref        The `ref` name of the wanted element
     * @returns {HTMLElement|Vue} A Vue element
     */
    // eslint-disable-next-line complexity,max-statements
    getElementByRef(ref) {
      if (ref === 'tabbableCell') {
        return this.tabbableCell
      }
      if (ref === 'input') {
        return this.$refs.dateInput && this.$refs.dateInput.$refs[this.refName]
      }
      if (ref === 'calendarButton') {
        return this.$refs.dateInput.$refs.calendarButton
      }
      if (ref === 'openDate') {
        return this.$refs.picker.$refs.cells.$refs.openDate[0]
      }
      if (this.showHeader) {
        if (ref === 'up') {
          return this.$refs.picker && this.$refs.picker.$refs.up.$el
        }
        return (
          this.$refs.picker &&
          this.$refs.picker.$refs.pickerHeader &&
          this.$refs.picker.$refs.pickerHeader.$refs[ref]
        )
      }
      return null
    },
    /**
     * Returns an array of all HTML elements which should be focus-trapped in the specified slot
     * @returns {Array}   An array of HTML elements
     */
    getElementsFromSlot(slotName) {
      if (!this.hasSlot(slotName)) {
        return []
      }

      if (slotName === 'beforeCalendarHeader') {
        return this.getFocusableElements(this.$refs.view.children[0])
      }

      if (slotName === 'calendarFooter') {
        return this.getFocusableElements(this.$refs.view.children[2])
      }

      const isBeforeHeader = slotName.indexOf('beforeCalendarHeader') > -1
      const picker = this.$refs.picker.$el
      const index = isBeforeHeader ? 0 : picker.children.length - 1

      return this.getFocusableElements(picker.children[index])
    },
    /**
     * Returns an array of all HTML elements which should be focus-trapped in the header
     * @returns {Array}   An array of HTML elements
     */
    getElementsFromHeader() {
      const view = this.ucFirst(this.view)
      const beforeCalendarSlotName = `beforeCalendarHeader${view}`
      const picker = this.$refs.picker.$el
      const index = this.hasSlot(beforeCalendarSlotName) ? 1 : 0
      const fragment = picker.children[index]

      return this.showHeader ? this.getFocusableElements(fragment) : []
    },
    /**
     * Returns an array of focusable elements in a given HTML fragment
     * @param   {Element} fragment The HTML fragment to search
     * @returns {Array}
     */
    getFocusableElements(fragment) {
      const navNodeList = fragment.querySelectorAll(
        'button:enabled, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      return [...Array.prototype.slice.call(navNodeList)]
    },
    /**
     * Returns the input element (when typeable)
     * @returns {Element}
     */
    getInputField() {
      if (!this.typeable || this.inline) {
        return null
      }

      return this.$refs.dateInput.$refs[this.refName]
    },
    /**
     * Sets `datepickerId` (as a global) and keeps track of focusable elements
     */
    handleFocusChange() {
      document.datepickerId = this.datepickerId

      this.setAllElements()
      this.setNavElements()

      if (this.inline) {
        this.setTabbableCell()
      }
    },
    /**
     * Returns true if the user has arrowed to a new page
     * @return {Boolean}
     */
    hasArrowedToNewPage() {
      return this.focus.refs && this.focus.refs[0] === 'arrow-to-cell'
    },
    /**
     * Resets the focus to the open date
     */
    resetFocusToOpenDate() {
      this.focus.refs = ['openDate']
      this.setTransitionAndFocusDelay(
        this.focusedDateTimestamp,
        this.computedOpenDate,
      )

      if (!this.isMinimumView) {
        this.isRevertingToOpenDate = true
        this.view = this.minimumView
      }

      this.setTabbableCell()
      this.reviewFocus()
      this.selectedDate = null
      this.setPageDate()
    },
    /**
     * Sets the correct focus on next tick
     */
    reviewFocus() {
      if (this.hasArrowedToNewPage()) {
        return
      }

      this.tabbableCell = null
      this.resetTabbableCell = true

      this.$nextTick(() => {
        this.setNavElements()

        setTimeout(() => {
          this.applyFocus()
        }, this.focus.delay)

        this.resetTabbableCell = false
      })
    },
    /**
     * Sets the direction of the slide transition and whether or not to delay application of the focus
     * @param {Date|Number} startDate     The date from which to measure
     * @param {Date|Number} endDate       Is this before or after the startDate? And is it on the same page?
     */
    setTransitionAndFocusDelay(startDate, endDate) {
      const startPageDate = this.utils.setDate(new Date(startDate), 1)
      const endPageDate = this.utils.setDate(new Date(endDate), 1)
      const isInTheFuture = startPageDate < endPageDate

      if (this.isMinimumView) {
        this.focus.delay = isInTheFuture ? this.slideDuration : 0
      } else {
        this.focus.delay = 0
      }

      this.setTransitionName(endDate - startDate)
    },
    /**
     * Records all focusable elements (so that we know whether any element in the datepicker is focused)
     */
    setAllElements() {
      this.allElements = this.getFocusableElements(this.$refs.datepicker)
    },
    /**
     * Set the focus
     * @param {Array} refs An array of `refs` to focus (in order of preference)
     */
    setFocus(refs) {
      this.focus.refs = refs
      this.applyFocus()
    },
    /**
     * Determines which elements in datepicker should be focus-trapped
     */
    setNavElements() {
      if (!this.view) return

      this.updateTabbableCell()

      const view = this.ucFirst(this.view)

      this.navElements = [
        this.getInputField(),
        this.getElementsFromSlot('beforeCalendarHeader'),
        this.getElementsFromSlot(`beforeCalendarHeader${view}`),
        this.getElementsFromHeader(),
        this.tabbableCell,
        this.getElementsFromSlot(`calendarFooter${view}`),
        this.getElementsFromSlot('calendarFooter'),
      ]
        .filter((item) => !!item)
        .reduce((acc, val) => acc.concat(val), [])
    },
    /**
     * Keeps track of the currently focused index in the navElements array
     */
    setNavElementsFocusedIndex() {
      for (let i = 0; i < this.navElements.length; i += 1) {
        if (document.activeElement === this.navElements[i]) {
          this.navElementsFocusedIndex = i
          return
        }
      }

      this.navElementsFocusedIndex = 0
    },
    /**
     * Sets the focus-trapped cell in the picker
     */
    // eslint-disable-next-line complexity
    setTabbableCell() {
      if (!this.$refs.picker || !this.$refs.picker.$refs.cells) {
        return
      }

      const pickerCells = this.$refs.picker.$refs.cells.$el

      this.tabbableCell =
        this.getActiveCell() ||
        pickerCells.querySelector('button.selected:not(.muted):enabled') ||
        pickerCells.querySelector('button.open:not(.muted):enabled') ||
        pickerCells.querySelector('button.today:not(.muted):enabled') ||
        pickerCells.querySelector('button.cell:not(.muted):enabled')
    },
    /**
     * Sets the direction of the slide transition
     * @param {Number} plusOrMinus Positive for the future; negative for the past
     */
    setTransitionName(plusOrMinus) {
      const isInTheFuture = plusOrMinus > 0

      if (this.isRtl) {
        this.transitionName = isInTheFuture ? 'slide-left' : 'slide-right'
      } else {
        this.transitionName = isInTheFuture ? 'slide-right' : 'slide-left'
      }
    },
    /**
     * Tab backwards through the focus-trapped elements
     */
    tabBackwards() {
      this.navElementsFocusedIndex -= 1

      if (this.navElementsFocusedIndex < 0) {
        this.navElementsFocusedIndex = this.navElements.length - 1
      }

      this.navElements[this.navElementsFocusedIndex].focus()
    },
    /**
     * Tab forwards through the focus-trapped elements
     */
    tabForwards() {
      this.navElementsFocusedIndex += 1

      if (this.navElementsFocusedIndex >= this.navElements.length) {
        this.navElementsFocusedIndex = 0
      }

      this.navElements[this.navElementsFocusedIndex].focus()
    },
    /**
     * Tab through the focus-trapped elements
     * @param event
     */
    tabThroughNavigation(event) {
      // Allow normal tabbing when closed
      if (!this.isOpen) {
        return
      }
      event.preventDefault()

      if (event.shiftKey) {
        this.tabBackwards()
      } else {
        this.tabForwards()
      }
    },
    /**
     * Update which cell in the picker should be focus-trapped
     */
    updateTabbableCell() {
      const isActiveElementACell = this.hasClass(document.activeElement, 'cell')
      const needToUpdate = !this.tabbableCell || isActiveElementACell

      if (needToUpdate) {
        this.setTabbableCell()
      }
    },
  },
}
</script>
