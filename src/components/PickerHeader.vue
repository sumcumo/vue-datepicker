<template>
  <header v-if="config.showHeader">
    <span
      class="prev"
      :class="{'disabled': isLeftNavDisabled}"
      @click="config.isRtl ? next() : previous()"
    >
      <slot name="prevIntervalBtn">
        <span class="default">&lt;</span>
      </slot>
    </span>
    <slot />
    <span
      class="next"
      :class="{'disabled': isRightNavDisabled}"
      @click="config.isRtl ? previous() : next()"
    >
      <slot name="nextIntervalBtn">
        <span class="default">&gt;</span>
      </slot>
    </span>
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
