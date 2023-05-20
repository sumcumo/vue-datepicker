<template>
  <div
    :id="datepickerId"
    ref="datepicker"
    class="vdp-datepicker"
    :class="[wrapperClass, { rtl: isRtl }]"
    @focusin="handleFocusIn($event)"
    @focusout="handleFocusOut($event)"
    @keydown.esc="resetOrClose"
  >
    <DateInput
      :id="id"
      ref="dateInput"
      :autofocus="autofocus"
      :bootstrap-styling="bootstrapStyling"
      :calendar-button="calendarButton"
      :clear-button="clearButton"
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
      @clear-date="clearDate"
      @close="close"
      @open="open"
      @select-typed-date="selectTypedDate"
      @set-focus="setFocus($event)"
      @tab="tabThroughNavigation"
      @typed-date="handleTypedDate"
    >
      <template #beforeDateInput>
        <slot name="beforeDateInput" />
      </template>

      <template #afterDateInput>
        <slot name="afterDateInput" />
      </template>

      <template #clearBtn>
        <slot name="clearBtn" />
      </template>

      <template #calendarBtn>
        <slot name="calendarBtn" />
      </template>
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
                @set-skip-review-focus="skipReviewFocus = $event"
                @set-transition-name="setTransitionName($event)"
                @set-view="setView"
              >
                <template v-for="slotKey of usedCalendarSlots" #[slotKey]>
                  <slot :name="slotKey" />
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

<script>
import en from '~/locale/translations/en'
import calendarSlots from '~/utils/calendarSlots'
import DateInput from '~/components/DateInput.vue'
import DisabledDate from '~/utils/DisabledDate'
import inputProps from '~/mixins/inputProps.vue'
import makeDateUtils from '~/utils/DateUtils'
import navMixin from '~/mixins/navMixin.vue'
import PickerDay from '~/components/PickerDay.vue'
import PickerMonth from '~/components/PickerMonth.vue'
import PickerYear from '~/components/PickerYear.vue'
import Popup from '~/components/Popup.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Datepicker',
  components: {
    DateInput,
    PickerDay,
    PickerMonth,
    PickerYear,
    Popup,
  },
  mixins: [inputProps, navMixin],
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    calendarClass: {
      type: [String, Object, Array],
      default: '',
    },
    dayCellContent: {
      type: Function,
      default: (day) => day.date,
    },
    disabledDates: {
      type: Object,
      default: null,
    },
    firstDayOfWeek: {
      type: String,
      default: 'sun',
    },
    fixedPosition: {
      type: String,
      default: '',
      validator: (val) => {
        const possibleValues = [
          '',
          'bottom',
          'bottom-left',
          'bottom-right',
          'top',
          'top-left',
          'top-right',
        ]
        return possibleValues.includes(val)
      },
    },
    fullMonthName: {
      type: Boolean,
      default: null,
    },
    highlighted: {
      type: Object,
      default: null,
    },
    initialView: {
      type: String,
      default: '',
    },
    language: {
      type: Object,
      default: () => en,
    },
    maximumView: {
      type: String,
      default: 'year',
    },
    minimumView: {
      type: String,
      default: 'day',
    },
    modelValue: {
      type: [String, Date, Number],
      default: null,
    },
    showEdgeDates: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    wrapperClass: {
      type: [String, Object, Array],
      default: '',
    },
    yearPickerRange: {
      type: Number,
      default: 10,
    },
  },
  emits: {
    'blur': null,
    'changed': null,
    'cleared': null,
    'closed': null,
    'focus': null,
    'opened': null,
    'changedMonth': (date) => {
      return typeof date === 'object'
    },
    'changedYear': (date) => {
      return typeof date === 'object'
    },
    'changedDecade': (date) => {
      return typeof date === 'object'
    },
    'selected': (date) => {
      return date instanceof Date || date === null
    },
    'update:modelValue': (date) => {
      return date instanceof Date || date === null
    },
  },
  data() {
    const utils = makeDateUtils(this.useUtc)
    const initialView = this.initialView || this.minimumView
    const openDate = utils.getOpenDate(
      this.openDate,
      this.selectedDate,
      initialView,
    )

    const pageTimestamp = utils.setDate(openDate, 1)

    return {
      calendarHeight: 0,
      isClickOutside: false,
      globalDatepickerId: '',
      /*
       * The latest valid `typedDate` (used for typeable datepicker)
       * {Date}
       */
      latestValidTypedDate: null,
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp,
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      slideDuration: 250,
      utils,
      view: '',
    }
  },
  computed: {
    computedInitialView() {
      return this.initialView || this.minimumView
    },
    computedOpenDate() {
      return this.utils.getOpenDate(
        this.openDate,
        this.selectedDate,
        this.minimumView,
      )
    },
    datepickerId() {
      return `vdp-${Math.random().toString(36).slice(-10)}`
    },
    isInline() {
      return !!this.inline
    },
    isOpen() {
      return this.view !== ''
    },
    isMinimumView() {
      return this.view === this.minimumView
    },
    isRtl() {
      return this.translation.rtl
    },
    isUpDisabled() {
      return !this.allowedToShowView(this.nextView.up)
    },
    nextView() {
      const views = ['day', 'month', 'year']
      const isCurrentView = (view) => view === this.view
      const viewIndex = views.findIndex(isCurrentView)
      const nextViewDown = (index) => {
        return index <= 0 ? undefined : views[index - 1]
      }
      const nextViewUp = (index) => {
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
    },
    pageDate() {
      return new Date(this.pageTimestamp)
    },
    picker() {
      const view = this.view || this.computedInitialView
      return `Picker${this.ucFirst(view)}`
    },
    pickerClasses() {
      return [
        this.calendarClass,
        this.isInline && 'vdp-datepicker__calendar--inline',
        this.isRtl && this.appendToBody && 'rtl',
      ]
    },
    translation() {
      return this.language
    },
    usedCalendarSlots() {
      return calendarSlots.filter((slot) => this.hasSlot(slot))
    },
  },
  watch: {
    disabledDates: {
      // eslint-disable-next-line complexity
      handler() {
        const selectedDate =
          this.selectedDate || this.utils.parseAsDate(this.modelValue)

        if (!selectedDate) {
          return
        }

        if (this.isDateDisabled(selectedDate) && selectedDate) {
          this.selectDate(null)
          return
        }

        if (this.dateHasChanged(selectedDate)) {
          this.selectDate(selectedDate)
        }
      },
      deep: true,
    },
    initialView() {
      if (this.isOpen) {
        this.setInitialView()
      }
    },
    isActive(hasJustBecomeActive, isNoLongerActive) {
      if (hasJustBecomeActive) {
        this.datepickerIsActive()
      }

      if (isNoLongerActive) {
        this.datepickerIsInactive()
      }
    },
    latestValidTypedDate(date) {
      this.setPageDate(date)
    },
    modelValue: {
      handler(newValue, oldValue) {
        let parsedValue = this.utils.parseAsDate(newValue)
        const oldParsedValue = this.utils.parseAsDate(oldValue)

        if (!this.utils.compareDates(parsedValue, oldParsedValue)) {
          const isDateDisabled = parsedValue && this.isDateDisabled(parsedValue)

          if (isDateDisabled) {
            parsedValue = null
          }
          this.setValue(parsedValue)
        }
      },
      immediate: true,
    },
    openDate() {
      this.setPageDate()
    },
    view(newView, oldView) {
      if (oldView === '') {
        this.setPageDate(this.utils.adjustDateToView(this.computedOpenDate))
      }
      this.handleViewChange(newView, oldView)
    },
  },
  mounted() {
    this.init()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    /**
     * Are we allowed to show a specific picker view?
     * @param {String} view
     * @return {Boolean}
     */
    allowedToShowView(view) {
      const views = ['day', 'month', 'year']
      const minimumViewIndex = views.indexOf(this.minimumView)
      const maximumViewIndex = views.indexOf(this.maximumView)
      const viewIndex = views.indexOf(view)

      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex
    },
    /**
     * Clear the selected date
     */
    clearDate() {
      if (!this.selectedDate) {
        return
      }

      this.selectDate(null)
      this.focus.refs = ['input']
      this.close()
      this.$emit('cleared')
    },
    /**
     * Close the calendar
     */
    close() {
      if (this.isInline) {
        return
      }

      this.view = ''

      if (this.showCalendarOnFocus) {
        this.$refs.dateInput.shouldToggleOnClick = true
      }

      if (this.isClickOutside) {
        this.isClickOutside = false
      } else {
        this.reviewFocus()
      }

      this.$emit('closed')
    },
    /**
     * Returns true if the given date differs from the `selectedDate`
     * @param   {Date} date The date to check
     * @returns {Boolean}
     */
    dateHasChanged(date) {
      return !this.utils.compareDates(date, this.selectedDate)
    },
    /**
     * Emits `focus` when the datepicker receives focus (and for an `inline`
     * datepicker, ensures the correct cell is tabbed to)
     */
    datepickerIsActive() {
      this.$emit('focus')

      if (this.inline) {
        this.setNavElementsFocusedIndex()
        this.tabToCorrectInlineCell()
      }
    },
    /**
     * Emits `blur` when the datepicker loses focus (and selects a typed date)
     */
    datepickerIsInactive() {
      this.$emit('blur')

      if (this.typeable) {
        this.skipReviewFocus = true
        this.selectTypedDateOnLosingFocus()

        this.$nextTick(() => {
          this.skipReviewFocus = false
        })
      }
    },
    /**
     * Closes the calendar when no element within it has focus
     */
    handleClickOutside() {
      if (!this.isOpen) {
        return
      }

      const closeByClickOutside = () => {
        this.isClickOutside = true
        this.close()
      }

      if (!this.globalDatepickerId) {
        closeByClickOutside()
        return
      }

      if (document.datepickerId.toString() === this.datepickerId) {
        this.$nextTick(() => {
          if (!this.isActive) {
            closeByClickOutside()
          }
        })
      }
    },
    /**
     * Set the new pageDate, focus the relevant element and emit a `changed-<view>` event
     */
    handlePageChange({ focusRefs, pageDate }) {
      this.setPageDate(pageDate)
      this.focus.refs = focusRefs
      this.focus.delay = this.slideDuration || 250
      this.reviewFocus()
      this.$emit(`changed${this.ucFirst(this.nextView.up)}`, pageDate)
    },
    /**
     * Set the date, or go to the next view down
     */
    // eslint-disable-next-line max-statements,complexity
    handleSelect(cell) {
      if (this.allowedToShowView(this.nextView.down)) {
        this.showNextViewDown(cell)
        return
      }

      this.$refs.dateInput.typedDate = ''
      this.selectDate(new Date(cell.timestamp))
      this.focus.delay = cell.isNextMonth ? this.slideDuration : 0
      this.focus.refs = this.isInline ? ['tabbableCell'] : ['input']
      this.close()

      if (this.showCalendarOnFocus && !this.inline) {
        this.$refs.dateInput.shouldToggleOnClick = true
      } else {
        this.reviewFocus()
      }
    },
    /**
     * Updates the page (if necessary) after a 'typedDate' event and sets `tabbableCell` & `latestValidTypedDate`
     * @param {Date=} date
     */
    handleTypedDate(date) {
      const originalTypedDate = new Date(this.latestValidTypedDate)
      const originalPageDate = new Date(this.pageDate)

      this.latestValidTypedDate = date || this.computedOpenDate
      this.setTransitionAndFocusDelay(
        originalTypedDate,
        this.latestValidTypedDate,
      )
      this.setPageDate(date)

      if (this.isPageChange(originalPageDate)) {
        this.handlePageChange({
          focusRefs: [],
          pageDate: this.pageDate,
        })
        return
      }

      this.setTabbableCell()
    },
    /**
     * Focus the relevant element when the view changes
     * @param {String} newView
     * @param {String} oldView
     */
    handleViewChange(newView, oldView) {
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
    },
    /**
     * Returns true if element has the given className
     * @param   {HTMLElement} element
     * @param   {String}      className
     * @returns {Boolean}
     */
    hasClass(element, className) {
      return element && element.className.split(' ').includes(className)
    },
    /**
     * Used for typeable datepicker: returns true if a typed date causes the page to change
     * @param   {Date}    originalPageDate
     * @returns {Boolean}
     */
    isPageChange(originalPageDate) {
      if (!this.isOpen) {
        return false
      }

      return originalPageDate.valueOf() !== this.pageDate.valueOf()
    },
    /**
     * Initiate the component
     */
    init() {
      if (this.typeable) {
        this.latestValidTypedDate = this.selectedDate || this.computedOpenDate
      }

      if (this.isInline) {
        this.setInitialView()
      }

      this.setSlideDuration()
    },
    /**
     * Returns true if a date is disabled
     * @param {Date} date
     * @returns {Boolean}
     */
    isDateDisabled(date) {
      if (!this.disabledDates) return false

      return new DisabledDate(this.utils, this.disabledDates).isDateDisabled(
        date,
      )
    },
    /**
     * Returns true if we should reset the focus to computedOpenDate
     * @returns {Boolean}
     */
    isResetFocus() {
      if (!this.isOpen) {
        return false
      }

      const activeElement = this.getActiveElement()
      const isOpenCellFocused =
        this.hasClass(activeElement, 'cell') &&
        !this.hasClass(activeElement, 'open')

      return !this.isMinimumView || isOpenCellFocused
    },
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
    },
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
    },
    /**
     * Select the date
     * @param {Date|null} date
     */
    selectDate(date) {
      if (this.dateHasChanged(date)) {
        this.$emit('changed', date)
      }

      this.setValue(date)
      this.$emit('selected', date)
      this.$emit('update:modelValue', date)
    },
    /**
     * Select the date from a 'selectTypedDate' event
     * @param {Date=} date
     */
    selectTypedDate(date) {
      this.selectDate(date)
      this.reviewFocus()

      if (this.isOpen) {
        this.close()
      }
    },
    /**
     * Selects the typed date when the datepicker loses focus, provided it's valid and differs from the current selected date
     */
    selectTypedDateOnLosingFocus() {
      const parsedDate = this.$refs.dateInput.parseInput()
      const date = this.utils.isValidDate(parsedDate) ? parsedDate : null

      if (this.dateHasChanged(date)) {
        this.selectDate(date)
      }
    },
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
    },
    /**
     * Sets the date that the calendar should open on
     * @param {Date=} date The date to set for the page
     */
    setPageDate(date) {
      const dateTemp = new Date(date || this.computedOpenDate)
      let pageTimestamp = this.utils.setDate(dateTemp, 1)

      if (this.view === 'year') {
        pageTimestamp = this.utils.setMonth(new Date(pageTimestamp), 0)
      }

      this.pageTimestamp = pageTimestamp
    },
    /**
     * Sets the slide duration in milliseconds by looking up the stylesheet
     */
    setSlideDuration() {
      if (!this.$refs.picker || !this.$refs.picker.$refs.cells) {
        return
      }
      const cells = this.$refs.picker.$refs.cells.$el
      const durationInSecs = window.getComputedStyle(cells).transitionDuration

      this.slideDuration = parseFloat(durationInSecs) * 1000
    },
    /**
     * Set the datepicker modelValue (and, if typeable, update `latestValidTypedDate`)
     * @param {Date|String|Number|null} date
     */
    setValue(date) {
      this.selectedDate = date || null
      this.setPageDate(date)

      if (this.typeable) {
        this.latestValidTypedDate = date || this.computedOpenDate
      }
    },
    /**
     * Set the picker view
     * @param {String} view
     */
    setView(view) {
      if (this.allowedToShowView(view)) {
        this.view = view
      }
    },
    /**
     * Sets the array of `refs` that might be focused following a view change
     * @param {String} newView The view being changed to
     * @param {String} oldView The previous view
     */
    setViewChangeFocusRefs(newView, oldView) {
      if (oldView === '') {
        this.focus.refs = []
        return
      }

      const views = ['day', 'month', 'year']
      const isNewView = (view) => view === newView
      const isOldView = (view) => view === oldView
      const newViewIndex = views.findIndex(isNewView)
      const oldViewIndex = views.findIndex(isOldView)
      const isViewChangeUp = newViewIndex - oldViewIndex > 0

      this.focus.refs = isViewChangeUp
        ? ['up', 'tabbableCell']
        : ['tabbableCell', 'up']
    },
    /**
     * Set the view to the next view down e.g. from `month` to `day`
     * @param {Object} cell The currently focused cell
     */
    showNextViewDown(cell) {
      this.setPageDate(new Date(cell.timestamp))
      this.$emit(`changed${this.ucFirst(this.view)}`, cell)
      this.setView(this.nextView.down)
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

<style lang="scss">
@import '../styles/style.scss';
</style>
