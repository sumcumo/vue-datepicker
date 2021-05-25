<template>
  <button
    class="up"
    data-test-up-button
    :disabled="isDisabled"
    type="button"
    @click="$emit('select')"
    @keydown.down.prevent="$emit('set-focus', ['tabbable-cell'])"
    @keydown.esc.prevent="$emit('clear-date')"
    @keydown.enter.prevent="$emit('select')"
    @keydown.up.prevent="isTypeable ? $emit('set-focus', ['input']) : null"
    @keydown.left.prevent="$emit('set-focus', [isRtl ? 'next' : 'prev'])"
    @keydown.right.prevent="$emit('set-focus', [isRtl ? 'prev' : 'next'])"
    @keyup.space.prevent="$emit('select')"
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
    isTypeable: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
