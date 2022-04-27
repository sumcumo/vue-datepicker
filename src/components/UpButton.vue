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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class UpButton extends Vue {
  @Prop({ default: false }) isDisabled: boolean

  @Prop({ required: true }) isRtl: boolean
}
</script>
