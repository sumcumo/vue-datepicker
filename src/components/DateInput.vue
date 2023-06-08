<template>
  <div :class="{ 'input-group': bootstrapStyling }">
    <slot name="beforeDateInput" />
    <!-- Calendar Button -->
    <button
      v-if="calendarButton"
      ref="calendarButton"
      class="vdp-datepicker__calendar-button"
      :class="{ 'btn input-group-prepend': bootstrapStyling }"
      data-test-calendar-button
      :disabled="disabled"
      type="button"
      @click="toggle('calendarButton')"
      @focus="handleButtonFocus"
    >
      <span :class="{ 'input-group-text': bootstrapStyling }">
        <slot name="calendarBtn">&hellip;</slot>
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
      @keydown.delete="handleDelete"
      @keydown.down.prevent="handleKeydownDown"
      @keydown.enter.prevent="handleKeydownEnter"
      @keydown.esc.prevent="handleKeydownEscape"
      @keydown.space="handleKeydownSpace($event)"
      @keydown.tab="$emit('tab', $event)"
      @keyup="handleKeyup($event)"
      @keyup.space="handleKeyupSpace($event)"
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
        <slot name="clearBtn">&times;</slot>
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
  emits: {
    blur: null,
    clearDate: null,
    close: null,
    focus: null,
    open: null,
    selectTypedDate: (date) => {
      return date === null || date instanceof Date
    },
    setFocus: (refArray) => {
      return refArray.every((ref) => {
        return [
          'calendarButton',
          'input',
          'prev',
          'up',
          'next',
          'tabbableCell',
        ].includes(ref)
      })
    },
    tab: null,
    typedDate: (date) => {
      return date === null || date instanceof Date
    },
  },
  data() {
    return {
      input: null,
      isInputFocused: false,
      shouldToggleOnFocus: false,
      shouldToggleOnClick: true,
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
    formattedValue() {
      if (this.typeable) {
        return this.typedDate
      }

      return this.formatDate(this.selectedDate)
    },
  },
  watch: {
    showCalendarOnFocus: {
      immediate: true,
      handler(showCalendarOnFocus) {
        if (showCalendarOnFocus) {
          this.shouldToggleOnFocus = !this.isOpen
        }
      },
    },
    isOpen(isOpen, wasOpen) {
      this.$nextTick(() => {
        if (isOpen && this.showCalendarOnFocus) {
          if (wasOpen && !this.isInputFocused) {
            this.shouldToggleOnFocus = true
            return
          }
          this.shouldToggleOnFocus = false
        }
      })
    },
    selectedDate: {
      immediate: true,
      handler(selectedDate) {
        if (this.typeable) {
          this.typedDate = this.formatDate(selectedDate)
        }
      },
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
      this.input.value = ''
      this.$emit('clearDate')
    },
    /**
     * Formats a date
     * @param {Date} date The date to be formatted
     * @returns {String}
     */
    formatDate(date) {
      if (!date) {
        return ''
      }

      return typeof this.format === 'function'
        ? this.format(new Date(date))
        : this.utils.formatDate(new Date(date), this.format, this.translation)
    },
    /**
     * Formats a typed date, or clears it if invalid
     */
    formatTypedDate() {
      const parsedDate = this.parseInput()

      if (this.utils.isValidDate(parsedDate)) {
        this.typedDate = this.formatDate(parsedDate)
      } else {
        this.input.value = ''
        this.typedDate = ''
      }
    },
    /**
     * Validates typedDate
     */
    handleInputBlur() {
      if (this.showCalendarOnFocus && !this.isOpen) {
        this.shouldToggleOnFocus = true
      }

      if (this.typeable) {
        this.formatTypedDate()
      }
      this.isInputFocused = false
    },
    /**
     * Resets `shouldToggleOnFocus` to true
     */
    handleButtonFocus() {
      if (this.showCalendarOnFocus) {
        this.shouldToggleOnFocus = true
      }
    },
    /**
     * Clears the calendar when the `delete` or `backspace` key is pressed
     */
    handleDelete() {
      if (!this.typeable && this.selectedDate) {
        this.clearDate()
      }
    },
    /**
     * Toggles the calendar (unless `show-calendar-on-button-click` is true)
     */
    handleInputClick() {
      if (this.showCalendarOnButtonClick) return

      if (this.shouldToggleOnClick) {
        this.toggle()
      }
    },
    /**
     * Opens the calendar when `show-calendar-on-focus` is true (unless `show-calendar-on-button-click` is true)
     */
    // eslint-disable-next-line complexity
    handleInputFocus() {
      if (this.showCalendarOnButtonClick) return

      this.isInputFocused = true

      if (!this.isOpen && this.shouldToggleOnFocus) {
        this.shouldToggleOnClick = false
      }

      if (this.shouldToggleOnFocus && !this.isOpen) {
        this.$emit('open')

        setTimeout(() => {
          this.shouldToggleOnClick = true
        }, 300)
      }
    },
    /**
     * Opens the calendar, or sets the focus to the next focusable element down
     */
    handleKeydownDown() {
      if (!this.isOpen) {
        this.$emit('open')
      }

      if (!this.typeable) {
        return
      }

      this.$emit('setFocus', ['prev', 'up', 'next', 'tabbableCell'])
    },
    /**
     * Selects a typed date and closes the calendar
     */
    handleKeydownEnter() {
      if (!this.typeable) {
        return
      }

      if (!this.input.value) {
        this.$emit('selectTypedDate', null)
        return
      }

      const parsedDate = this.parseInput()

      if (this.utils.isValidDate(parsedDate)) {
        this.$emit('selectTypedDate', parsedDate)
      }
    },
    /**
     * Closes the calendar
     */
    handleKeydownEscape() {
      if (this.isOpen) {
        this.$emit('close')
      }
    },
    /**
     * Prevents scrolling when not typeable
     */
    handleKeydownSpace(event) {
      if (!this.typeable) {
        event.preventDefault()
      }
    },
    /**
     * Parses a typed date and emits `typed-date` event, if valid
     * @param  {object}  event Used to exclude certain keystrokes
     */
    handleKeyup(event) {
      if (
        !this.typeable ||
        [
          'Control',
          'Escape',
          'Shift',
          'Tab',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
        ].includes(event.key)
      ) {
        return
      }

      this.typedDate = this.input.value

      if (!this.input.value) {
        this.$emit('typedDate', null)
        return
      }

      const parsedDate = this.parseInput()

      if (this.utils.isValidDate(parsedDate)) {
        this.$emit('typedDate', parsedDate)
      }
    },
    /**
     * Toggles the calendar unless a typed date has been entered or `show-calendar-on-button-click` is true
     */
    handleKeyupSpace(event) {
      if (this.typeable) {
        if (this.input.value === '') {
          this.toggle()
        }
        return
      }

      event.preventDefault()
      if (!this.showCalendarOnButtonClick) {
        this.toggle()
      }
    },
    /**
     * Parses the value of the input field
     */
    parseInput() {
      return new Date(
        this.utils.parseDate(
          this.input.value.trim(),
          this.format,
          this.translation,
          this.parser,
        ),
      )
    },
    /**
     * Opens or closes the calendar
     */
    toggle(calendarButton) {
      if (this.isOpen) {
        this.$emit('setFocus', [calendarButton || 'input'])
      }

      this.$emit(this.isOpen ? 'close' : 'open')
    },
  },
}
</script>
