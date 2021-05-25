<template>
  <div
    :class="{ 'input-group': bootstrapStyling }"
    @keydown.tab="$emit('tab', $event)"
    @focusin="$emit('focusin', $event)"
  >
    <slot name="beforeDateInput" />
    <!-- Calendar Button -->
    <button
      v-if="calendarButton"
      ref="calendarButton"
      class="vdp-datepicker__calendar-button"
      :class="{ 'input-group-prepend': bootstrapStyling }"
      data-test-calendar-button
      :disabled="disabled"
      type="button"
      @click="toggle('calendarButton')"
      @focus="handleButtonFocus"
      @keydown.enter.prevent="toggle('calendarButton')"
      @keyup.space.prevent="toggle('calendarButton')"
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
      @keydown.down.prevent="handleKeydownDown"
      @keydown.esc.prevent="clearDateAndClose"
      @keydown.enter.prevent.stop="handleKeydownEnter"
      @keydown.space="handleKeydownSpace($event)"
      @keyup="handleKeyup($event)"
      @keyup.space="handleKeyupSpace($event)"
    />
    <!-- Clear Button -->
    <button
      v-if="clearButton && selectedDate"
      class="vdp-datepicker__clear-button"
      :class="{ 'input-group-append': bootstrapStyling }"
      data-test-clear-button
      :disabled="disabled"
      type="button"
      @click="clearDate"
      @keyup.space.prevent="clearDate"
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
      isInputFocused: false,
      shouldToggleOnFocus: false,
      shouldToggleOnClick: true,
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
      if (!this.selectedDate) {
        return null
      }

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

      if (this.typedDate && this.typedDate.length) {
        return this.typedDate
      }

      return this.formattedDate
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
        if (this.showCalendarOnFocus) {
          if (isOpen) {
            this.shouldToggleOnFocus = false
          }
          if (wasOpen && !this.isInputFocused) {
            this.shouldToggleOnFocus = true
          }
        }
      })
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
      this.$emit('clear-date')
    },
    /**
     * Emits `clear-date` and `close` events
     */
    clearDateAndClose() {
      this.clearDate()

      if (this.isOpen) {
        this.$emit('close')
      }
    },
    /**
     * Validate typedDate and emit a `blur` event
     */
    handleInputBlur() {
      if (this.showCalendarOnFocus && !this.isOpen) {
        this.shouldToggleOnFocus = true
      }

      this.isInputFocused = false
      this.validateTypedDate()
      this.$emit('blur')
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
     * Toggles the calendar (unless `show-calendar-on-button-click` is true)
     */
    handleInputClick() {
      if (this.showCalendarOnButtonClick) return

      if (this.shouldToggleOnClick) {
        this.toggle()
      }
    },
    /**
     * Emits a `focus` event and opens the calendar when `show-calendar-on-focus` is true
     */
    handleInputFocus() {
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

      this.$emit('focus')
    },
    /**
     * Opens the calendar - or - validates the typed date and sets the focus to the next focusable element down
     */
    handleKeydownDown() {
      if (!this.isOpen) {
        this.$emit('open')
      }

      if (!this.typeable) {
        return
      }

      this.validateTypedDate()
      this.$emit('set-focus', ['prev', 'up', 'next', 'tabbable-cell'])
    },
    /**
     * Submits a typed date
     */
    handleKeydownEnter() {
      if (this.typeable) {
        this.submitTypedDate()
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
     * Parses a typed date and submits it, if valid
     */
    handleKeyup(event) {
      if (!this.typeable || ['Tab', 'Shift'].includes(event.key)) {
        return
      }

      if (this.input.value === '') {
        this.$emit('typed-date', null)
        return
      }

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
     * Submits a typed date if it's valid
     */
    submitTypedDate() {
      if (Number.isNaN(this.parsedDate)) {
        this.clearDateAndClose()
        return
      }

      this.input.value = this.formattedDate
      this.typedDate = this.formattedDate
      this.$emit('typed-date', this.parsedDate)

      if (this.isOpen) {
        this.$emit('close')
      }
    },
    /**
     * Opens or closes the calendar
     */
    toggle(calendarButton) {
      if (this.isOpen) {
        this.$emit('set-focus', [calendarButton || 'input'])
      }

      this.$emit(this.isOpen ? 'close' : 'open')
    },
    /**
     * Formats a typed date, or clears it if invalid
     */
    validateTypedDate() {
      if (Number.isNaN(this.parsedDate)) {
        this.input.value = ''
        this.typedDate = ''
      } else {
        this.typedDate = this.formattedDate
      }
    },
  },
}
</script>
