<template>
  <div
    :id="datepickerId"
    ref="datepicker"
    class="vdp-datepicker"
    :class="[wrapperClass, { rtl: isRtl }]"
    @focusin="handleFocusIn($event)"
    @focusout="handleFocusOut($event)"
    @keydown.esc="resetOrClose"
    @keydown.tab="tabThroughNavigation($event)"
  >
    <DateInput
      :id="id"
      ref="dateInput"
      :autofocus="autofocus"
      :bootstrap-styling="bootstrapStyling"
      :calendar-button="calendarButton"
      :calendar-button-icon="calendarButtonIcon"
      :calendar-button-icon-content="calendarButtonIconContent"
      :clear-button="clearButton"
      :clear-button-icon="clearButtonIcon"
      :disabled="disabled"
      :format="format"
      :inline="inline"
      :input-class="inputClass"
      :is-open="isOpen"
      :maxlength="maxlength"
      :name="name"
      :parser="parser"
      :pattern="pattern"
      :placeholder="placeholder"
      :ref-name="refName"
      :required="required"
      :selected-date="selectedDate"
      :show-calendar-on-button-click="showCalendarOnButtonClick"
      :show-calendar-on-focus="showCalendarOnFocus"
      :tabindex="tabindex"
      :translation="translation"
      :typeable="typeable"
      :use-utc="useUtc"
      @blur="handleInputBlur"
      @clear-date="clearDate"
      @close="close"
      @focus="handleInputFocus"
      @open="open"
      @select-typed-date="selectTypedDate"
      @set-focus="setFocus($event)"
      @typed-date="handleTypedDate"
    >
      <slot slot="beforeDateInput" name="beforeDateInput" />
      <slot slot="afterDateInput" name="afterDateInput" />
      <slot slot="clearBtn" name="clearBtn" />
      <slot slot="calendarBtn" name="calendarBtn" />
    </DateInput>

    <Popup
      ref="popup"
      :append-to-body="appendToBody"
      :fixed-position="fixedPosition"
      :inline="inline"
      :rtl="isRtl"
      :visible="isOpen"
    >
      <Transition name="toggle">
        <div
          v-show="isOpen"
          class="vdp-datepicker__calendar"
          :class="pickerClasses"
          data-test-calendar
          @mousedown.prevent
          @focusin.stop="handleFocusIn($event)"
          @focusout.stop="handleFocusOut($event)"
          @keydown.esc.stop="resetOrClose"
          @keydown.tab.stop="tabThroughNavigation($event)"
        >
          <Transition name="view">
            <div ref="view" :key="view">
              <div v-if="$slots.beforeCalendarHeader">
                <slot name="beforeCalendarHeader" />
              </div>
              <Component
                :is="picker"
                ref="picker"
                :bootstrap-styling="bootstrapStyling"
                class="picker-view"
                :day-cell-content="dayCellContent"
                :disabled-dates="disabledDates"
                :first-day-of-week="firstDayOfWeek"
                :highlighted="highlighted"
                :is-rtl="isRtl"
                :is-typeable="typeable"
                :is-up-disabled="isUpDisabled"
                :is-minimum-view="isMinimumView"
                :open-date="computedOpenDate"
                :page-date="pageDate"
                :selected-date="selectedDate"
                :show-edge-dates="showEdgeDates"
                :show-full-month-name="fullMonthName"
                :show-header="showHeader"
                :slide-duration="slideDuration"
                :tabbable-cell-id="tabbableCellId"
                :transition-name="transitionName"
                :translation="translation"
                :use-utc="useUtc"
                :view="view || computedInitialView"
                :year-range="yearPickerRange"
                @page-change="handlePageChange"
                @select="handleSelect"
                @set-focus="setFocus($event)"
                @set-transition-name="setTransitionName($event)"
                @set-view="setView"
              >
                <template v-for="slotKey of calendarSlots">
                  <slot :slot="slotKey" :name="slotKey" />
                </template>
                <template #dayCellContent="{ cell }">
                  <slot v-if="cell" name="dayCellContent" :cell="cell" />
                </template>
              </Component>
              <div v-if="$slots.calendarFooter">
                <slot name="calendarFooter" />
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Popup>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import {
  Cell,
  PageChangeOptions,
  DayCell,
  DisabledDates,
  FixedPosition,
  Highlighted,
  NextView,
  Translation,
  View,
  MonthCell,
  YearCell,
} from '../../typings'
import en from '../locale/translations/en'
import DateInput from './DateInput.vue'
import DisabledDate from '../utils/DisabledDate'
import inputProps from '../mixins/inputProps.vue'
import DateUtils from '../utils/DateUtils'
import navMixin from '../mixins/navMixin.vue'
import PickerDay from './PickerDay.vue'
import PickerMonth from './PickerMonth.vue'
import PickerYear from './PickerYear.vue'
import Popup from './Popup.vue'

@Component({
  components: {
    DateInput,
    PickerDay,
    PickerMonth,
    PickerYear,
    Popup,
  },
})
export default class Datepicker extends Mixins(inputProps, navMixin) {
  @Prop({ default: false }) appendToBody: boolean

  @Prop({ default: '' }) calendarClass: string | object | Array<string>

  @Prop({ default: (day: DayCell) => day.date }) dayCellContent: Function

  @Prop({ default: {} }) disabledDates: DisabledDates

  @Prop({ default: 'sun' }) firstDayOfWeek: string

  @Prop({ default: '' }) fixedPosition: FixedPosition

  @Prop({ default: false }) fullMonthName: boolean

  @Prop({ default: {} }) highlighted: Highlighted

  @Prop({ default: '' }) initialView: View

  @Prop({ default: en }) language: Translation

  @Prop({ default: 'year' }) maximumView: View

  @Prop({ default: 'day' }) minimumView: View

  @Prop({ default: true }) showEdgeDates: boolean

  @Prop({ default: true }) showHeader: boolean

  @Prop({ default: '' }) value: string | Date | number | null

  @Prop({ default: '' }) wrapperClass: string | object | Array<string>

  @Prop({ default: 10 }) yearPickerRange: number

  calendarHeight = 0

  calendarSlots = [
    'beforeCalendarHeaderDay',
    'calendarFooterDay',
    'beforeCalendarHeaderMonth',
    'calendarFooterMonth',
    'beforeCalendarHeaderYear',
    'calendarFooterYear',
    'nextIntervalBtn',
    'prevIntervalBtn',
  ]

  isClickOutside = false

  /*
   * The latest valid `typedDate` (used for typeable datepicker)
   */
  latestValidTypedDate: Date | null = null

  /*
   * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
   * This represents the first day of the current viewing month
   */
  pageTimestamp = 0

  /*
   * Selected Date
   */
  selectedDate: Date | null = null

  utils = new DateUtils(this.$props.useUtc)

  view: View = ''

  get computedInitialView() {
    return this.initialView || this.minimumView
  }

  get computedOpenDate(): Date {
    let { openDate } = this.$props
    const openDateOrToday = openDate
      ? new Date(openDate)
      : this.utils.getNewDateObject()
    openDate = this.selectedDate || openDateOrToday

    // If the `minimum-view` is `month` or `year`, convert `openDate` accordingly
    return this.minimumView === 'day'
      ? openDate
      : new Date(this.utils.setDate(openDate, 1))
  }

  get datepickerId() {
    return `vdp-${Math.random().toString(36).slice(-10)}`
  }

  get isInline() {
    return !!this.$props.inline
  }

  get isOpen() {
    return this.view !== ''
  }

  get isMinimumView() {
    return this.view === this.minimumView
  }

  get isRtl() {
    return this.translation.rtl
  }

  get isUpDisabled() {
    return !this.allowedToShowView(this.nextView.up)
  }

  get nextView(): NextView {
    const views: Array<View> = ['day', 'month', 'year']
    const isCurrentView = (view: View) => view === this.view
    const viewIndex = views.findIndex(isCurrentView)
    const nextViewDown = (index: number) => {
      return index <= 0 ? undefined : views[index - 1]
    }
    const nextViewUp = (index: number): View | undefined | 'decade' => {
      if (index < 0) {
        return undefined
      }

      if (index === views.length - 1) {
        return 'decade'
      }

      return views[index + 1]
    }

    return {
      up: nextViewUp(viewIndex),
      down: nextViewDown(viewIndex),
    }
  }

  get pageDate() {
    return new Date(this.pageTimestamp)
  }

  get picker() {
    const view = this.view || this.computedInitialView
    return `Picker${this.ucFirst(view)}`
  }

  get pickerClasses() {
    return [
      this.calendarClass,
      this.isInline && 'vdp-datepicker__calendar--inline',
      this.isRtl && this.appendToBody && 'rtl',
    ]
  }

  get translation() {
    return this.language
  }

  @Watch('initialView')
  onInitialViewChanged() {
    if (this.isOpen) {
      this.setInitialView()
    }
  }

  @Watch('isActive')
  onIsActiveChanged(hasJustBecomeActive: boolean, isNoLongerActive: boolean) {
    if (hasJustBecomeActive && this.$props.inline) {
      this.setNavElementsFocusedIndex()
      this.tabToCorrectInlineCell()
    }

    if (isNoLongerActive && this.$props.typeable) {
      this.setTypedDateOnLosingFocus()
    }
  }

  @Watch('latestValidTypedDate')
  onLatestValidTypedDate(date: Date) {
    this.setPageDate(date)
  }

  @Watch('openDate')
  onOpenDate() {
    this.setPageDate()
  }

  @Watch('value')
  onValueChanged(value: string | Date | number | null) {
    const parsedValue = this.parseValue(value)
    this.setValue(parsedValue)
  }

  @Watch('view')
  onViewChanged(newView: View, oldView: View) {
    this.handleViewChange(newView, oldView)
  }

  created() {
    const startDate = this.utils.getNewDateObject(this.$props.openDate || null)
    this.pageTimestamp = this.utils.setDate(startDate, 1)
  }

  mounted() {
    this.init()
    document.addEventListener('click', this.handleClickOutside)
  }

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  }

  /**
   * Are we allowed to show a specific picker view?
   */
  allowedToShowView(view: View | undefined | 'decade') {
    if (view === undefined || view === 'decade') {
      return false
    }

    const views = ['day', 'month', 'year']
    const minimumViewIndex = views.indexOf(this.minimumView)
    const maximumViewIndex = views.indexOf(this.maximumView)
    const viewIndex = views.indexOf(view)

    return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex
  }

  /**
   * Clear the selected date
   */
  clearDate() {
    if (!this.selectedDate) {
      return
    }

    this.selectedDate = null
    this.focus.refs = ['input']
    this.close()
    this.setPageDate()

    this.$emit('selected', null)
    this.$emit('input', null)
    this.$emit('cleared')
  }

  /**
   * Close the calendar
   */
  close() {
    if (this.isInline) {
      return
    }

    this.view = ''

    if (this.showCalendarOnFocus) {
      const dateInput = this.$refs.dateInput as any

      dateInput.shouldToggleOnClick = true
    }

    if (this.isClickOutside) {
      this.isClickOutside = false
    } else {
      this.reviewFocus()
    }

    this.$emit('closed')
  }

  /**
   * Closes the calendar when no element within it has focus
   */
  handleClickOutside() {
    if (Vue.prototype.datepickerId !== this.datepickerId) {
      return
    }

    const activeElement = document.activeElement as HTMLElement
    const isFocused = activeElement
      ? this.allElements.includes(activeElement)
      : false

    if (!isFocused && this.isOpen) {
      this.isClickOutside = true
      this.close()
    }
  }

  /**
   * Emits a 'blur' event
   */
  handleInputBlur() {
    this.$emit('blur')
  }

  /**
   * Emits a 'focus' event
   */
  handleInputFocus() {
    this.$emit('focus')
  }

  /**
   * Set the new pageDate, focus the relevant element and emit a `changed-<view>` event
   */
  handlePageChange(pageChangeOptions: PageChangeOptions) {
    const { focusRefs, pageDate } = pageChangeOptions
    this.setPageDate(pageDate)
    this.focus.refs = focusRefs
    this.focus.delay = this.slideDuration
    this.reviewFocus()
    this.$emit(`changed-${this.nextView.up}`, pageDate)
  }

  /**
   * Set the date, or go to the next view down
   */
  // eslint-disable-next-line max-statements,complexity
  handleSelect(cell: DayCell | MonthCell | YearCell) {
    if (this.allowedToShowView(this.nextView.down)) {
      this.showNextViewDown(cell)
      return
    }

    ;(this.$refs.dateInput as any).typedDate = ''
    this.selectDate(cell.timestamp)
    if (cell.type === 'day' && cell.isNextMonth) {
      this.focus.delay = this.slideDuration
    }
    this.focus.refs = this.isInline ? ['tabbableCell'] : ['input']
    this.close()

    if (this.showCalendarOnFocus && !this.inline) {
      ;(this.$refs.dateInput as any).shouldToggleOnClick = true
    } else {
      this.reviewFocus()
    }
  }

  /**
   * Updates the page (if necessary) after a 'typed-date' event and sets `tabbableCell` & `latestValidTypedDate`
   */
  handleTypedDate(date: Date) {
    const originalTypedDate = new Date(this.latestValidTypedDate!)
    const originalPageDate = new Date(this.pageDate)

    this.latestValidTypedDate = date || this.computedOpenDate
    this.setTransitionAndFocusDelay(
      originalTypedDate,
      this.latestValidTypedDate,
    )
    this.setPageDate(date)
    this.$emit('input', date)

    if (this.isPageChange(originalPageDate)) {
      this.handlePageChange({
        focusRefs: [],
        pageDate: this.pageDate,
      })
      return
    }

    this.setTabbableCell()
  }

  /**
   * Focus the relevant element when the view changes
   */
  handleViewChange(newView: View, oldView: View) {
    const isClosing = newView === ''
    const isOpeningInline = oldView === '' && this.isInline

    if (isClosing || isOpeningInline) {
      return
    }

    if (!this.isRevertingToOpenDate) {
      this.setViewChangeFocusRefs(newView, oldView)
      this.reviewFocus()
    }

    this.isRevertingToOpenDate = false
  }

  /**
   * Returns true if element has the given className
   */
  hasClass(element: Element, className: string) {
    return element && element.className.split(' ').includes(className)
  }

  /**
   * Used for typeable datepicker: returns true if a typed date causes the page to change
   */
  isPageChange(originalPageDate: Date) {
    if (!this.isOpen) {
      return false
    }

    return originalPageDate.valueOf() !== this.pageDate.valueOf()
  }

  /**
   * Initiate the component
   */
  // eslint-disable-next-line complexity,max-statements
  init() {
    if (this.value) {
      let parsedValue = this.parseValue(this.value)
      const isDateDisabled = parsedValue && this.isDateDisabled(parsedValue)

      if (isDateDisabled) {
        parsedValue = null
        this.$emit('input', parsedValue)
      }
      this.setValue(parsedValue)
    } else if (this.typeable) {
      this.latestValidTypedDate = this.utils.getNewDateObject()
    }

    if (this.isInline) {
      this.setInitialView()
    }

    this.setSlideDuration()
  }

  /**
   * Returns true if a date is disabled
   */
  isDateDisabled(date: Date) {
    return new DisabledDate(this.useUtc, this.disabledDates).isDateDisabled(
      date,
    )
  }

  /**
   * Returns true if we should reset the focus to computedOpenDate
   */
  isResetFocus() {
    if (!this.isOpen) {
      return false
    }

    const isOpenCellFocused =
      this.hasClass(document.activeElement!, 'cell') &&
      !this.hasClass(document.activeElement!, 'open')

    return !this.isMinimumView || isOpenCellFocused
  }

  /**
   * Opens the calendar with the relevant view: 'day', 'month', or 'year'
   */
  open() {
    if (this.disabled || this.isInline) {
      return
    }

    this.setInitialView()
    this.reviewFocus()

    this.$emit('opened')
  }

  /**
   * Parse a datepicker value from string/number to date
   */
  parseValue(date: Date | string | number | null) {
    let dateTemp = date
    if (typeof dateTemp === 'string' || typeof dateTemp === 'number') {
      const parsed = new Date(dateTemp)
      dateTemp = this.utils.isValidDate(parsed) ? parsed : null
    }
    return dateTemp
  }

  /**
   * Focus the open date, or close the calendar if already focused
   */
  resetOrClose() {
    if (this.isResetFocus()) {
      this.resetFocusToOpenDate()
      return
    }

    if (this.isOpen) {
      this.focus.refs = ['input']
      this.close()
    }
  }

  /**
   * Select the date
   */
  selectDate(timestamp: number) {
    const date = new Date(timestamp)

    this.setValue(date)
    this.$emit('selected', date)
    this.$emit('input', date)
  }

  /**
   * Select the date from a 'select-typed-date' event
   */
  selectTypedDate(date: Date) {
    this.setValue(date)
    this.reviewFocus()
    this.$emit('selected', date)

    if (this.isOpen) {
      this.close()
    }
  }

  /**
   * Sets the initial picker page view: day, month or year
   */
  setInitialView() {
    const initialView = this.computedInitialView

    if (!this.allowedToShowView(initialView)) {
      throw new Error(
        `initialView '${this.initialView}' cannot be rendered based on minimum '${this.minimumView}' and maximum '${this.maximumView}'`,
      )
    }

    this.setView(initialView)
  }

  /**
   * Sets the date that the calendar should open on
   * @param date The date to set for the page
   */
  setPageDate(date?: Date | null) {
    let dateTemp = date
    if (!dateTemp) {
      if (this.computedOpenDate) {
        dateTemp = new Date(this.computedOpenDate)
      } else {
        dateTemp = new Date()
      }
    }

    const pageDate = this.utils.resetDateTime(new Date(dateTemp))
    let pageTimestamp = this.utils.setDate(new Date(pageDate), 1)

    if (this.view === 'year') {
      pageTimestamp = this.utils.setMonth(new Date(pageTimestamp), 0)
    }

    this.pageTimestamp = pageTimestamp
  }

  /**
   * Sets the slide duration in milliseconds by looking up the stylesheet
   */
  setSlideDuration() {
    const picker = this.$refs.picker as Vue
    if (!picker || !picker.$refs.cells) {
      return
    }
    const cells = (picker.$refs.cells as Vue).$el
    const durationInSecs = window.getComputedStyle(cells).transitionDuration

    this.slideDuration = parseFloat(durationInSecs) * 1000
  }

  /**
   * Selects the typed date when the datepicker loses focus, provided it's valid and differs from the current selected date
   */
  setTypedDateOnLosingFocus() {
    const parsedDate: Date = (this.$refs.dateInput as any).parseInput()
    const date = this.utils.isValidDate(parsedDate) ? parsedDate : null
    const hasChanged = () => {
      if (!this.selectedDate && !date) {
        return false
      }

      if (this.selectedDate && date) {
        return date.valueOf() !== this.selectedDate.valueOf()
      }

      return true
    }

    if (hasChanged()) {
      this.setValue(date)
      this.$emit('selected', date)
    }
  }

  /**
   * Set the datepicker value (and, if typeable, update `latestValidTypedDate`)
   */
  setValue(date: Date | null) {
    this.selectedDate = date || null
    this.setPageDate(date)

    if (this.typeable) {
      this.latestValidTypedDate = date || this.computedOpenDate
    }
  }

  /**
   * Set the picker view
   */
  setView(view: View) {
    if (this.allowedToShowView(view)) {
      this.view = view
    }
  }

  /**
   * Sets the array of `refs` that might be focused following a view change
   * @param newView The view being changed to
   * @param oldView The previous view
   */
  setViewChangeFocusRefs(newView: string, oldView: string) {
    if (oldView === '') {
      this.focus.refs = []
      return
    }

    const views: Array<View> = ['day', 'month', 'year']
    const isNewView = (view: View) => view === newView
    const isOldView = (view: View) => view === oldView
    const newViewIndex = views.findIndex(isNewView)
    const oldViewIndex = views.findIndex(isOldView)
    const isViewChangeUp = newViewIndex - oldViewIndex > 0

    this.focus.refs = isViewChangeUp
      ? ['up', 'tabbableCell']
      : ['tabbableCell', 'up']
  }

  /**
   * Set the view to the next view down e.g. from `month` to `day`
   * @param cell The currently focused cell
   */
  showNextViewDown(cell: Cell) {
    this.setPageDate(new Date(cell.timestamp))
    this.$emit(`changed-${this.view}`, cell)
    this.setView(this.nextView.down!)
  }

  /**
   * Capitalizes the first letter
   * @param str The string to capitalize
   */
  ucFirst(str: string) {
    return str[0].toUpperCase() + str.substring(1)
  }
}
</script>

<style lang="scss">
@import '../styles/style.scss';
</style>
