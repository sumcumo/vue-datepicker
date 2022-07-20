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
                <template v-for="slotKey of calendarSlots" #[slotKey]>
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
      default() {
        return {}
      },
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
      default: false,
    },
    highlighted: {
      type: Object,
      default() {
        return {}
      },
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
    showEdgeDates: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [String, Date, Number],
      default: '',
      validator: (val) =>
        val === null ||
        val instanceof Date ||
        typeof val === 'string' ||
        typeof val === 'number',
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
  data() {
    const utils = makeDateUtils(this.useUtc)
    const startDate = utils.getNewDateObject(this.openDate || null)
    const pageTimestamp = utils.setDate(startDate, 1)

    return {
      calendarHeight: 0,
      calendarSlots,
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
      const openDateOrToday = this.openDate
        ? new Date(this.openDate)
        : this.utils.getNewDateObject()
      const openDate = this.selectedDate || openDateOrToday

      // If the `minimum-view` is `month` or `year`, convert `openDate` accordingly
      return this.minimumView === 'day'
        ? openDate
        : new Date(this.utils.setDate(openDate, 1))
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
  },
  watch: {
    initialView() {
      if (this.isOpen) {
        this.setInitialView()
      }
    },
    isActive(hasJustBecomeActive, isNoLongerActive) {
      if (hasJustBecomeActive && this.inline) {
        this.setNavElementsFocusedIndex()
        this.tabToCorrectInlineCell()
      }

      if (isNoLongerActive && this.typeable) {
        this.skipReviewFocus = true
        this.setTypedDateOnLosingFocus()

        this.$nextTick(() => {
          this.skipReviewFocus = false
        })
      }
    },
    latestValidTypedDate(date) {
      this.setPageDate(date)
    },
    openDate() {
      this.setPageDate()
    },
    value(value) {
      const parsedValue = this.parseValue(value)
      this.setValue(parsedValue)
    },
    view(newView, oldView) {
      this.handleViewChange(newView, oldView)
    },
  },
  mounted() {
    this.init()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
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

      this.selectedDate = null
      this.focus.refs = ['input']
      this.close()
      this.setPageDate()

      this.$emit('selected', null)
      this.$emit('input', null)
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
    closeByClickOutside() {
      this.isClickOutside = true
      this.close()
    },
    closeIfNotFocused() {
      const isFocused = this.allElements.includes(document.activeElement)

      if (!isFocused) {
        this.closeByClickOutside()
      }
    },
    /**
     * Closes the calendar when no element within it has focus
     */
    handleClickOutside() {
      if (!this.isOpen) {
        return
      }

      if (!this.globalDatepickerId) {
        this.closeByClickOutside()
        return
      }

      if (document.datepickerId.toString() === this.datepickerId) {
        this.$nextTick(() => {
          this.closeIfNotFocused()
        })
      }
    },
    /**
     * Emits a 'blur' event
     */
    handleInputBlur() {
      this.$emit('blur')
    },
    /**
     * Emits a 'focus' event
     */
    handleInputFocus() {
      this.$emit('focus')
    },
    /**
     * Set the new pageDate, focus the relevant element and emit a `changed-<view>` event
     */
    handlePageChange({ focusRefs, pageDate }) {
      this.setPageDate(pageDate)
      this.focus.refs = focusRefs
      this.focus.delay = this.slideDuration
      this.reviewFocus()
      this.$emit(`changed-${this.nextView.up}`, pageDate)
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
      this.selectDate(cell.timestamp)
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
     * Updates the page (if necessary) after a 'typed-date' event and sets `tabbableCell` & `latestValidTypedDate`
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
        this.latestValidTypedDate = this.computedOpenDate
      }

      if (this.isInline) {
        this.setInitialView()
      }

      this.setSlideDuration()
    },
    /**
     * Returns true if a date is disabled
     * @param {Date} date
     */
    isDateDisabled(date) {
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

      const isOpenCellFocused =
        this.hasClass(document.activeElement, 'cell') &&
        !this.hasClass(document.activeElement, 'open')

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
     * Parse a datepicker value from string/number to date
     * @param   {Date|String|Number|null} date
     * @returns {Date}
     */
    parseValue(date) {
      let dateTemp = date
      if (typeof dateTemp === 'string' || typeof dateTemp === 'number') {
        const parsed = new Date(dateTemp)
        dateTemp = Number.isNaN(parsed.valueOf()) ? null : parsed
      }
      return dateTemp
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
     * @param {Number} timestamp
     */
    selectDate(timestamp) {
      const date = new Date(timestamp)

      this.setValue(date)
      this.$emit('selected', date)
      this.$emit('input', date)
    },
    /**
     * Select the date from a 'select-typed-date' event
     * @param {Date=} date
     */
    selectTypedDate(date) {
      this.setValue(date)
      this.reviewFocus()
      this.$emit('input', date)
      this.$emit('selected', date)

      if (this.isOpen) {
        this.close()
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
      let dateTemp = date
      if (!dateTemp) {
        if (this.computedOpenDate) {
          dateTemp = new Date(this.computedOpenDate)
        } else {
          dateTemp = new Date()
        }
      }

      let pageTimestamp = this.utils.resetDateTime(new Date(dateTemp))
      pageTimestamp = this.utils.setDate(new Date(pageTimestamp), 1)

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
     * Selects the typed date when the datepicker loses focus, provided it's valid and differs from the current selected date
     */
    setTypedDateOnLosingFocus() {
      const parsedDate = this.$refs.dateInput.parseInput()
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
        this.$emit('input', date)
        this.$emit('selected', date)
      }
    },
    /**
     * Set the datepicker value (and, if typeable, update `latestValidTypedDate`)
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
      this.$emit(`changed-${this.view}`, cell)
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
