<script>
export default {
  data() {
    return {
      allElements: [],
      focus: {
        delay: 0,
        refs: [],
      },
      navElements: [],
      navElementsFocusedIndex: 0,
      tabbableCell: null,
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
     * Sets the correct focus on next tick
     */
    reviewFocus() {
      if (this.hasArrowedToNewPage()) {
        return
      }

      this.$nextTick(() => {
        this.setTabbableCell()
        this.setNavElements()

        setTimeout(() => {
          this.applyFocus()
        }, this.focus.delay)
      })
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
        pickerCells.querySelector('button.selected:not(.muted):enabled') ||
        pickerCells.querySelector('button.open:not(.muted):enabled') ||
        pickerCells.querySelector('button.today:not(.muted):enabled') ||
        pickerCells.querySelector('button.cell:not(.muted):enabled')
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
  },
}
</script>
