<template>
  <button
    class="vdp-datepicker__up"
    data-test-up-button
    :disabled="isDisabled"
    type="button"
    @click="$emit('select')"
    @keydown.down.prevent="$emit('set-focus', ['tabbableCell'])"
    @keydown.up.prevent="$emit('focus-input')"
    @keydown.left.prevent="$emit('set-focus', [isRtl ? 'next' : 'prev'])"
    @keydown.right.prevent="$emit('set-focus', [isRtl ? 'prev' : 'next'])"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'UpButton',
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isRtl: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
