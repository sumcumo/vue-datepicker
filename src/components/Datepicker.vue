<template>
  <div class="vdp-datepicker" :class="[wrapperClass, { rtl: isRtl }]">
    <DateInput
      :id="id"
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
      :reset-typed-date="resetTypedDate"
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
      <div
        v-show="isOpen"
        ref="datepicker"
        class="vdp-datepicker__calendar"
        :class="pickerClasses"
        @mousedown.prevent
      >
        <slot name="beforeCalendarHeader" />
        <Component
          :is="picker"
          :day-cell-content="dayCellContent"
          :disabled-dates="disabledDates"
          :first-day-of-week="firstDayOfWeek"
          :highlighted="highlighted"
          :is-rtl="isRtl"
          :is-up-disabled="isUpDisabled"
          :page-date="pageDate"
          :selected-date="selectedDate"
          :show-edge-dates="showEdgeDates"
          :show-full-month-name="fullMonthName"
          :show-header="showHeader"
          :translation="translation"
          :use-utc="useUtc"
          :year-range="yearPickerRange"
          @page-change="handlePageChange"
          @select="handleSelect"
          @select-disabled="handleSelectDisabled"
          @set-view="setView"
        >
          <template v-for="slotKey of calendarSlots">
            <slot :slot="slotKey" :name="slotKey" />
          </template>
          <template #dayCellContent="{ cell }">
            <slot v-if="cell" name="dayCellContent" :cell="cell" />
          </template>
        </Component>
        <slot name="calendarFooter" />
      </div>
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
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp,
      resetTypedDate: utils.getNewDateObject(),
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      utils,
      view: '',
    }
  },
  computed: {
    allowedViews() {
      const views = ['day', 'month', 'year']

      return views.filter((view) => this.allowedToShowView(view))
    },
    computedInitialView() {
      return this.initialView || this.minimumView
    },
    isInline() {
      return !!this.inline
    },
    isOpen() {
      return this.view !== ''
    },
    isRtl() {
      return this.translation.rtl
    },
    isUpDisabled() {
      return !this.allowedToShowView(this.nextView.up)
    },
    nextView() {
      const isCurrentView = (view) => view === this.view
      const viewIndex = this.allowedViews.findIndex(isCurrentView)
      const nextViewDown = (index) => {
        return index <= 0 ? undefined : this.allowedViews[index - 1]
      }
      const nextViewUp = (index) => {
        if (index < 0) {
          return undefined
        }

        if (index === this.allowedViews.length - 1) {
          return 'decade'
        }

        return this.allowedViews[index + 1]
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
        this.isInline && 'inline',
        this.isRtl && this.appendToBody && 'rtl',
      ]
    },
    translation() {
      return this.language
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
     * Close the calendar
     */
    close() {
      if (!this.isInline) {
        this.view = ''
        this.$emit('closed')
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
     * Set the new pageDate and emit `changed-<view>` event
     */
    handlePageChange(pageDate) {
      this.setPageDate(pageDate)
      this.$emit(`changed-${this.nextView.up}`, pageDate)
    },
    /**
     * Set the date, or go to the next view down
     */
    handleSelect(cell) {
      if (this.allowedToShowView(this.nextView.down)) {
        this.setPageDate(new Date(cell.timestamp))
        this.$emit(`changed-${this.view}`, cell)
        this.setView(this.nextView.down)
        return
      }

      this.resetTypedDate = this.utils.getNewDateObject()
      this.selectDate(cell.timestamp)
      this.close()
    },
    /**
     * Emit a 'selected-disabled' event
     */
    handleSelectDisabled(cell) {
      this.$emit('selected-disabled', cell)
    },
    /**
     * Set the date from a 'typed-date' event
     * @param {Date} date
     */
    handleTypedDate(date) {
      this.selectDate(date.valueOf())
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
