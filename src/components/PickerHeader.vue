<template>
  <header v-if="config.showHeader">
    <button
      ref="prev"
      class="prev"
      :class="{'disabled': leftNavIsDisabled}"
      @click="config.isRtl ? next() : previous()"
      @keydown.down.prevent="$emit('focus-first-cell')"
      @keydown.left.prevent="config.isRtl ? focusUp('prev') : ''"
      @keydown.right.prevent="config.isRtl ? '' : focusUp('prev')"
    >
      <slot name="prevIntervalBtn">
        <span class="default">&lt;</span>
      </slot>
    </button>
    <slot />
    <button
      ref="next"
      class="next"
      :class="{'disabled': rightNavIsDisabled}"
      @click="config.isRtl ? previous() : next()"
      @keydown.down.prevent="$emit('focus-first-cell')"
      @keydown.left.prevent="config.isRtl ? '' : focusUp('next')"
      @keydown.right.prevent="config.isRtl ? focusUp('next') : ''"
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
    config: {
      type: Object,
      default() {
        return {
          showHeader: true,
          isRtl: false,
          nextIsDisabled: false,
          previousIsDisabled: false,
          upIsDisabled: false,
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
    leftNavIsDisabled() {
      return this.config.isRtl
        ? this.config.nextIsDisabled
        : this.config.previousIsDisabled
    },
    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    rightNavIsDisabled() {
      return this.config.isRtl
        ? this.config.previousIsDisabled
        : this.config.nextIsDisabled
    },
  },
  methods: {
    focusUp(fromButton) {
      if (!this.config.upIsDisabled) {
        this.$emit('focus-up-button')
        return
      }

      if (fromButton === 'prev') {
        this.$refs.next.focus()
      } else {
        this.$refs.prev.focus()
      }
    },
  },
}
</script>
