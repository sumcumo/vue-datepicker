<template>
  <div :class="{ 'input-group': bootstrapStyling }">
    <slot name="beforeDateInput" />
    <!-- Calendar Button -->
    <button
      v-if="calendarButton"
      ref="calendarButton"
      :class="{ 'input-group-prepend': bootstrapStyling }"
      class="vdp-datepicker__calendar-button"
      :disabled="disabled"
      @blur="$emit('check-focus')"
      @click="toggleFromButton"
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
      @blur="inputBlurred"
      @click="toggleByClick"
      @keydown.space="openBySpace"
      @keydown.enter.prevent="openByEnter"
      @keydown.esc.prevent="clearDate"
      @focus="openByFocus"
      @keyup="parseTypedDate"
    />
    <!-- Clear Button -->
    <button
      v-if="clearButton && selectedDate"
      :class="{ 'input-group-append': bootstrapStyling }"
      class="vdp-datepicker__clear-button"
      :disabled="disabled"
      @blur="$emit('check-focus')"
      @click="clearDate()"
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
        const parsedDate = Date.parse(this.parseDate(this.input.value))

        if (Number.isNaN(parsedDate)) {
          this.clearDate()
        } else {
          this.input.value = this.formattedDate
          this.typedDate = ''
          this.$emit('typed-date', parsedDate)
        }
        this.$emit('close')
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
    toggle() {
      this.$emit(this.isOpen ? 'close' : 'open')
    },
    toggleFromButton() {
      this.$emit(this.isOpen ? 'close' : 'open', 'calendarButton')
      this.$nextTick(() => {
        if (!this.isOpen) {
          this.$refs.calendarButton.focus()
        }
      })
    },
    toggleByClick() {
      if (!this.showCalendarOnButtonClick) {
        this.$emit(this.isOpen ? 'close' : 'open', this.refName)
      }
    },
    openByEnter() {
      if (this.typeable) {
        this.inputBlurred()
        return
      }
      if (!this.showCalendarOnButtonClick) {
        this.toggle()
      }
    },
    openByFocus() {
      if (this.showCalendarOnFocus) {
        this.$emit('open')
        return
      }

      this.$emit('focus')
    },
    openBySpace() {
      if (!this.typeable && !this.showCalendarOnButtonClick) {
        this.toggle()
      }
    },
  },
}
</script>
