<template>
  <header :style="{ height: `${height}px` }">
    <button
      ref="prev"
      class="prev"
      :class="{ disabled: isPreviousDisabled, rtl: isRtl }"
      :disabled="isPreviousDisabled"
      data-test-previous-button
      :style="{ 'width': `${width / 7}px`, 'max-height': `${height}px` }"
      type="button"
      @click="$emit('page-change', previousPage)"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.enter.prevent="$emit('page-change', previousPage)"
      @keydown.esc.prevent="$emit('clear-date')"
      @keydown.up.prevent="focusInput"
      @keydown.left.prevent="arrowLeftPrev"
      @keydown.right.prevent="arrowRightPrev"
      @keyup.space.prevent="$emit('page-change', previousPage)"
    >
      <slot name="prevIntervalBtn">
        <span class="default">{{ isRtl ? '&gt;' : '&lt;' }}</span>
      </slot>
    </button>
    <slot />
    <button
      ref="next"
      class="next"
      :class="{ disabled: isNextDisabled, rtl: isRtl }"
      :disabled="isNextDisabled"
      data-test-next-button
      :style="{ 'width': `${width / 7}px`, 'max-height': `${height}px` }"
      type="button"
      @click="$emit('page-change', nextPage)"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.enter.prevent="$emit('page-change', nextPage)"
      @keydown.esc.prevent="$emit('clear-date')"
      @keydown.up.prevent="focusInput"
      @keydown.left.prevent="arrowLeftNext"
      @keydown.right.prevent="arrowRightNext"
      @keyup.space.prevent="$emit('page-change', nextPage)"
    >
      <slot name="nextIntervalBtn">
        <span class="default">{{ isRtl ? '&lt;' : '&gt;' }}</span>
      </slot>
    </button>
  </header>
</template>

<script>
export default {
  name: 'PickerHeader',
  props: {
    height: {
      type: Number,
      default: 40,
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
    isTypeable: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      previousPage: { incrementBy: -1, focusRefs: ['prev'] },
      nextPage: { incrementBy: 1, focusRefs: ['next'] },
    }
  },
  methods: {
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowLeftPrev() {
      if (this.isRtl) {
        this.$emit('set-focus', ['up', 'next', 'tabbable-cell'])
        return
      }
      this.$emit('page-change', this.previousPage)
    },
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowRightPrev() {
      if (this.isRtl) {
        this.$emit('page-change', this.previousPage)
        return
      }
      this.$emit('set-focus', ['up', 'next', 'tabbable-cell'])
    },
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowLeftNext() {
      if (this.isRtl) {
        this.$emit('page-change', this.nextPage)
        return
      }
      this.$emit('set-focus', ['up', 'prev', 'tabbable-cell'])
    },
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowRightNext() {
      if (this.isRtl) {
        this.$emit('set-focus', ['up', 'prev', 'tabbable-cell'])
        return
      }
      this.$emit('page-change', this.nextPage)
    },
    focusInput() {
      if (this.isTypeable) {
        this.$emit('set-focus', ['input'])
      }
    },
    focusTabbableCell() {
      this.$emit('reset-tabbable-cell')
      this.$emit('set-focus', ['tabbable-cell'])
    },
  },
}
</script>
