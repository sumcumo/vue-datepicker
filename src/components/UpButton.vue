<template>
  <button
    class="up"
    :disabled="isDisabled"
    @blur="emitCheckFocus"
    @click="$emit('next-view-up')"
    @keydown.down.prevent="$emit('focus-first-cell')"
    @keydown.left.prevent="$emit('focus-nav', isRtl ? 'next' : 'prev')"
    @keydown.right.prevent="$emit('focus-nav', isRtl ? 'prev' : 'next')"
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
      default: false,
    },
    isTypeable: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    emitCheckFocus() {
      if (!this.isTypeable) {
        this.$emit('check-focus')
      }
    },
  },
}
</script>
