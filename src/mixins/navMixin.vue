<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Cell, Focus, FocusRefs, SlotName, View } from '../../typings'
import DateUtils from '../utils/DateUtils'

@Component
export default class navMixin extends Vue {
  allElements: Element[] = []

  focus: Focus = {
    delay: 0,
    refs: [],
  }

  inlineTabbableCell: HTMLButtonElement | null = null

  isActive: boolean = false

  isRevertingToOpenDate: boolean = false

  latestValidTypedDate: Date | null

  navElements: Element[] = []

  navElementsFocusedIndex: number = 0

  pageTimestamp: number

  resetTabbableCell: boolean = false

  slideDuration: number

  tabbableCell: HTMLButtonElement | null = null

  transitionName: 'slide-left' | 'slide-right' = 'slide-left'

  utils: DateUtils

  view: View

  get computedOpenDate(): Date {
    return new Date()
  }

  get datepickerId(): string {
    return ''
  }

  get fallbackElementsToFocus() {
    const elements: Array<FocusRefs> = ['tabbableCell', 'prev', 'next']

    if (this.$props.typeable) {
      elements.unshift('input')
    }

    return elements
  }

  get focusedDate() {
    const pageDate = new Date(this.pageTimestamp)

    if (this.hasClass(this.tabbableCell!, 'day')) {
      const focusedDate = +this.tabbableCell!.innerHTML.trim()

      return new Date(this.utils.setDate(pageDate, focusedDate))
    }

    if (this.hasClass(this.tabbableCell!, 'month')) {
      return new Date(this.utils.setMonth(pageDate, this.tabbableCellId!))
    }

    const fullYear = this.utils.getFullYear(pageDate) - 1
    return new Date(
      this.utils.setFullYear(pageDate, fullYear + this.tabbableCellId!),
    )
  }

  get isMinimumView(): boolean {
    return true
  }

  get isOpen(): boolean {
    return false
  }

  get isRtl(): boolean {
    return false
  }

  get tabbableCellId() {
    return (
      this.tabbableCell && Number(this.tabbableCell.getAttribute('data-id'))
    )
  }

  /**
   * Converts a date to first in month for `month` view or first in year for `year` view
   * @param date The date to convert
   */
  getCellDate(date: Date) {
    switch (this.view) {
      case 'month':
        return new Date(this.utils.setDate(date, 1))
      case 'year':
        return new Date(
          this.utils.setMonth(new Date(this.utils.setDate(date, 1)), 0),
        )
      default:
        return date
    }
  }

  /**
   * Returns true, unless tabbing should be focus-trapped
   */
  allowNormalTabbing(event: KeyboardEvent) {
    if (!this.isOpen) {
      return true
    }

    return this.isTabbingAwayFromInlineDatepicker(event)
  }

  /**
   * Focuses the first non-disabled element found in the `focus.refs` array and sets `navElementsFocusedIndex`
   */
  applyFocus() {
    const focusRefs: Array<FocusRefs> = [
      ...this.focus.refs,
      ...this.fallbackElementsToFocus,
    ]

    for (let i = 0; i < focusRefs.length; i += 1) {
      const element = this.getElementByRef(focusRefs[i])

      if (element && !element.getAttribute('disabled')) {
        element.focus()
        this.setNavElementsFocusedIndex()
        break
      }
    }

    this.focus.delay = 0
  }

  /**
   * Ensures the most recently focused tabbable cell is focused when tabbing backwards to an inline calendar
   * If no element has previously been focused, the tabbable cell is reset and focused
   */
  focusInlineTabbableCell() {
    if (this.inlineTabbableCell) {
      this.inlineTabbableCell.focus()

      return
    }

    if (this.tabbableCell) {
      this.resetTabbableCell = true
      this.setTabbableCell()
      this.tabbableCell.focus()
      this.resetTabbableCell = false
    }
  }

  /**
   * Returns the currently focused cell element, if there is one...
   */
  getActiveCell() {
    const { activeElement } = document
    if (!activeElement) {
      return null
    }
    const isActiveElementACell = this.hasClass(activeElement, 'cell')
    const isOnSameView = this.hasClass(activeElement, this.view)

    if (isActiveElementACell && isOnSameView && !this.resetTabbableCell) {
      return document.activeElement as HTMLButtonElement
    }

    return null
  }

  /**
   * Returns the `cellId` for a given a date
   * @param date The date for which we need the cellId
   */
  getCellId(date: Date | null) {
    const picker = this.$refs.picker as Vue
    const pickerCells = picker.$refs.cells as Vue

    if (!date || !pickerCells) {
      return null
    }

    const cellDate = this.getCellDate(date)
    const cells = (pickerCells as any).cells as Cell[]

    for (let i = 0; i < cells.length; i += 1) {
      if (cells[i].timestamp === cellDate.valueOf()) {
        return i
      }
    }

    return null
  }

  /**
   * Finds an element by its `ref` attribute
   * @param ref The `ref` name of the wanted element
   */
  // eslint-disable-next-line complexity,max-statements
  getElementByRef(ref: FocusRefs): HTMLElement | null {
    if (ref === 'tabbableCell') {
      return this.tabbableCell
    }
    if (ref === 'input') {
      const dateInput = this.$refs.dateInput as Vue

      if (!dateInput) {
        return null
      }

      const inputEl = dateInput.$refs[this.$props.refName] as Vue

      return inputEl.$el as HTMLInputElement
    }
    if (ref === 'calendarButton') {
      const dateInput = this.$refs.dateInput as Vue
      const calendarButton = dateInput.$refs.calendarButton as Vue

      return calendarButton.$el as HTMLButtonElement
    }
    if (ref === 'openDate') {
      const picker = this.$refs.picker as Vue
      const pickerCells = picker.$refs.cells as Vue

      return pickerCells.$refs.openDate as HTMLButtonElement
    }
    if (this.$props.showHeader) {
      const picker = this.$refs.picker as Vue
      if (!picker) {
        return null
      }

      if (ref === 'up') {
        const up = picker.$refs.up as Vue

        return up.$el as HTMLButtonElement
      }

      const pickerHeader = picker.$refs.pickerHeader as Vue

      return pickerHeader!.$refs[ref] as HTMLButtonElement
    }
    return null
  }

  /**
   * Returns an array of all HTML elements which should be focus-trapped in the calendarFooter slot
   */
  getElementsFromCalendarFooter(): Element[] {
    const footerSlotIndex = this.hasSlot('beforeCalendarHeader') ? 2 : 1
    const view = this.$refs.view as HTMLElement

    return this.getFocusableElements(view.children[footerSlotIndex])
  }

  /**
   * Returns an array of all HTML elements which should be focus-trapped in the specified slot
   */
  // eslint-disable-next-line max-statements
  getElementsFromSlot(slotName: SlotName): Element[] {
    if (!this.hasSlot(slotName)) {
      return []
    }

    if (slotName === 'beforeCalendarHeader') {
      const view = this.$refs.view as HTMLElement

      return this.getFocusableElements(view.children[0])
    }

    if (slotName === 'calendarFooter') {
      return this.getElementsFromCalendarFooter()
    }

    const isBeforeHeader = slotName.indexOf('beforeCalendarHeader') > -1
    const picker = this.$refs.picker as Vue
    const index = isBeforeHeader ? 0 : picker.$el.children.length - 1

    return this.getFocusableElements(picker.$el.children[index])
  }

  /**
   * Returns an array of all HTML elements which should be focus-trapped in the header
   */
  getElementsFromHeader(): Element[] {
    const view = this.ucFirst(this.view)
    const beforeCalendarSlotName = `beforeCalendarHeader${view}`
    const picker = this.$refs.picker as Vue
    const index = this.hasSlot(beforeCalendarSlotName) ? 1 : 0
    const fragment = picker.$el.children[index]

    return this.$props.showHeader ? this.getFocusableElements(fragment) : []
  }

  /**
   * Returns an array of focusable elements in a given HTML fragment
   * @param fragment The HTML fragment to search
   */
  getFocusableElements(fragment: Element): Element[] {
    const navNodeList = fragment.querySelectorAll(
      'button:enabled, [href], input:not([type=hidden]), select:enabled, textarea:enabled, [tabindex]:not([tabindex="-1"])',
    )

    return [...Array.prototype.slice.call(navNodeList)]
  }

  /**
   * Returns the input element (when typeable)
   */
  getInputField(): HTMLInputElement | null {
    if (!this.$props.typeable || this.$props.inline) {
      return null
    }

    const dateInput = this.$refs.dateInput as Vue
    const inputRef = dateInput.$refs[this.$props.refName] as Vue

    return inputRef.$el as HTMLInputElement
  }

  /**
   * Used for a typeable datepicker: returns the cell element that corresponds to latestValidTypedDate...
   */
  getTypedCell() {
    if (!this.$props.typeable) {
      return null
    }

    const cellId = this.getCellId(this.latestValidTypedDate)

    if (!cellId) {
      return null
    }

    const picker = this.$refs.picker as Vue
    const pickerCells = picker.$refs.cells as Vue

    return pickerCells.$el.children[cellId] as HTMLButtonElement
  }

  /**
   * Sets `datepickerId` (as a global) and keeps track of focusable elements
   */
  handleFocusIn() {
    Vue.prototype.datepickerId = this.datepickerId

    this.isActive = true
    this.setInlineTabbableCell()
    this.setAllElements()
    this.setNavElements()
  }

  /**
   * Sets the datepicker's `isActive` state to false
   */
  handleFocusOut() {
    this.isActive = false
  }

  /**
   * Returns true if the user has arrowed to a new page
   */
  hasArrowedToNewPage() {
    return this.focus.refs && this.focus.refs[0] === 'arrow-to-cell'
  }

  hasClass(_element: Element, _className: string) {
    return false
  }

  /**
   * Returns true if the calendar has been passed the given slot
   * @param slotName The name of the slot
   */
  hasSlot(slotName: SlotName) {
    return !!this.$slots[slotName]
  }

  /**
   * Returns true if the user is tabbing away from an inline datepicker
   */
  isTabbingAwayFromInlineDatepicker(event: KeyboardEvent) {
    if (!this.$props.inline) {
      return false
    }

    if (this.isTabbingAwayFromFirstNavElement(event)) {
      this.tabAwayFromFirstElement()

      return true
    }

    if (this.isTabbingAwayFromLastNavElement(event)) {
      this.tabAwayFromLastElement()

      return true
    }

    return false
  }

  /**
   * Used for inline calendars; returns true if the user tabs backwards from the first focusable element
   * @param event Used to determine whether we are tabbing forwards or backwards
   */
  isTabbingAwayFromFirstNavElement(event: KeyboardEvent) {
    if (!event.shiftKey) {
      return false
    }

    const firstNavElement = this.navElements[0]

    return document.activeElement === firstNavElement
  }

  /**
   * Used for inline calendars; returns true if the user tabs forwards from the last focusable element
   * @param event Used to determine whether we are tabbing forwards or backwards
   */
  isTabbingAwayFromLastNavElement(event: KeyboardEvent) {
    if (event.shiftKey) {
      return false
    }

    const lastNavElement = this.navElements[this.navElements.length - 1]

    return document.activeElement === lastNavElement
  }

  /**
   * Resets the focus to the open date
   */
  resetFocusToOpenDate() {
    this.focus.refs = ['openDate']
    this.setTransitionAndFocusDelay(this.focusedDate, this.computedOpenDate)

    if (!this.isMinimumView) {
      this.isRevertingToOpenDate = true
      this.view = this.$props.minimumView
    }

    this.setPageDate(this.computedOpenDate)
    this.reviewFocus()
  }

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
  }

  /**
   * Stores the current tabbableCell of an inline datepicker
   * N.B. This is used when tabbing back (shift + tab) to an inline calendar from further down the page
   */
  setInlineTabbableCell() {
    if (!this.$props.inline) {
      return
    }

    this.inlineTabbableCell = this.tabbableCell
  }

  /**
   * Sets the direction of the slide transition and determines whether to delay application of the focus
   * @param startDate The date from which to measure
   * @param endDate   Is this before or after the startDate? And is it on the same page?
   */
  setTransitionAndFocusDelay(startDate: Date, endDate: Date) {
    const startPageDate = this.utils.setDate(new Date(startDate), 1)
    const endPageDate = this.utils.setDate(new Date(endDate), 1)
    const isInTheFuture = startPageDate < endPageDate

    if (this.isMinimumView) {
      this.focus.delay = isInTheFuture ? this.slideDuration : 0
    } else {
      this.focus.delay = 0
    }

    this.setTransitionName(endDate.valueOf() - startDate.valueOf())
  }

  /**
   * Records all focusable elements (so that we know whether any element in the datepicker is focused)
   */
  setAllElements() {
    const datepicker = this.$refs.datepicker as Vue

    this.allElements = this.getFocusableElements(datepicker.$el)

    if (this.$props.appendToBody) {
      const popup = this.$refs.popup as Vue

      this.allElements = this.allElements.concat(
        this.getFocusableElements(popup.$el),
      )
    }
  }

  /**
   * Set the focus
   * @param refs An array of `refs` to focus (in order of preference)
   */
  setFocus(refs: Array<FocusRefs>) {
    this.focus.refs = refs
    this.applyFocus()
  }

  setPageDate(_date?: Date): void {
    return undefined
  }

  /**
   * Determines which elements in datepicker should be focus-trapped
   */
  setNavElements() {
    if (!this.view) return

    this.updateTabbableCell()

    const view = this.ucFirst(this.view)

    this.navElements = [
      this.getElementsFromSlot('beforeDateInput'),
      this.getInputField(),
      this.getElementsFromSlot('afterDateInput'),
      this.getElementsFromSlot('beforeCalendarHeader'),
      this.getElementsFromSlot(`beforeCalendarHeader${view}`),
      this.getElementsFromHeader(),
      this.tabbableCell,
      this.getElementsFromSlot(`calendarFooter${view}`),
      this.getElementsFromSlot('calendarFooter'),
    ]
      .filter((item) => !!item)
      // @ts-ignore
      .reduce((acc: Element[], val) => acc!.concat(val), [])
  }

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
  }

  /**
   * Sets the focus-trapped cell in the picker
   */
  // eslint-disable-next-line complexity
  setTabbableCell() {
    const picker = this.$refs.picker as Vue
    const pickerCells = picker.$refs.cells as Vue

    if (!picker || !pickerCells) {
      return
    }

    const cells = pickerCells.$el

    this.tabbableCell =
      this.getActiveCell() ||
      this.getTypedCell() ||
      cells.querySelector('button.selected:not(.muted):enabled') ||
      cells.querySelector('button.open:not(.muted):enabled') ||
      cells.querySelector('button.today:not(.muted):enabled') ||
      cells.querySelector('button.cell:not(.muted):enabled')
  }

  /**
   * Sets the direction of the slide transition
   * @param plusOrMinus Positive for the future; negative for the past
   */
  setTransitionName(plusOrMinus: number) {
    const isInTheFuture = plusOrMinus > 0

    if (this.isRtl) {
      this.transitionName = isInTheFuture ? 'slide-left' : 'slide-right'
    } else {
      this.transitionName = isInTheFuture ? 'slide-right' : 'slide-left'
    }
  }

  /**
   * Focuses the first focusable element in the datepicker, so that the previous element on the page will be tabbed to
   */
  tabAwayFromFirstElement() {
    const firstElement = this.allElements[0] as HTMLElement

    firstElement.focus()

    this.tabbableCell = this.inlineTabbableCell
  }

  /**
   * Focuses the last focusable element in the datepicker, so that the next element on the page will be tabbed to
   */
  tabAwayFromLastElement() {
    const lastElement = this.allElements[
      this.allElements.length - 1
    ] as HTMLElement

    lastElement.focus()

    this.tabbableCell = this.inlineTabbableCell
  }

  /**
   * Tab backwards through the focus-trapped elements
   */
  tabBackwards() {
    this.navElementsFocusedIndex -= 1

    if (this.navElementsFocusedIndex < 0) {
      this.navElementsFocusedIndex = this.navElements.length - 1
    }

    ;(this.navElements[this.navElementsFocusedIndex] as HTMLElement).focus()
  }

  /**
   * Tab forwards through the focus-trapped elements
   */
  tabForwards() {
    this.navElementsFocusedIndex += 1

    if (this.navElementsFocusedIndex >= this.navElements.length) {
      this.navElementsFocusedIndex = 0
    }

    ;(this.navElements[this.navElementsFocusedIndex] as HTMLElement).focus()
  }

  /**
   * Tab through the focus-trapped elements
   */
  tabThroughNavigation(event: KeyboardEvent) {
    if (this.allowNormalTabbing(event)) {
      return
    }

    event.preventDefault()

    if (event.shiftKey) {
      this.tabBackwards()
    } else {
      this.tabForwards()
    }
  }

  /**
   * Special cases for when tabbing to an inline datepicker
   */
  tabToCorrectInlineCell() {
    const lastElement = this.allElements[this.allElements.length - 1]
    const isACell = this.hasClass(lastElement, 'cell')
    const isLastElementFocused = document.activeElement === lastElement

    // If there are no focusable elements in the footer slots and the inline datepicker has been tabbed to (backwards)
    if (isACell && isLastElementFocused) {
      this.focusInlineTabbableCell()
      return
    }

    // If `show-header` is false and the inline datepicker has been tabbed to (forwards)
    this.$nextTick(() => {
      const isFirstCell =
        document.activeElement!.getAttribute('data-id') === '0'

      if (isFirstCell) {
        this.focusInlineTabbableCell()
      }
    })
  }

  ucFirst(_str: string) {
    return ''
  }

  /**
   * Update which cell in the picker should be focus-trapped
   */
  updateTabbableCell() {
    const isActiveElementACell = this.hasClass(document.activeElement!, 'cell')
    const needToUpdate = !this.tabbableCell || isActiveElementACell

    if (needToUpdate) {
      this.setTabbableCell()
    }
  }
}
</script>
