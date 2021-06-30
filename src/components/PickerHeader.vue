<template>
  <header>
    <span
      class="prev"
      :class="{ disabled: isPreviousDisabled, rtl: isRtl }"
      @click="isPreviousDisabled ? null : $emit('page-change', -1)"
    >
      <slot name="prevIntervalBtn">
        <span class="default">&lt;</span>
      </slot>
    </span>
    <slot />
    <span
      class="next"
      :class="{ disabled: isNextDisabled, rtl: isRtl }"
      @click="isNextDisabled ? null : $emit('page-change', 1)"
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
}
</script>
