<template>
  <header v-if="showHeader">
    <button
      ref="prev"
      class="prev"
      :disabled="isLeftNavDisabled"
      @blur="$emit('check-focus')"
      @click="isRtl ? next() : previous()"
      @keydown.down.prevent="$emit('focus-first-cell')"
      @keydown.left.prevent="isRtl ? focusUp('prev') : null"
      @keydown.right.prevent="isRtl ? null : focusUp('prev')"
    >
      <slot name="prevIntervalBtn">
        <span class="default">&lt;</span>
      </slot>
    </button>
    <slot />
    <button
      ref="next"
      class="next"
      :disabled="isRightNavDisabled"
      @blur="$emit('check-focus')"
      @click="isRtl ? previous() : next()"
      @keydown.down.prevent="$emit('focus-first-cell')"
      @keydown.left.prevent="isRtl ? null : focusUp('next')"
      @keydown.right.prevent="isRtl ? focusUp('next') : null"
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
      required: true,
    },
    next: {
      type: Function,
      required: true,
    },
    previous: {
      type: Function,
      required: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled() {
      return this.isRtl ? this.isNextDisabled : this.isPreviousDisabled
    },
    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled() {
      return this.isRtl ? this.isPreviousDisabled : this.isNextDisabled
    },
  },
  methods: {
    /**
     * Focus the up button, or if its disabled, skip to the other prev/next button
     */
    focusUp(fromButton) {
      if (!this.isUpDisabled) {
        this.$emit('focus-up-button')
        return
      }

      if (fromButton === 'prev') {
        this.$refs.next.focus()
      } else {
        this.$refs.prev.focus()
      }
    },
  },
}
</script>
