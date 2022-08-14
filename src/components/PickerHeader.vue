<template>
  <header>
    <button
      ref="prev"
      class="prev"
      :class="{ btn: bootstrapStyling, rtl: isRtl }"
      data-test-previous-button
      :disabled="isPreviousDisabled"
      type="button"
      @click.stop="goToPreviousPage"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.up.prevent="focusInput"
      @keydown.left.prevent="arrowLeftPrev"
      @keydown.right.prevent="arrowRightPrev"
    >
      <slot name="prevIntervalBtn">
        <span class="default">&lt;</span>
      </slot>
    </button>
    <button
      ref="up"
      class="vdp-datepicker__up"
      :class="{ btn: bootstrapStyling }"
      data-test-up-button
      :disabled="isUpDisabled"
      type="button"
      @click="selectUpButton"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.up.prevent="focusInput"
      @keydown.left.prevent="focusLeftButton"
      @keydown.right.prevent="focusRightButton"
    >
      <slot />
    </button>
    <button
      ref="next"
      class="next"
      :class="{ btn: bootstrapStyling, rtl: isRtl }"
      data-test-next-button
      :disabled="isNextDisabled"
      type="button"
      @click.stop="goToNextPage"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.up.prevent="focusInput"
      @keydown.left.prevent="arrowLeftNext"
      @keydown.right.prevent="arrowRightNext"
    >
      <slot name="nextIntervalBtn">
        <span class="default">&gt;</span>
      </slot>
    </button>
  </header>
</template>

<script>
export default {
  name: 'PickerHeader',
  props: {
    bootstrapStyling: {
      type: Boolean,
      default: false,
    },
    isNextDisabled: {
      type: Boolean,
      required: true,
    },
    isPreviousDisabled: {
      type: Boolean,
      required: true,
    },
    isRtl: {
      type: Boolean,
      required: true,
    },
    isUpDisabled: {
      type: Boolean,
      default: false,
    },
    nextViewUp: {
      type: String,
      default: null,
    },
  },
  computed: {
    leftButton() {
      return [this.isRtl ? 'next' : 'prev']
    },
    rightButton() {
      return [this.isRtl ? 'prev' : 'next']
    },
  },
  methods: {
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowLeftPrev() {
      if (this.isRtl) {
        this.$emit('set-focus', ['up', 'next', 'tabbableCell'])
        return
      }
      this.goToPreviousPage()
    },
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowRightPrev() {
      if (this.isRtl) {
        this.goToPreviousPage()
        return
      }
      this.$emit('set-focus', ['up', 'next', 'tabbableCell'])
    },
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowLeftNext() {
      if (this.isRtl) {
        this.goToNextPage()
        return
      }
      this.$emit('set-focus', ['up', 'prev', 'tabbableCell'])
    },
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowRightNext() {
      if (this.isRtl) {
        this.$emit('set-focus', ['up', 'prev', 'tabbableCell'])
        return
      }
      this.goToNextPage()
    },
    focusInput() {
      this.$emit('focus-input')
    },
    focusTabbableCell() {
      this.$emit('set-focus', ['tabbableCell'])
    },
    focusLeftButton() {
      this.$emit('set-focus', this.leftButton)
    },
    focusRightButton() {
      this.$emit('set-focus', this.rightButton)
    },
    goToNextPage() {
      this.$emit('page-change', { incrementBy: 1, focusRefs: ['next'] })
    },
    goToPreviousPage() {
      this.$emit('page-change', { incrementBy: -1, focusRefs: ['prev'] })
    },
    selectUpButton() {
      if (!this.isUpDisabled) {
        this.$emit('set-view', this.nextViewUp)
      }
    },
  },
}
</script>
