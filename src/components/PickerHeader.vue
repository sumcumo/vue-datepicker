<template>
  <header>
    <button
      ref="prev"
      class="prev"
      :class="{ btn: bootstrapStyling, rtl: isRtl }"
      data-test-previous-button
      :disabled="isPreviousDisabled"
      type="button"
      @click="$emit('page-change', previousPage)"
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
      @click="$emit('page-change', nextPage)"
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
  data() {
    return {
      previousPage: { incrementBy: -1, focusRefs: ['prev'] },
      nextPage: { incrementBy: 1, focusRefs: ['next'] },
    }
  },
}
</script>
