<template>
  <div
    :class="[wrapperClass, isRtl ? 'rtl' : '']"
    class="vdp-datepicker"
  >
    <DateInput
      v-bind="inputProperties"
      :reset-typed-date="resetTypedDate"
      :selected-date="model"
      :translation="translation"
      @clear-date="clearDate"
      @show-calendar="showCalendar"
      @close-calendar="close(true)"
      @typed-date="setTypedDate"
      @blur="onBlur"
      @focus="onFocus"
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
    <Popup
      :append-to-body="appendToBody"
      :visible="isOpen"
      :inline="inline"
      :fixed-position="fixedPosition"
      :rtl="isRtl"
    >
      <Calendar
        v-if="isOpen"
        v-bind="calendarProperties"

        :open="isOpen"
        :value="model"
        :translation="translation"

        @reset-typed-date="onResetTypedDate"
        @selected-disabled="onSelectedDisabled"
        @changed-month="onMonthChange"
        @changed-year="onYearChange"
        @input="setDate"
        @close="close"
      >
        <slot
          slot="beforeCalendarHeader"
          name="beforeCalendarHeader"
        />
        <template
          v-for="slotKey of calendarSlots"
        >
          <slot
            :slot="slotKey"
            :name="slotKey"
          />
        </template>
        <slot
          slot="calendarFooter"
          name="calendarFooter"
        />
      </Calendar>
    </Popup>
  </div>
</template>
<script>
import '~/utils/polyfills'
import en from '~/locale/translations/en'
import { makeDateUtils } from '~/utils/DateUtils'
import DateInput from '~/components/DateInput'
import Calendar from '~/components/Calendar'
import inputProps from '~/mixins/inputProps'
import calendarProps from '~/mixins/calendarProps'
import sharedProps from '~/mixins/sharedProps'
import calendarSlots from '~/utils/calendarSlots'
import Popup from '~/components/Popup'

export default {
  name: 'Datepicker',
  components: {
    Popup,
    DateInput,
    Calendar,
  },
  mixins: [
    inputProps,
    calendarProps,
    sharedProps,
  ],
  props: {
    language: {
      type: Object,
      default: () => en,
    },
    value: {
      type: [
        String,
        Date,
        Number,
      ],
      default: '',
      validator:
        (val) => val === null
          || val instanceof Date
          || typeof val === 'string'
          || typeof val === 'number',
    },
    wrapperClass: {
      type: [
        String,
        Object,
        Array,
      ],
      default: '',
    },

    appendToBody: {
      type: Boolean,
      default: false,
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
  },
  data() {
    const constructedDateUtils = makeDateUtils(this.useUtc)
    return {
      /*
       * Selected Date
       * {Date}
       */
      model: null,
      isOpen: false,
      resetTypedDate: constructedDateUtils.getNewDateObject(),
      calendarSlots,
    }
  },
  computed: {
    inputProperties() {
      return this.getProps(inputProps)
    },
    calendarProperties() {
      return this.getProps(calendarProps)
    },

    translation() {
      return this.language
    },

    isInline() {
      return !!this.inline
    },
    isRtl() {
      return this.translation.rtl === true
    },
  },
  watch: {
    value(value) {
      this.setValue(value)
    },
    isInline: {
      handler(value) {
        this.isOpen = value
      },
      immediate: true,
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    getProps(typeProps) {
      const props = {}
      Object.keys(this.$props).forEach((prop) => {
        if (typeProps.props[prop] || sharedProps.props[prop]) {
          props[prop] = this.$props[prop]
        }
      })
      return props
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed}
     */
    showCalendar() {
      if (this.disabled || this.isInline) {
        return false
      }
      if (this.isOpen) {
        return this.close(true)
      }
      if (!this.isInline) {
        this.isOpen = true
        this.$emit('opened')
      }
      return true
    },

    /**
     * Set the selected date
     * @param {Number} timestamp
     */
    setDate(timestamp) {
      const date = new Date(timestamp)
      this.model = date
      this.$emit('selected', date)
      this.$emit('input', date)
    },
    /**
     * Clear the selected date
     */
    clearDate() {
      this.model = null
      this.$emit('selected', null)
      this.$emit('input', null)
      this.$emit('cleared')
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
        this.model = null
        return
      }
      this.model = dateTemp
    },
    /**
     * Set the date from a typedDate event
     */
    setTypedDate(date) {
      this.setDate(date.getTime())
    },

    /**
     * Close all calendar layers
     * @param {Boolean} full - emit close event
     */
    close(full = false) {
      if (!this.isInline) {
        this.isOpen = false
        if (full) {
          this.$emit('closed')
        }
      }
    },
    /**
     * Initiate the component
     */
    init() {
      if (this.value) {
        this.setValue(this.value)
      }
    },
    onResetTypedDate(data) {
      this.resetTypedDate = data
    },
    onMonthChange(data) {
      this.$emit('changed-month', data)
    },
    onYearChange(data) {
      this.$emit('changed-year', data)
    },
    onSelectedDisabled(data) {
      this.$emit('selected-disabled', data)
    },
    onBlur() {
      this.$emit('blur')
    },
    onFocus() {
      this.$emit('focus')
    },
  },
}

</script>

<style lang="scss">
@import '../styles/style.scss';
</style>
