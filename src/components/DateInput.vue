<template>
  <div :class="{ 'input-group': bootstrapStyling }">
    <slot name="beforeDateInput" />
    <!-- Calendar Button -->
    <span
      v-if="calendarButton"
      :class="{
        'input-group-prepend': bootstrapStyling,
        'calendar-btn-disabled': disabled,
      }"
      class="vdp-datepicker__calendar-button"
      @click="toggleCalendar"
    >
      <span :class="{ 'input-group-text': bootstrapStyling }">
        <slot name="calendarBtn">
          <i :class="calendarButtonIcon">
            {{ calendarButtonIconContent }}
            <span v-if="!calendarButtonIcon">&hellip;</span>
          </i>
        </slot>
      </span>
    </span>
    <!-- Input -->
    <input
      :id="id"
      :ref="refName"
      autocomplete="off"
      :autofocus="autofocus"
      :class="computedInputClass"
      :clear-button="clearButton"
      :disabled="disabled"
      :maxlength="maxlength"
      :name="name"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="!typeable"
      :required="required"
      :tabindex="tabindex"
      :type="inline ? 'hidden' : 'text'"
      :value="formattedValue"
      @blur="inputBlurred"
      @click="showCalendarByClick"
      @focus="showCalendarByFocus"
      @keyup="parseTypedDate"
    />
    <!-- Clear Button -->
    <span
      v-if="clearButton && selectedDate"
      :class="{ 'input-group-append': bootstrapStyling }"
      class="vdp-datepicker__clear-button"
      @click="clearDate()"
    >
      <span :class="{ 'input-group-text': bootstrapStyling }">
        <slot name="clearBtn">
          <i :class="clearButtonIcon">
            <span v-if="!clearButtonIcon">&times;</span>
          </i>
        </slot>
      </span>
    </span>
    <slot name="afterDateInput" />
  </div>
</template>
<script>
import makeDateUtils from '~/utils/DateUtils'
import inputProps from '~/mixins/inputProps.vue'

export default {
  name: 'DateInput',
  mixins: [inputProps],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    resetTypedDate: {
      type: [Date],
      default: null,
    },
    selectedDate: {
      type: Date,
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
      inputFocusOpensCalendar: true,
      isInputFocused: false,
      typedDate: '',
      utils: constructedDateUtils,
    }
  },
  computed: {
    computedInputClass() {
      if (this.bootstrapStyling) {
        if (typeof this.inputClass === 'string') {
          return [this.inputClass, 'form-control'].join(' ')
        }
        return { 'form-control': true, ...this.inputClass }
      }
      return this.inputClass
    },
    formattedValue() {
      if (!this.selectedDate) {
        return null
      }
      if (this.typedDate.length) {
        return this.typedDate
      }
      return this.formattedDate
    },
    formattedDate() {
      return typeof this.format === 'function'
        ? this.format(new Date(this.selectedDate))
        : this.utils.formatDate(
            new Date(this.selectedDate),
            this.format,
            this.translation,
          )
    },
  },
  watch: {
    resetTypedDate() {
      this.typedDate = ''
    },
    isInputFocused: {
      immediate: true,
      handler() {
        this.setInputIsFocused()
        this.setInputFocusOpensCalendar()
      },
    },
  },
  mounted() {
    this.input = this.$el.querySelector('input')
  },
  methods: {
    /**
     * emit a clearDate event
     */
    clearDate() {
      this.$emit('clear-date')
    },
    /**
     * submit typedDate and emit a blur event
     */
    inputBlurred() {
      if (this.typeable) {
        this.submitTypedDate()
      }

      this.$emit('blur')
      this.setInputIsFocused()
      this.$emit('close-calendar')
    },
    /**
     * Attempt to parse a typed date
     * @param {Event} event
     */
    parseTypedDate(event) {
      const code = event.keyCode ? event.keyCode : event.which
      // close calendar if escape or enter are pressed
      if (
        [
          27, // escape
          13, // enter
        ].indexOf(code) !== -1
      ) {
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
    parseDate(value) {
      return this.utils.parseDate(
        value,
        this.format,
        this.translation,
        this.parser,
      )
    },
    setInputIsFocused() {
      const input = this.$refs[this.refName]

      if (input) {
        this.isInputFocused = input.matches(':focus')
      }
    },
    setInputFocusOpensCalendar() {
      this.inputFocusOpensCalendar =
        !this.showCalendarOnButtonClick &&
        (this.showCalendarOnFocus ||
          (!this.showCalendarOnFocus && !this.isInputFocused))
    },
    showCalendarByClick() {
      if (this.inputFocusOpensCalendar && !this.isOpen) {
        this.$emit('show-calendar')
      }
    },
    showCalendarByFocus() {
      if (this.showCalendarOnFocus && this.inputFocusOpensCalendar) {
        this.$emit('show-calendar')
      }

      this.$emit('focus')
    },
    /**
     * Submits a typed date if it's valid
     */
    submitTypedDate() {
      const parsableDate = this.parseDate(this.input.value)
      const parsedDate = Date.parse(parsableDate)

      if (Number.isNaN(parsedDate)) {
        this.clearDate()
      } else {
        this.input.value = this.formattedDate
        this.typedDate = ''
        this.$emit('typed-date', parsedDate)
      }
    },
    toggleCalendar() {
      this.$emit(this.isOpen ? 'close-calendar' : 'show-calendar')
    },
  },
}
</script>
