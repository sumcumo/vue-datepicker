<template>
  <div
    :id="datepickerId"
    ref="datepicker"
    class="vdp-datepicker"
    :class="[wrapperClass, { rtl: isRtl }]"
    @focusin="handleFocusIn($event)"
    @focusout="handleFocusOut($event)"
    @keydown.esc="clearDate"
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
      // If `openDate` is not set, open on today's date
      const openDate = this.openDate
        ? new Date(this.openDate)
        : this.utils.getNewDateObject()

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
    isActive(hasJustBecomeActive) {
      if (hasJustBecomeActive && this.inline) {
        this.setNavElementsFocusedIndex()
        this.tabToCorrectInlineCell()
      }
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
      if (this.isResetFocus()) {
        this.resetFocusToOpenDate()
        return
      }

      this.selectedDate = null
      this.focus.refs = ['input']
      this.close()

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
    /**
     * Closes the calendar when no element within it has focus
     */
    handleClickOutside() {
      if (document.datepickerId !== this.datepickerId) {
        return
      }

      const isFocused = this.allElements.includes(document.activeElement)

      if (!isFocused && this.isOpen) {
        this.isClickOutside = true
        this.close()
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
     * Set the date from a 'typed-date' event
     * @param {Date} date
     */
    handleTypedDate(date) {
      if (this.selectedDate) {
        this.setTransitionAndFocusDelay(this.selectedDate, date)
      }

      this.selectDate(date ? date.valueOf() : null)
      this.reviewFocus()
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
     * Initiate the component
     */
    init() {
      if (this.value) {
        let parsedValue = this.parseValue(this.value)
        const isDateDisabled = parsedValue && this.isDateDisabled(parsedValue)

        if (isDateDisabled) {
          parsedValue = null
          this.$emit('input', parsedValue)
        }
        this.setValue(parsedValue)
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
     * Returns true if we should reset the focus to the open date
     * @returns {Boolean}
     */
    isResetFocus() {
      return (
        this.isOpen &&
        this.hasClass(document.activeElement, 'cell') &&
        (!this.isMinimumView || !this.hasClass(document.activeElement, 'open'))
      )
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
     * Select the date
     * @param {Number} timestamp
     */
    selectDate(timestamp) {
      if (!timestamp) {
        this.selectedDate = null
        return
      }

      const date = new Date(timestamp)
      this.selectedDate = date
      this.setPageDate(date)
      this.$emit('selected', date)
      this.$emit('input', date)
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
     */
    setPageDate(date) {
      let dateTemp = date
      if (!dateTemp) {
        if (this.openDate) {
          dateTemp = new Date(this.openDate)
        } else {
          dateTemp = new Date()
        }
        dateTemp = this.utils.resetDateTime(dateTemp)
      }
      this.pageTimestamp = this.utils.setDate(new Date(dateTemp), 1)
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
     * Set the datepicker value
     * @param {Date|String|Number|null} date
     */
    setValue(date) {
      if (!date) {
        this.setPageDate()
        this.selectedDate = null
        return
      }
      this.selectedDate = date
      this.setPageDate(date)
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
