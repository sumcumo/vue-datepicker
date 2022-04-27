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
      @keydown.backspace="handleDelete"
      @keydown.delete="handleDelete"
      @keydown.down.prevent="handleKeydownDown"
      @keydown.enter.prevent="handleKeydownEnter"
      @keydown.esc.prevent="handleKeydownEscape"
      @keydown.space="handleKeydownSpace($event)"
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

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Translation } from '../../typings'
import DateUtils from '../utils/DateUtils'
import inputProps from '../mixins/inputProps.vue'

@Component({
  mixins: [inputProps],
})
export default class DateInput extends Vue {
  @Prop({ default: false }) isOpen: boolean

  @Prop({ default: null }) selectedDate: Date

  @Prop({ default: {} }) translation: Translation

  input: HTMLInputElement

  isInputFocused: boolean = false

  shouldToggleOnFocus: boolean = false

  shouldToggleOnClick: boolean = true

  typedDate: string = ''

  utils: DateUtils = new DateUtils(this.$props.useUtc)

  get computedInputClass() {
    const { inputClass } = this.$props

    if (this.$props.bootstrapStyling) {
      if (typeof inputClass === 'string') {
        return [inputClass, 'form-control'].join(' ')
      }
      return { 'form-control': true, ...inputClass }
    }

    return inputClass
  }

  get formattedValue() {
    if (this.$props.typeable) {
      return this.typedDate
    }

    return this.$props.formatDate(this.selectedDate)
  }

  @Watch('showCalendarOnFocus', { immediate: true })
  onShowCalendarOnFocus(showCalendarOnFocus: boolean) {
    if (showCalendarOnFocus) {
      this.shouldToggleOnFocus = !this.isOpen
    }
  }

  @Watch('isOpen')
  onIsOpenChanged(isOpen: boolean, wasOpen: boolean) {
    this.$nextTick(() => {
      if (this.$props.showCalendarOnFocus) {
        if (isOpen) {
          this.shouldToggleOnFocus = false
        }
        if (wasOpen && !this.isInputFocused) {
          this.shouldToggleOnFocus = true
        }
      }
    })
  }

  @Watch('selectedDate')
  onSelectedDateChanged(selectedDate: Date) {
    if (this.$props.typeable) {
      this.typedDate = this.formatDate(selectedDate)
    }
  }

  mounted() {
    this.input = this.$el.querySelector('input')!
  }

  /**
   * Emits a `clear-date` event
   */
  clearDate() {
    this.input.value = ''
    this.$emit('clear-date')
  }

  /**
   * Formats a date
   * @param date The date to be formatted
   */
  formatDate(date: Date) {
    if (!date) {
      return ''
    }

    const { format } = this.$props

    return typeof format === 'function'
      ? format(new Date(date))
      : this.utils.formatDate(new Date(date), format, this.translation)
  }

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
  }

  /**
   * Validate typedDate and emit a `blur` event
   */
  handleInputBlur() {
    if (this.$props.showCalendarOnFocus && !this.isOpen) {
      this.shouldToggleOnFocus = true
    }

    if (this.$props.typeable) {
      this.formatTypedDate()
    }
    this.isInputFocused = false
    this.$emit('blur')
  }

  /**
   * Resets `shouldToggleOnFocus` to true
   */
  handleButtonFocus() {
    if (this.$props.showCalendarOnFocus) {
      this.shouldToggleOnFocus = true
    }
  }

  /**
   * Clears the calendar when the `delete` or `backspace` key is pressed
   */
  handleDelete() {
    if (!this.$props.typeable && this.selectedDate) {
      this.clearDate()
    }
  }

  /**
   * Toggles the calendar (unless `show-calendar-on-button-click` is true)
   */
  handleInputClick() {
    if (this.$props.showCalendarOnButtonClick) return

    if (this.shouldToggleOnClick) {
      this.toggle()
    }
  }

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
  }

  /**
   * Opens the calendar, or sets the focus to the next focusable element down
   */
  handleKeydownDown() {
    if (!this.isOpen) {
      this.$emit('open')
    }

    if (!this.$props.typeable) {
      return
    }

    this.$emit('set-focus', ['prev', 'up', 'next', 'tabbableCell'])
  }

  /**
   * Selects a typed date and closes the calendar
   */
  handleKeydownEnter() {
    if (!this.$props.typeable) {
      return
    }

    if (!this.input.value) {
      this.$emit('select-typed-date', null)
      return
    }

    const parsedDate = this.parseInput()

    if (this.utils.isValidDate(parsedDate)) {
      this.$emit('select-typed-date', new Date(parsedDate))
    }
  }

  /**
   * Closes the calendar
   */
  handleKeydownEscape() {
    if (this.isOpen) {
      this.$emit('close')
    }
  }

  /**
   * Prevents scrolling when not typeable
   */
  handleKeydownSpace(event: KeyboardEvent) {
    if (!this.$props.typeable) {
      event.preventDefault()
    }
  }

  /**
   * Parses a typed date and emits `typed-date` event, if valid
   * @param  event Used to exclude certain keystrokes
   */
  handleKeyup(event: KeyboardEvent) {
    if (
      !this.$props.typeable ||
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
      this.$emit('typed-date', null)
      return
    }

    const parsedDate = this.parseInput()

    if (this.utils.isValidDate(parsedDate)) {
      this.$emit('typed-date', parsedDate)
    }
  }

  /**
   * Toggles the calendar unless a typed date has been entered or `show-calendar-on-button-click` is true
   */
  handleKeyupSpace(event: KeyboardEvent) {
    if (this.$props.typeable) {
      if (this.input.value === '') {
        this.toggle()
      }
      return
    }

    event.preventDefault()
    if (!this.$props.showCalendarOnButtonClick) {
      this.toggle()
    }
  }

  /**
   * Parses the value of the input field
   */
  parseInput() {
    return new Date(
      this.utils.parseDate(
        this.input.value.trim(),
        this.$props.format,
        this.translation,
        this.$props.parser,
      ),
    )
  }

  /**
   * Opens or closes the calendar
   */
  toggle(calendarButton?: string) {
    if (this.isOpen) {
      this.$emit('set-focus', [calendarButton || 'input'])
    }

    this.$emit(this.isOpen ? 'close' : 'open')
  }
}
</script>
