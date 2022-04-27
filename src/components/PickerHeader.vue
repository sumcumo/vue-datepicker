<template>
  <header>
    <button
      ref="prev"
      class="prev"
      :class="{ btn: bootstrapStyling, rtl: isRtl }"
      data-test-previous-button
      :disabled="isPreviousDisabled"
      type="button"
      @click.stop="$emit('page-change', previousPage)"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.up.prevent="$emit('focus-input')"
      @keydown.left.prevent="arrowLeftPrev"
      @keydown.right.prevent="arrowRightPrev"
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
      @click.stop="$emit('page-change', nextPage)"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.up.prevent="$emit('focus-input')"
      @keydown.left.prevent="arrowLeftNext"
      @keydown.right.prevent="arrowRightNext"
    >
      <slot name="nextIntervalBtn">
        <span class="default">&gt;</span>
      </slot>
    </button>
  </header>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class PickerHeader extends Vue {
  @Prop({ default: false }) bootstrapStyling: boolean

  @Prop({ required: true }) isNextDisabled: boolean

  @Prop({ required: true }) isPreviousDisabled: boolean

  @Prop({ required: true }) isRtl: boolean

  previousPage: { incrementBy: -1; focusRefs: ['prev'] }

  nextPage: { incrementBy: 1; focusRefs: ['next'] }

  /**
   * Changes the page, or sets focus to the adjacent button
   */
  arrowLeftPrev() {
    if (this.isRtl) {
      this.$emit('set-focus', ['up', 'next', 'tabbableCell'])
      return
    }
    this.$emit('page-change', this.previousPage)
  }

  /**
   * Changes the page, or sets focus to the adjacent button
   */
  arrowRightPrev() {
    if (this.isRtl) {
      this.$emit('page-change', this.previousPage)
      return
    }
    this.$emit('set-focus', ['up', 'next', 'tabbableCell'])
  }

  /**
   * Changes the page, or sets focus to the adjacent button
   */
  arrowLeftNext() {
    if (this.isRtl) {
      this.$emit('page-change', this.nextPage)
      return
    }
    this.$emit('set-focus', ['up', 'prev', 'tabbableCell'])
  }

  /**
   * Changes the page, or sets focus to the adjacent button
   */
  arrowRightNext() {
    if (this.isRtl) {
      this.$emit('set-focus', ['up', 'prev', 'tabbableCell'])
      return
    }
    this.$emit('page-change', this.nextPage)
  }

  focusTabbableCell() {
    this.$emit('set-focus', ['tabbableCell'])
  }
}
</script>
