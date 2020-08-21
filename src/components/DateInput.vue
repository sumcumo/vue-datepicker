<template>
  <div :class="{'input-group' : bootstrapStyling}">
    <slot name="beforeDateInput" />
    <!-- Calendar Button -->
    <span
      v-if="calendarButton"
      :class="{'input-group-prepend' : bootstrapStyling, 'calendar-btn-disabled': disabled}"
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
      :autofocus="autofocus"
      :maxlength="maxlength"
      :pattern="pattern"
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
import sharedProps from '~/mixins/sharedProps'

export default {
  name: 'DatepickerInput',
  mixins: [
    inputProps,
    sharedProps,
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
        ? this.format(new Date(this.selectedDate))
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
      const code = (event.keyCode ? event.keyCode : event.which)
      // close calendar if escape or enter are pressed
      if ([
        27, // escape
        13, // enter
      ].indexOf(code) !== -1) {
        this.input.blur()
      }

      if (this.typeable) {
        const parsableDate = this.parseDate(this.input.value)
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
      const parsableDate = this.parseDate(this.input.value)
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
    parseDate(value) {
      return this.utils.parseDate(
        value,
        this.format,
        this.translation,
        this.parser,
      )
    },
  },
}
</script>
