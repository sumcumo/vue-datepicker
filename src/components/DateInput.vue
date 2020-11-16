<template>
  <div :class="{'input-group' : bootstrapStyling}">
    <slot name="beforeDateInput" />
    <!-- Calendar Button -->
    <button
      v-if="calendarButton"
      ref="calendarButton"
      :class="{'input-group-prepend' : bootstrapStyling, 'calendar-btn-disabled': disabled}"
      class="vdp-datepicker__calendar-button"
      :disabled="disabled"
      @blur="$emit('check-focus')"
      @click="toggleCalendarFromButton"
    >
      <span :class="{'input-group-text' : bootstrapStyling}">
        <i :class="calendarButtonIcon">
          {{ calendarButtonIconContent }}
          <span v-if="!calendarButtonIcon">
            &hellip;
          </span>
        </i>
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
      @keydown.space="showCalendarBySpace"
      @keydown.enter.prevent="showCalendarByEnter"
      @keydown.esc.prevent="clearDate"
      @focus="showCalendarByFocus"
      @keyup="parseTypedDate"
    >
    <!-- Clear Button -->
    <button
      v-if="clearButton && selectedDate"
      :class="{'input-group-append' : bootstrapStyling}"
      class="vdp-datepicker__clear-button"
      :disabled="disabled"
      @blur="$emit('check-focus')"
      @click="clearDate()"
    >
      <span :class="{'input-group-text' : bootstrapStyling}">
        <i :class="clearButtonIcon">
          <span v-if="!clearButtonIcon">
            &times;
          </span>
        </i>
      </span>
    </button>
    <slot name="afterDateInput" />
  </div>
</template>
<script>
import { makeDateUtils } from '~/utils/DateUtils'
import inputProps from '~/mixins/inputProps'

export default {
  name: 'DateInput',
  mixins: [
    inputProps,
  ],
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
      typedDate: '',
      utils: constructedDateUtils,
    }
  },
  computed: {
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
        : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation)
    },
  },
  watch: {
    resetTypedDate() {
      this.typedDate = ''
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
      this.input.value = ''
      this.$emit('clear-date')
    },
    /**
     * Submits a typed date if it's valid
     */
    inputBlurred() {
      if (this.typeable) {
        const parsableDate = this.parseDate(this.input.value)
        const parsedDate = Date.parse(parsableDate)

        if (Number.isNaN(parsedDate)) {
          this.clearDate()
        } else {
          this.input.value = this.formattedDate
          this.typedDate = ''
          this.$emit('typed-date', parsedDate)
        }
        this.$emit('close-calendar')
      }
      this.$emit('blur')
      this.$emit('check-focus')
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
    parseDate(value) {
      return this.utils.parseDate(
        value,
        this.format,
        this.translation,
        this.parser,
      )
    },
    toggleCalendar() {
      this.$emit(this.isOpen ? 'close-calendar' : 'show-calendar')
    },
    toggleCalendarFromButton() {
      this.toggleCalendar()
      this.$nextTick(() => {
        if (!this.isOpen) {
          this.$refs.calendarButton.focus()
        }
      })
    },
    showCalendarByButton() {
      if (!this.typeable) {
        this.toggleCalendar()
      }
    },
    showCalendarByClick() {
      if (!this.showCalendarOnButtonClick) {
        this.toggleCalendar()
      }
    },
    showCalendarByEnter() {
      if (this.typeable) {
        this.inputBlurred()
        return
      }
      if (!this.showCalendarOnButtonClick) {
        this.toggleCalendar()
      }
    },
    showCalendarByFocus() {
      if (this.showCalendarOnFocus) {
        this.$emit('show-calendar')
      }

      this.$emit('focus')
    },
    showCalendarBySpace() {
      if (!this.typeable && !this.showCalendarOnButtonClick) {
        this.toggleCalendar()
      }
    },
  },
}
</script>
