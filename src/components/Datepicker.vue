<template>
  <div
    :class="[wrapperClass, isRtl ? 'rtl' : '']"
    class="vdp-datepicker"
  >
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
      @clear-date="clearDate"
      @close-calendar="close"
      @focus="onFocus"
      @show-calendar="showCalendar"
      @typed-date="setTypedDate"
    >
      <slot
        slot="beforeDateInput"
        name="beforeDateInput"
      />
      <slot
        slot="afterDateInput"
        name="afterDateInput"
      />
    </DateInput>

    <template v-if="isOpen">
      <div
        ref="datepicker"
        :class="[calendarClass, 'vdp-datepicker__calendar', isInline && 'inline']"
        @mousedown.prevent
      >
        <slot name="beforeCalendarHeader" />
        <component
          :is="currentPicker"
          :allowed-to-show-view="allowedToShowView"
          :day-cell-content="dayCellContent"
          :disabled-dates="disabledDates"
          :highlighted="highlighted"
          :is-rtl="isRtl"
          :monday-first="mondayFirst"
          :page-date="pageDate"
          :page-timestamp="pageTimestamp"
          :selected-date="selectedDate"
          :show-full-month-name="fullMonthName"
          :show-header="showHeader"
          :translation="translation"
          :use-utc="useUtc"
          :year-range="yearPickerRange"

          @select-date="selectDate"
          @changed-month="handleChangedMonthFromDayPicker"
          @selected-disabled="selectDisabledDate"

          @select-month="selectMonth"
          @changed-year="setPageDate"
          @show-month-calendar="showSpecificCalendar('Month')"

          @select-year="selectYear"
          @changed-decade="setPageDate"
          @show-year-calendar="showSpecificCalendar('Year')"
        >
          <slot
            slot="beforeCalendarHeaderDay"
            name="beforeCalendarHeaderDay"
          />
          <slot
            slot="calendarFooterDay"
            name="calendarFooterDay"
          />
          <slot
            slot="beforeCalendarHeaderMonth"
            name="beforeCalendarHeaderMonth"
          />
          <slot
            slot="calendarFooterMonth"
            name="calendarFooterMonth"
          />
          <slot
            slot="beforeCalendarHeaderYear"
            name="beforeCalendarHeaderYear"
          />
          <slot
            slot="calendarFooterYear"
            name="calendarFooterYear"
          />
          <slot
            slot="nextIntervalBtn"
            name="nextIntervalBtn"
          />
          <slot
            slot="prevIntervalBtn"
            name="prevIntervalBtn"
          />
        </component>
        <slot name="calendarFooter" />
      </div>
    </template>
  </div>
</template>
<script>
import '~/utils/polyfills'
import en from '~/locale/translations/en'
import { makeDateUtils } from '~/utils/DateUtils'
import DateInput from '~/components/DateInput'
import PickerDay from '~/components/PickerDay'
import PickerMonth from '~/components/PickerMonth'
import PickerYear from '~/components/PickerYear'
import inputProps from '~/mixins/inputProps'

const validDate = (val) => val === null
  || val instanceof Date
  || typeof val === 'string'
  || typeof val === 'number'

export default {
  name: 'Datepicker',
  components: {
    DateInput,
    PickerDay,
    PickerMonth,
    PickerYear,
  },
  mixins: [
    inputProps,
  ],
  props: {
    calendarClass: {
      type: [
        String,
        Object,
        Array,
      ],
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
    fixedPosition: {
      type: String,
      default: '',
      validator: (val) => val === ''
        || val === 'bottom'
        || val === 'bottom-left'
        || val === 'bottom-right'
        || val === 'top'
        || val === 'top-left'
        || val === 'top-right',
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
    mondayFirst: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [
        String,
        Date,
        Number,
      ],
      default: '',
      validator: validDate,
    },
    wrapperClass: {
      type: [
        String,
        Object,
        Array,
      ],
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
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp,
      currentPicker: '',
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      /*
       * Positioning
       */
      calendarHeight: 0,
      resetTypedDate: constructedDateUtils.getNewDateObject(),
      utils: constructedDateUtils,
    }
  },
  computed: {
    computedInitialView() {
      return this.initialView ? this.initialView : this.minimumView
    },
    isInline() {
      return !!this.inline
    },
    isOpen() {
      return this.currentPicker !== ''
    },
    isRtl() {
      return this.translation.rtl === true
    },
    pageDate() {
      return new Date(this.pageTimestamp)
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
      this.setValue(value)
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
      const views = [
        'day',
        'month',
        'year',
      ]
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
     * Close the calendar views
     */
    close() {
      if (!this.isInline) {
        this.currentPicker = ''
        this.$emit('closed')
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
        this.setValue(this.value)
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
        throw new Error(`initialView '${this.initialView}' cannot be rendered based on minimum '${this.minimumView}' and maximum '${this.maximumView}'`)
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
          break
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
     * Set the datepicker position
     */
    setPickerPosition() {
      this.$nextTick(() => {
        const calendar = this.$refs.datepicker
        if (calendar) {
          if (this.currentPicker) {
            const parent = calendar.parentElement
            const calendarBounding = calendar.getBoundingClientRect()
            const outOfBoundsRight = calendarBounding.right > window.innerWidth
            const outOfBoundsBottom = calendarBounding.bottom > window.innerHeight
            const parentHeight = `${parent.getBoundingClientRect().height}px`

            if (this.fixedPosition === '') {
              if (outOfBoundsRight) {
                calendar.style.right = 0
              } else {
                calendar.style.right = 'unset'
              }

              if (outOfBoundsBottom) {
                calendar.style.bottom = parentHeight
              } else {
                calendar.style.bottom = 'unset'
              }
            } else {
              if (this.fixedPosition.indexOf('right') !== -1) {
                calendar.style.right = 0
              } else {
                calendar.style.right = 'unset'
              }
              if (this.fixedPosition.indexOf('top') !== -1) {
                calendar.style.bottom = parentHeight
              } else {
                calendar.style.bottom = 'unset'
              }
            }
          } else {
            calendar.style.right = 'unset'
            calendar.style.bottom = 'unset'
          }
        }
      })
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
      let dateTemp = date
      if (typeof dateTemp === 'string' || typeof dateTemp === 'number') {
        const parsed = new Date(dateTemp)
        dateTemp = Number.isNaN(parsed.valueOf()) ? null : parsed
      }
      if (!dateTemp) {
        this.setPageDate()
        this.selectedDate = null
        return
      }
      this.selectedDate = dateTemp
      this.setPageDate(dateTemp)
    },
    /**
     * @param {Object} date
     */
    selectDate(date) {
      this.resetTypedDate = this.utils.getNewDateObject()
      this.close()
      this.setDate(date.timestamp)
    },
    /**
     * @param {Object} date
     */
    selectDisabledDate(date) {
      this.$emit('selected-disabled', date)
    },
    /**
     * @param {Object} month
     */
    selectMonth(month) {
      const date = new Date(month.timestamp)
      if (this.allowedToShowView('day')) {
        this.setPageDate(date)
        this.$emit('changed-month', month)
        this.showSpecificCalendar('Day')
      } else {
        this.selectDate(month)
      }
    },
    /**
     * @param {Object} year
     */
    selectYear(year) {
      const date = new Date(year.timestamp)
      if (this.allowedToShowView('month')) {
        this.setPageDate(date)
        this.$emit('changed-year', year)
        this.showSpecificCalendar('Month')
      } else {
        this.selectDate(year)
      }
    },
    /**
     * Shows the calendar at the relevant view: 'day', 'month', or 'year'
     */
    showCalendar() {
      if (this.disabled || this.isInline) {
        return
      }
      this.setInitialView()
      this.setPickerPosition()
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
