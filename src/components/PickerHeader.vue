<template>
  <header v-if="showHeader">
    <button
      ref="prev"
      :class="isRtl ? 'next' : 'prev'"
      :disabled="isLeftNavDisabled"
      @blur="$emit('check-focus')"
      @click="$emit('previous', (viaClick = true))"
      @keydown.down.prevent="$emit('focus-first-cell')"
      @keydown.left.prevent="isRtl ? focusUpFrom('prev') : null"
      @keydown.right.prevent="isRtl ? null : focusUpFrom('prev')"
    >
      <slot name="prevIntervalBtn">
        <span class="default">&lt;</span>
      </slot>
    </button>
    <slot />
    <button
      ref="next"
      :class="isRtl ? 'prev' : 'next'"
      :disabled="isRightNavDisabled"
      @blur="$emit('check-focus')"
      @click="$emit('next', (viaClick = true))"
      @keydown.down.prevent="$emit('focus-first-cell')"
      @keydown.left.prevent="isRtl ? null : focusUpFrom('next')"
      @keydown.right.prevent="isRtl ? focusUpFrom('next') : null"
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
     * Focus the up button, or if it is disabled, skip to the prev/next button
     */
    focusUpFrom(button) {
      if (!this.isUpDisabled) {
        this.$emit('focus-up-button')
        return
      }

      if (button === 'prev') {
        this.$refs.next.focus()
      } else {
        this.$refs.prev.focus()
      }
    },
  },
}
</script>
