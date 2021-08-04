<template>
  <div :class="{ 'input-group': bootstrapStyling }">
    <slot name="beforeDateInput" />
    <!-- Calendar Button -->
    <span
      v-if="calendarButton"
      class="vdp-datepicker__calendar-button"
      :class="{
        'input-group-prepend': bootstrapStyling,
        'calendar-btn-disabled': disabled,
      }"
      @click="toggle"
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
      :type="inline ? 'hidden' : null"
      :value="formattedValue"
      @blur="handleInputBlur"
      @click="handleInputClick"
      @focus="handleInputFocus"
      @keydown.enter.prevent="handleKeydownEnter"
      @keydown.escape.prevent="$emit('close')"
      @keyup="parseTypedDate"
    />
    <!-- Clear Button -->
    <span
      v-if="clearButton && selectedDate"
      class="vdp-datepicker__clear-button"
      :class="{ 'input-group-append': bootstrapStyling }"
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
    return {
      input: null,
      isFocusedUsed: false,
      isBlurred: false,
      typedDate: '',
      utils: makeDateUtils(this.useUtc),
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
    formattedDate() {
      return typeof this.format === 'function'
        ? this.format(new Date(this.selectedDate))
        : this.utils.formatDate(
            new Date(this.selectedDate),
            this.format,
            this.translation,
          )
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
  },
  mounted() {
    this.input = this.$el.querySelector('input')
  },
  methods: {
    /**
     * Emits a `clear-date` event
     */
    clearDate() {
      this.$emit('clear-date')
    },
    /**
     * Submit typedDate and emit a `blur` event
     */
    handleInputBlur() {
      this.isBlurred = this.isOpen
      if (this.typeable) {
        this.submitTypedDate()
      }
      this.$emit('blur')
      this.$emit('close')
      this.isFocusedUsed = false
    },
    /**
     * Toggles the calendar (unless `show-calendar-on-button-click` is true)
     */
    handleInputClick() {
      const isFocusedUsed = this.showCalendarOnFocus && !this.isFocusedUsed

      if (!this.showCalendarOnButtonClick && !isFocusedUsed) {
        this.toggle()
      }

      if (this.showCalendarOnFocus) {
        this.isFocusedUsed = true
      }
    },
    /**
     * Opens the calendar when `show-calendar-on-focus` is true
     */
    handleInputFocus() {
      if (this.showCalendarOnFocus) {
        this.$emit('open')
      }

      this.isBlurred = false
      this.$emit('focus')
    },
    /**
     * Submits a typed date
     */
    handleKeydownEnter() {
      if (this.typeable) {
        this.submitTypedDate()
      }
      this.$emit('close')
    },
    /**
     * Parses a date from a string
     * @param {String} value
     */
    parseDate(value) {
      return this.utils.parseDate(
        value,
        this.format,
        this.translation,
        this.parser,
      )
    },
    /**
     * Attempt to parse a typed date
     */
    parseTypedDate() {
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
    /**
     * Opens or closes the calendar
     */
    toggle() {
      if (!this.isOpen && this.isBlurred) {
        this.isBlurred = false
        return
      }
      this.$emit(this.isOpen ? 'close' : 'open')
    },
  },
}
</script>
