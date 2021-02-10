<template>
  <header v-if="config.showHeader">
    <button
      class="prev"
      :aria-label="`${config.isRtl ? 'next' : 'previous'} ${controlLabel}`"
      :class="{ disabled: isLeftNavDisabled }"
      @click="config.isRtl ? next() : previous()"
    >
      <slot name="prevIntervalBtn">
        <span class="default">&lt;</span>
      </slot>
    </button>
    <slot />
    <button
      class="next"
      :aria-label="`${config.isRtl ? 'previous' : 'next'} ${controlLabel}`"
      :class="{ disabled: isRightNavDisabled }"
      @click="config.isRtl ? previous() : next()"
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
    config: {
      type: Object,
      default() {
        return {
          showHeader: true,
          isRtl: false,
          isNextDisabled: false,
          isPreviousDisabled: false,
        }
      },
    },
    controlLabel: {
      type: String,
      default: null,
    },
    next: {
      type: Function,
      required: true,
    },
    previous: {
      type: Function,
      required: true,
    },
  },
  computed: {
    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled() {
      return this.config.isRtl
        ? this.config.isNextDisabled
        : this.config.isPreviousDisabled
    },
    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled() {
      return this.config.isRtl
        ? this.config.isPreviousDisabled
        : this.config.isNextDisabled
    },
  },
}
</script>
