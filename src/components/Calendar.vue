<template>
  <div
    ref="datepicker"
    :class="[calendarClass, 'vdp-datepicker__calendar']"
    :style="calendarStyle"
    @mousedown.prevent
  >
    <slot name="beforeCalendarHeader" />
    <component
      :is="currentPicker"
      :page-date="pageDate"
      :selected-date="selectedDate"
      :allowed-to-show-view="allowedToShowView"
      :translation="translation"
      :page-timestamp="pageTimestamp"

      :is-rtl="isRtl"
      :use-utc="useUtc"
      :show-header="showHeader"
      :full-month-name="fullMonthName"
      :monday-first="mondayFirst"
      :day-cell-content="dayCellContent"
      :highlighted="highlighted"
      :disabled-dates="disabledDates"

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
      <template
        v-for="slotKey of calendarSlots"
      >
        <slot
          :name="`${slotKey}`"
          :item="slotKey"
        />
      </template>
    </component>
    <slot name="calendarFooter" />
  </div>
</template>
<script>
import { makeDateUtils } from '~/utils/DateUtils'
import PickerDay from '~/components/PickerDay'
import PickerMonth from '~/components/PickerMonth'
import PickerYear from '~/components/PickerYear'
import calendarProps from '~/mixins/calendarProps'
import sharedProps from '~/mixins/sharedProps'
import calendarSlots from '~/utils/calendarSlots'

export default {
  name: 'Calendar',
  components: {
    PickerDay,
    PickerMonth,
    PickerYear,
  },
  mixins: [
    calendarProps,
    sharedProps,
  ],
  props: {
    translation: {
      type: Object,
      default() {
        return {}
      },
    },
    open: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Date,
      default: null,
    },
  },
  data() {
    const constructedDateUtils = makeDateUtils(this.useUtc)
    const startDate = constructedDateUtils.getNewDateObject(this.openDate)
    const pageTimestamp = constructedDateUtils.setDate(startDate, 1)
    return {
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
      calendarSlots,
      currentPicker: '',
      utils: constructedDateUtils,
    }
  },
  computed: {
    pageDate() {
      return new Date(this.pageTimestamp)
    },

    calendarStyle() {
      return {
        position: this.isInline ? 'static' : undefined,
      }
    },
    isInline() {
      return !!this.inline
    },

    computedInitialView() {
      if (!this.initialView) {
        return this.minimumView
      }

      return this.initialView
    },
  },
  watch: {
    initialView() {
      this.setInitialView()
    },
    openDate() {
      this.setPageDate()
    },
    value: {
      handler(newValue) {
        this.setValue(newValue)
      },
      immediate: true,
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * Initiate the component
     */
    init() {
      this.setInitialView()
      if (!this.isInline) {
        this.setPickerPosition()
      }
    },
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
     * @param {Object} date
     */
    selectDate(date) {
      this.setDate(date.timestamp)
      if (!this.isInline) {
        this.close(true)
      }
      this.$emit('reset-typed-date', this.utils.getNewDateObject())
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
     * Handles a month change from the day picker
     */
    handleChangedMonthFromDayPicker(date) {
      this.setPageDate(date)
      this.$emit('changed-month', date)
    },

    /**
     * Show a specific picker
     * @return {Boolean}
     */
    showSpecificCalendar(type) {
      if (type) {
        if (!this.allowedToShowView(type.toLowerCase())) {
          return false
        }
        this.currentPicker = `Picker${type}`
        return true
      }
      this.currentPicker = ''
      return false
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
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss">
@import '../styles/calendar.scss';
</style>
