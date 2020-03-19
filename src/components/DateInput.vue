<template>
  <div :class="{'input-group' : bootstrapStyling}">
    <slot name="beforeDateInput" />
    <!-- Calendar Button -->
    <span
      v-if="calendarButton"
      :class="{'input-group-prepend' : bootstrapStyling}"
      :style="{'cursor:not-allowed;' : disabled}"
      class="vdp-datepicker__calendar-button"
      @click="showCalendar(true)"
    >
      <span :class="{'input-group-text' : bootstrapStyling}">
        <i :class="calendarButtonIcon">
          {{ calendarButtonIconContent }}
          <span v-if="!calendarButtonIcon">
            &hellip;
          </span>
        </i>
      </span>
    </span>
    <!-- Input -->
    <input
      :id="id"
      :ref="refName"
      :type="inline ? 'hidden' : 'text'"
      :class="computedInputClass"
      :name="name"
      :value="formattedValue"
      :open-date="openDate"
      :placeholder="placeholder"
      :clear-button="clearButton"
      :disabled="disabled"
      :required="required"
      :readonly="!typeable"
      :tabindex="tabindex"
      autocomplete="off"
      @click="showCalendar(false)"
      @focus="showFocusCalendar"
      @keyup="parseTypedDate"
      @blur="inputBlurred"
    >
    <!-- Clear Button -->
    <span
      v-if="clearButton && selectedDate"
      :class="{'input-group-append' : bootstrapStyling}"
      class="vdp-datepicker__clear-button"
      @click="clearDate()"
    >
      <span :class="{'input-group-text' : bootstrapStyling}">
        <i :class="clearButtonIcon">
          <span v-if="!clearButtonIcon">
            &times;
          </span>
        </i>
      </span>
    </span>
    <slot name="afterDateInput" />
  </div>
</template>
<script>
import { makeDateUtils } from '~/utils/DateUtils'
import inputProps from '~/mixins/inputProps'

export default {
  mixins: [
    inputProps,
  ],
  props: {
    selectedDate: {
      type: Date,
      default: null,
    },
    resetTypedDate: {
      type: [Date],
      default: null,
    },
    translation: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    const constructedDateUtils = makeDateUtils(this.useUtc)
    return {
      input: null,
      typedDate: false,
      utils: constructedDateUtils,
    }
  },
  computed: {
    formattedValue() {
      if (!this.selectedDate) {
        return null
      }
      if (this.typedDate) {
        return this.typedDate
      }
      return typeof this.format === 'function'
        ? this.format(this.selectedDate)
        : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation)
    },

    computedInputClass() {
      if (this.bootstrapStyling) {
        if (typeof this.inputClass === 'string') {
          return [
            this.inputClass,
            'form-control',
          ].join(' ')
        }
        return { 'form-control': true, ...this.inputClass }
      }
      return this.inputClass
    },
  },
  watch: {
    resetTypedDate() {
      this.typedDate = false
    },
  },
  mounted() {
    this.input = this.$el.querySelector('input')
  },
  methods: {
    showCalendar(isButton) {
      // prevent to emit the event twice if we are listening focus
      if (!this.showCalendarOnFocus) {
        if (
          !this.showCalendarOnButtonClick
          || (
            this.showCalendarOnButtonClick
            && this.calendarButton
            && isButton
          )
        ) {
          this.$emit('show-calendar')
        }
      }
    },
    showFocusCalendar() {
      if (this.showCalendarOnFocus) {
        this.$emit('show-calendar', true)
      }

      this.$emit('focus')
    },
    /**
     * Attempt to parse a typed date
     * @param {Event} event
     */
    parseTypedDate(event) {
      // close calendar if escape or enter are pressed
      if ([
        27, // escape
        13, // enter
      ].indexOf(event.keyCode) !== -1) {
        this.input.blur()
      }

      if (this.typeable) {
        const parsableDate = this.parsableDate(this.input.value, this.format)
        const parsedDate = Date.parse(parsableDate)
        if (!Number.isNaN(parsedDate)) {
          this.typedDate = this.input.value
          this.$emit('typed-date', new Date(parsedDate))
        }
      }
    },
    /**
     * nullify the typed date to defer to regular formatting
     * called once the input is blurred
     */
    inputBlurred() {
      const parsableDate = this.parsableDate(this.input.value, this.format)
      if (this.typeable && Number.isNaN(Date.parse(parsableDate))) {
        this.clearDate()
        this.input.value = null
        this.typedDate = null
      }
      this.$emit('blur')
      this.$emit('close-calendar')
    },
    /**
     * emit a clearDate event
     */
    clearDate() {
      this.$emit('clear-date')
    },
    /**
     * makes date parseable
     * to use with international dates
     */
    parsableDate(dateStr, formatStr) {
      if (!(dateStr && formatStr)) {
        return dateStr
      }
      if (typeof formatStr === 'function') {
        return formatStr(dateStr)
      }
      const splitter = formatStr.match(/-|\/|\s|\./) || ['-']
      const df = formatStr.split(splitter[0])
      const ds = dateStr.split(splitter[0])
      const ymd = [
        0,
        0,
        0,
      ]
      for (let i = 0; i < df.length; i += 1) {
        if (/yyyy/i.test(df[i])) {
          ymd[0] = ds[i]
        } else if (/mm/i.test(df[i])) {
          ymd[1] = ds[i]
        } else if (/m/i.test(df[i])) {
          ymd[1] = ds[i]
        } else if (/dd/i.test(df[i])) {
          ymd[2] = ds[i]
        } else if (/d/i.test(df[i])) {
          ymd[2] = ds[i]
        }
      }
      const dat = `${ymd.join('-')}T00:00:00Z`
      if (Number.isNaN(Date.parse(dat))) {
        return dateStr
      }
      return dat
    },
  },
}
</script>
