<template>
  <button
    class="vdp-datepicker__up"
    data-test-up-button
    :disabled="isDisabled"
    type="button"
    @click="$emit('select')"
    @keydown.down.prevent="focusTabbableCell"
    @keydown.up.prevent="focusInput"
    @keydown.left.prevent="focusLeftButton"
    @keydown.right.prevent="focusRightButton"
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
  computed: {
    leftButton() {
      return [this.isRtl ? 'next' : 'prev']
    },
    rightButton() {
      return [this.isRtl ? 'prev' : 'next']
    },
  },
  methods: {
    focusInput() {
      this.$emit('focus-input')
    },
    focusTabbableCell() {
      this.$emit('set-focus', ['tabbableCell'])
    },
    focusLeftButton() {
      this.$emit('set-focus', this.leftButton)
    },
    focusRightButton() {
      this.$emit('set-focus', this.rightButton)
    },
  },
}
</script>
