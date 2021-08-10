<template>
  <div :class="{ 'input-group': bootstrapStyling }">
    <slot name="beforeDateInput" />
    <!-- Calendar Button -->
    <button
      v-if="calendarButton"
      class="vdp-datepicker__calendar-button"
      :class="{ 'btn input-group-prepend': bootstrapStyling }"
      data-test-calendar-button
      :disabled="disabled"
      type="button"
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
    </button>
    <!-- Input -->
    <input
      :id="id"
      :ref="refName"
      autocomplete="off"
      :autofocus="autofocus"
      :class="computedInputClass"
      :clear-button="clearButton"
      data-test-input
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
      @keyup="handleKeyup"
    />
    <!-- Clear Button -->
    <button
      v-if="clearButton && selectedDate"
      class="vdp-datepicker__clear-button"
      :class="{ 'btn input-group-append': bootstrapStyling }"
      data-test-clear-button
      :disabled="disabled"
      type="button"
      @click="clearDate"
    >
      <span :class="{ 'input-group-text': bootstrapStyling }">
        <slot name="clearBtn">
          <i :class="clearButtonIcon">
            <span v-if="!clearButtonIcon">&times;</span>
          </i>
        </slot>
      </span>
    </button>
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
      parsedDate: null,
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
     * Formats a typed date, or clears it if invalid
     */
    formatTypedDate() {
      if (Number.isNaN(this.parsedDate)) {
        this.input.value = ''
        this.typedDate = ''
      } else {
        this.typedDate = this.formattedDate
      }
    },
    /**
     * Validate typedDate and emit a `blur` event
     */
    handleInputBlur() {
      this.isBlurred = this.isOpen
      if (this.typeable) {
        this.formatTypedDate()
      }
      this.$emit('blur')
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
     * Formats a typed date and closes the calendar
     */
    handleKeydownEnter() {
      if (!this.typeable) {
        return
      }

      this.formatTypedDate()

      if (this.isOpen) {
        this.$emit('close')
      }
    },
    /**
     * Parses a typed date and submits it, if valid
     */
    handleKeyup() {
      this.parsedDate = Date.parse(
        this.utils.parseDate(
          this.input.value,
          this.format,
          this.translation,
          this.parser,
        ),
      )

      if (!Number.isNaN(this.parsedDate)) {
        this.typedDate = this.input.value
        this.$emit('typed-date', new Date(this.parsedDate))
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
