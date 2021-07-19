<script>
import { getPopupElementSize, getRelativePosition } from '~/utils/dom'

export default {
  name: 'Popup',
  props: {
    appendToBody: {
      type: Boolean,
      default: true,
    },
    fixedPosition: {
      type: String,
      default: '',
    },
    inline: {
      type: Boolean,
      default: false,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    view: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      popupRect: null,
    }
  },
  watch: {
    view: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (val) {
            this.displayPopup()
          }
        })
      },
    },
  },
  mounted() {
    if (this.inline) {
      return
    }
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
  },
  beforeDestroy() {
    if (this.inline) {
      return
    }
    if (this.appendToBody && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    /**
     * Adjusts the popup's `top` style attribute when `append-to-body` is true
     */
    setTopStyle() {
      if (this.appendToBody) {
        const relativeRect = this.$parent.$el.getBoundingClientRect()
        this.$el.style.top = `${relativeRect.bottom + window.scrollY}px`
      }
    },
    /**
     * Sets the `left` and `top` style attributes of the popup
     */
    // eslint-disable-next-line max-statements
    displayPopup() {
      if (this.inline || !this.view) return
      this.setTopStyle()
      const popup = this.$el
      const relativeElement = this.$parent.$el

      this.popupRect = getPopupElementSize(popup.children[1])
      const { width, height } = this.popupRect
      const { left, top } = getRelativePosition({
        el: popup,
        elRelative: relativeElement,
        targetWidth: width,
        targetHeight: height,
        appendToBody: this.appendToBody,
        fixedPosition: this.fixedPosition,
        rtl: this.rtl,
      })

      this.$emit('popup-height-change', height)

      popup.style.left = left
      popup.style.top = top
    },
  },
  render() {
    return this.$slots.default
  },
}
</script>
