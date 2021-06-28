<template>
  <header>
    <span
      class="prev"
      :class="{ disabled: isLeftNavDisabled }"
      @click="$emit('page-change', -1)"
    >
      <slot name="prevIntervalBtn">
        <span class="default">&lt;</span>
      </slot>
    </span>
    <slot />
    <span
      class="next"
      :class="{ disabled: isRightNavDisabled }"
      @click="$emit('page-change', 1)"
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
  computed: {
    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    /* istanbul ignore next */
    isLeftNavDisabled() {
      return this.isRtl ? this.isNextDisabled : this.isPreviousDisabled
    },
    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    /* istanbul ignore next */
    isRightNavDisabled() {
      return this.isRtl ? this.isPreviousDisabled : this.isNextDisabled
    },
  },
}
</script>
