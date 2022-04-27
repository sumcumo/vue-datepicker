<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PickerHeader from '../components/PickerHeader.vue'
import {
  ArrowOptions,
  DayCell,
  DisabledDates,
  IncrementPageOptions,
  MonthCell,
  Translation,
  View,
  YearCell,
} from '../../typings'
import DateUtils from '../utils/DateUtils'
import DisabledDate from '../utils/DisabledDate'

@Component({
  components: { PickerHeader },
  inheritAttrs: false,
})
export default class pickerMixin extends Vue {
  @Prop({ default: false }) bootstrapStyling: boolean

  @Prop() disabledDates: DisabledDates

  @Prop({ default: false }) isRtl: boolean

  @Prop({ default: false }) isTypeable: boolean

  @Prop({ default: false }) isUpDisabled: boolean

  @Prop({ default: true }) isMinimumView: boolean

  @Prop({ default: null }) openDate: Date

  @Prop() pageDate: Date

  @Prop({ default: null }) selectedDate: Date | null

  @Prop({ default: true }) showHeader: boolean

  @Prop({ default: 250 }) slideDuration: number

  @Prop({ default: null }) tabbableCellId: Number | null

  @Prop({ default: '' }) transitionName: string

  @Prop() translation: Translation

  @Prop({ default: false }) useUtc: boolean

  @Prop({ default: 'day' }) view: View

  utils = new DateUtils(this.$props.useUtc)

  yearRange: number

  get cells(): DayCell[] | MonthCell[] | YearCell[] {
    return []
  }

  /**
   * A look-up object created from 'disabledDates' prop
   */
  get disabledConfig() {
    return new DisabledDate(this.useUtc, this.disabledDates).config
  }

  get earliestPossibleDate() {
    return new DisabledDate(
      this.useUtc,
      this.disabledDates,
    ).getEarliestPossibleDate(this.disabledDates.to)
  }

  get isNextDisabled() {
    return false
  }

  get isPreviousDisabled() {
    return false
  }

  get latestPossibleDate() {
    return new DisabledDate(
      this.useUtc,
      this.disabledDates,
    ).getLatestPossibleDate(this.disabledDates.from)
  }

  /**
   * Returns the current page's full year as an integer.
   */
  get pageYear() {
    return this.utils.getFullYear(this.pageDate)
  }

  /**
   * Used when an arrow key press would cause the focus to land on a disabled date
   */
  addMoreSteps(options: ArrowOptions) {
    if (options.stepsRemaining <= 0 && Math.abs(options.delta) > 1) {
      return Math.abs(options.delta)
    }
    return options.stepsRemaining
  }

  /**
   * Changes the page up or down
   */
  changePage(incrementPageOptions: IncrementPageOptions) {
    const { incrementBy, focusRefs } = incrementPageOptions
    const { pageDate, utils } = this
    const units =
      this.view === 'year' ? incrementBy * this.yearRange : incrementBy

    this.$emit('set-transition-name', incrementBy)

    if (this.view === 'day') {
      utils.setMonth(pageDate, utils.getMonth(pageDate) + units)
    } else {
      utils.setFullYear(pageDate, utils.getFullYear(pageDate) + units)
    }

    this.$emit('page-change', { focusRefs, pageDate })
  }

  /**
   * Changes the page and focuses the cell that is being 'arrowed' to
   */
  changePageAndSetFocus(delta: -1 | 1, stepsRemaining: number) {
    const isPageDisabled =
      (delta > 0 && this.isNextDisabled) ||
      (delta < 0 && this.isPreviousDisabled)

    if (isPageDisabled) {
      return
    }

    this.changePage({
      incrementBy: Math.sign(delta) as -1 | 1,
      focusRefs: ['arrow-to-cell'],
    })

    this.$nextTick(() => {
      this.setFocusOnNewPage(delta, stepsRemaining)
    })
  }

  /**
   * Focuses the input field, if typeable
   */
  focusInput() {
    if (this.isTypeable) {
      this.$emit('set-focus', ['input'])
    }
  }

  /**
   * Returns the element that should be focused when navigating via an arrow key
   */
  // eslint-disable-next-line complexity,max-statements
  getElement(initialOptions: ArrowOptions): HTMLButtonElement | null | void {
    const { currentElement, delta, stepsRemaining } = initialOptions
    const element = this.getElementSibling(currentElement, delta)

    if (!element) {
      return this.changePageAndSetFocus(delta, stepsRemaining - 1)
    }

    const options: ArrowOptions = {
      currentElement: element,
      delta,
      stepsRemaining: stepsRemaining - 1,
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
  }

  /**
   * Returns the element directly next to the currentElement
   * @param  currentElement The element currently being iterated on
   * @param  delta          The number of cells that the focus should move
   */
  getElementSibling(
    currentElement: HTMLButtonElement,
    delta: number,
  ): HTMLButtonElement | null {
    const isNext = delta > 0

    return isNext
      ? (currentElement.nextElementSibling as HTMLButtonElement)
      : (currentElement.previousElementSibling as HTMLButtonElement)
  }

  /**
   * Returns the first or last cell, depending on the direction of the search
   * @param  delta  The number of cells that the focus should move
   */
  getFirstOrLastElement(delta: number): Element {
    const isNext = delta > 0
    const elements = (this.$refs.cells as Vue).$el.children

    return isNext ? elements[0] : elements[elements.length - 1]
  }

  /**
   * Returns the first or last non-disabled date, depending on the direction of the search
   */
  firstOrLastPossibleDate(options: ArrowOptions) {
    const { currentElement, delta } = options
    if (delta > 0) {
      return this.getElementSibling(currentElement, -1)
    }

    return this.getElementSibling(currentElement, 1)
  }

  /**
   * Moves the focused cell up/down/left/right
   */
  handleArrow(options: ArrowOptions) {
    const { delta } = options
    const stepsRemaining = Math.abs(delta)
    const updatedOptions = {
      currentElement: document.activeElement as HTMLButtonElement,
      delta,
      stepsRemaining,
    }

    this.setFocusToAvailableCell(updatedOptions)
  }

  /**
   * Determines which transition to use (for edge dates) and emits a 'select' event
   */
  select(cell: DayCell | MonthCell | YearCell) {
    if (cell.type === 'day') {
      if (cell.isPreviousMonth) {
        this.$emit('set-transition-name', -1)
      }

      if (cell.isNextMonth) {
        this.$emit('set-transition-name', 1)
      }
    }

    this.$emit('select', cell)
  }

  /**
   * Returns true if the given element cannot be focused
   */
  isBeyondPossibleDate(options: ArrowOptions) {
    const { currentElement, delta } = options

    if (delta > 0 && this.latestPossibleDate) {
      return this.isDatePossible(currentElement, delta)
    }

    if (delta < 0 && this.earliestPossibleDate) {
      return this.isDatePossible(currentElement, delta)
    }

    return false
  }

  /**
   * Returns true if the current element's date is NOT possible, given the `disabled-dates`
   * @param  element The element in question
   * @param  delta   Used to determine direction of travel
   */
  isDatePossible(element: HTMLButtonElement, delta: number) {
    const cellId = +element.getAttribute('data-id')!
    const cellDate = new Date(this.cells[cellId].timestamp)

    if (delta > 0) {
      return cellDate > this.latestPossibleDate
    }

    return cellDate < this.earliestPossibleDate
  }

  /**
   * Returns true if the given element cannot be focused
   * @param  element The element in question
   */
  isMutedOrDisabled(element: HTMLButtonElement) {
    const isMuted = element.classList.value.split(' ').includes('muted')
    const isDisabled = element.disabled

    return isMuted || isDisabled
  }

  /**
   * Sets the focus on the correct cell following a page change
   */
  // eslint-disable-next-line max-statements
  setFocusOnNewPage(delta: -1 | 1, stepsRemaining: number) {
    const currentElement = this.getFirstOrLastElement(
      delta,
    ) as HTMLButtonElement
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
  }

  /**
   * Sets the focus on the next focusable cell when an arrow key is pressed
   */
  setFocusToAvailableCell(options: ArrowOptions) {
    const element = this.getElement(options)

    if (element) {
      element.focus()
    }
  }
}
</script>
