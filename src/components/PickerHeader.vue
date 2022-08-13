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
    <slot />
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
    goToNextPage() {
      this.$emit('page-change', { incrementBy: 1, focusRefs: ['next'] })
    },
    goToPreviousPage() {
      this.$emit('page-change', { incrementBy: -1, focusRefs: ['prev'] })
    },
  },
}
</script>
