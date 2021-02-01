<template>
  <div
    ref="vdp-datepicker"
    class="vdp-datepicker"
    :class="[wrapperClass, { rtl: isRtl }]"
    @keyup.esc.prevent="closeAndClear"
  >
    <DateInput
      :id="id"
      ref="DateInput"
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
      :is-open="isOpen"
      :input-class="inputClass"
      :maxlength="maxlength"
      :name="name"
      :parser="parser"
      :pattern="pattern"
      :placeholder="placeholder"
      :ref-name="refName"
      :required="required"
      :reset-typed-date="resetTypedDate"
      :selected-date="selectedDate"
      :show-calendar-on-button-click="showCalendarOnButtonClick"
      :show-calendar-on-focus="showCalendarOnFocus"
      :tabindex="tabindex"
      :translation="translation"
      :typeable="typeable"
      :use-utc="useUtc"
      @blur="onBlur"
      @check-focus="checkFocus"
      @clear-date="clearDate"
      @close="close"
      @focus="onFocus"
      @open="open"
      @typed-date="setTypedDate"
    >
      <slot slot="beforeDateInput" name="beforeDateInput" />
      <slot slot="afterDateInput" name="afterDateInput" />
    </DateInput>

    <Popup
      ref="popup"
      :append-to-body="appendToBody"
      :fixed-position="fixedPosition"
      :inline="inline"
      :rtl="isRtl"
      :visible="isOpen"
    >
      <div
        v-show="isOpen"
        ref="datepicker"
        :class="pickerClasses"
        @mousedown.prevent
      >
        <template v-if="isOpen">
          <slot name="beforeCalendarHeader" />
          <Component
            :is="currentPicker"
            ref="PickerView"
            :allowed-to-show-view="allowedToShowView"
            :day-cell-content="dayCellContent"
            :disabled-dates="disabledDates"
            :first-day-of-week="firstDayOfWeek"
            :has-been-focused="hasBeenFocused"
            :highlighted="highlighted"
            :is-rtl="isRtl"
            :is-inline="isInline"
            :is-open="isOpen"
            :open-date="computedOpenDate"
            :page-date="pageDate"
            :page-timestamp="pageTimestamp"
            :selected-date="selectedDate"
            :show-edge-dates="showEdgeDates"
            :show-full-month-name="fullMonthName"
            :show-header="showHeader"
            :translation="translation"
            :typeable="typeable"
            :use-utc="useUtc"
            :year-range="yearPickerRange"
            @changed-decade="setPageDate"
            @changed-month="handleChangedMonthFromDayPicker"
            @changed-year="setPageDate"
            @check-focus="checkFocus"
            @close="close"
            @select-date="selectDate"
            @select-month="selectMonth"
            @select-year="selectYear"
            @selected-disabled="selectDisabledDate"
            @show-month-calendar="showSpecificCalendar('Month')"
            @show-year-calendar="showSpecificCalendar('Year')"
          >
            <template v-for="slotKey of calendarSlots">
              <slot :slot="slotKey" :name="slotKey" />
            </template>
          </Component>
          <slot name="calendarFooter" />
        </template>
      </div>
    </Popup>
  </div>
</template>
<script>
import en from '~/locale/translations/en'
import makeDateUtils from '~/utils/DateUtils'
import calendarSlots from '~/utils/calendarSlots'
import DateInput from '~/components/DateInput.vue'
import inputProps from '~/mixins/inputProps.vue'
import PickerDay from '~/components/PickerDay.vue'
import PickerMonth from '~/components/PickerMonth.vue'
import PickerYear from '~/components/PickerYear.vue'
import Popup from '~/components/Popup.vue'
import DisabledDate from '~/utils/DisabledDate'

const validDate = (val) =>
  val === null ||
  val instanceof Date ||
  typeof val === 'string' ||
  typeof val === 'number'

export default {
  name: 'Datepicker',
  components: {
    DateInput,
    PickerDay,
    PickerMonth,
    PickerYear,
    Popup,
  },
  mixins: [inputProps],
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
      validator: validDate,
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
    // const startDate = this.openDate ? new Date(this.openDate) : new Date()
    const constructedDateUtils = makeDateUtils(this.useUtc)
    let startDate
    if (this.openDate) {
      startDate = constructedDateUtils.getNewDateObject(this.openDate)
    } else {
      startDate = constructedDateUtils.getNewDateObject()
    }
    const pageTimestamp = constructedDateUtils.setDate(startDate, 1)
    return {
      /*
       * Positioning
       */
      calendarHeight: 0,
      calendarSlots,
      currentPicker: '',
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp,
      resetTypedDate: constructedDateUtils.getNewDateObject(),
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      utils: constructedDateUtils,
      hasBeenFocused: false,
    }
  },
  computed: {
    computedInitialView() {
      return this.initialView ? this.initialView : this.minimumView
    },
    computedOpenDate() {
      return this.openDate ? this.utils.getNewDateObject(this.openDate) : null
    },
    isInline() {
      return !!this.inline
    },
    isOpen() {
      return this.currentPicker !== ''
    },
    isRtl() {
      return this.translation.rtl
    },
    pageDate() {
      return new Date(this.pageTimestamp)
    },
    pickerClasses() {
      return [
        this.calendarClass,
        'vdp-datepicker__calendar',
        this.isInline && 'inline',
        this.isRtl && this.appendToBody && 'rtl',
      ]
    },
    translation() {
      return this.language
    },
    disabledDatesClass() {
      return new DisabledDate(this.utils, this.disabledDates)
    },
  },
  watch: {
    initialView() {
      this.setInitialView()
    },
    openDate() {
      this.setPageDate()
    },
    value(value) {
      const parsedValue = this.parseValue(value)
      this.setValue(parsedValue)
    },
  },
  mounted() {
    this.init()
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
     * Close the calendar if no element within it is focused
     */
    checkFocus() {
      // eslint-disable-next-line no-console
      console.log('check the focus')
      return
      // eslint-disable-next-line complexity,max-statements,no-unreachable
      this.$nextTick(() => {
        // Wrap in a try/catch block to avoid an error when running tests
        try {
          const input = this.$refs.InputDate
          const picker = this.$refs.PickerView
          const isInputFocused = input && input.$el.matches(':focus-within')
          const isPickerFocused = picker && picker.$el.matches(':focus-within')
          const isFocused = isInputFocused || isPickerFocused

          if (isFocused) {
            this.hasBeenFocused = true
            return
          }

          if (this.isOpen) {
            this.close()
          }
        } catch {
          // :focus-within is not supported by this browser - https://caniuse.com/css-focus-within
        }
      })
    },
    /**
     * Clear the selected date
     */
    clearDate() {
      this.selectedDate = null
      this.setPageDate()
      this.$emit('selected', null)
      this.$emit('input', null)
      this.$emit('cleared')
    },
    /**
     * Close the calendar views
     */
    close(elementToFocus) {
      if (this.isInline) {
        return
      }
      this.currentPicker = ''

      if (!this.showCalendarOnFocus && !this.typeable) {
        if (elementToFocus) {
          this.focusElement(elementToFocus)
        }
      }
      this.$emit('closed')
    },
    /**
     * Close the calendar and clear the input field
     */
    closeAndClear() {
      this.close()
      this.clearDate()
    },
    /**
     * Focus the input field
     */
    focusElement(elementToFocus) {
      this.$nextTick(() => {
        this.$refs.DateInput.$refs[elementToFocus].focus()
      })
    },
    /**
     * Focus the selected cell if the calendar is inline
     */
    focusIfInline(cell) {
      if (this.isInline) {
        this.$refs.PickerView.focusCell(cell.id)
      }
    },
    /**
     * Handles a month change from the day picker
     */
    handleChangedMonthFromDayPicker(date) {
      this.setPageDate(date)
      this.$emit('changed-month', date)
    },
    /**
     * Initiate the component
     */
    init() {
      if (this.value) {
        let parsedValue = this.parseValue(this.value)
        const isDateDisabled =
          parsedValue && this.disabledDatesClass.isDateDisabled(parsedValue)
        if (isDateDisabled) {
          parsedValue = null
          this.$emit('input', parsedValue)
        }
        this.setValue(parsedValue)
      }
      if (this.isInline) {
        this.setInitialView()
      }
    },
    /**
     * Emits a 'blur' event
     */
    onBlur() {
      this.$emit('blur')
    },
    /**
     * Emits a 'focus' event
     */
    onFocus() {
      this.$emit('focus')
    },
    /**
     * Called in the event that the user navigates to date pages and
     * closes the picker without selecting a date.
     */
    resetDefaultPageDate() {
      if (this.selectedDate === null) {
        this.setPageDate()
        return
      }
      this.setPageDate(this.selectedDate)
    },
    /**
     * Set the selected date
     * @param {Number} timestamp
     */
    setDate(timestamp) {
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

      switch (initialView) {
        case 'year':
          this.showSpecificCalendar('Year')
          break
        case 'month':
          this.showSpecificCalendar('Month')
          break
        default:
          this.showSpecificCalendar('Day')
      }
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
     * Set the date from a typedDate event
     */
    setTypedDate(date) {
      this.setDate(date.valueOf())
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
     * parse a datepicker value from string/number to date
     * @param {Date|String|Number|null} date
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
     * @param {Object} cell
     */
    selectDate(cell) {
      this.resetTypedDate = this.utils.getNewDateObject()
      this.focusIfInline(cell)
      this.close()
      this.setDate(cell.timestamp)
    },
    /**
     * @param {Object} date
     */
    selectDisabledDate(date) {
      this.$emit('selected-disabled', date)
    },
    /**
     * @param {Object} cell
     */
    selectMonth(cell) {
      const date = new Date(cell.timestamp)
      if (this.allowedToShowView('day')) {
        this.setPageDate(date)
        this.$emit('changed-month', cell)
        this.showSpecificCalendar('Day')
      } else {
        this.selectDate(cell)
      }
    },
    /**
     * @param {Object} cell
     */
    selectYear(cell) {
      const date = new Date(cell.timestamp)
      if (this.allowedToShowView('month')) {
        this.setPageDate(date)
        this.$emit('changed-year', cell)
        this.showSpecificCalendar('Month')
      } else {
        this.selectDate(cell)
      }
    },
    /**
     * Opens the calendar with the relevant view: 'day', 'month', or 'year'
     */
    open() {
      if (this.disabled || this.isInline) {
        return
      }
      this.setInitialView()
      this.$emit('opened')
    },
    /**
     * Show a specific picker
     */
    showSpecificCalendar(type) {
      if (this.allowedToShowView(type.toLowerCase())) {
        this.currentPicker = `Picker${type}`
      }
    },
  },
}
</script>

<style lang="scss">
@import '../styles/style.scss';
</style>
