<script>
import {
  getPopupElementSize,
  getRelativePosition,
} from '../utils/dom'

export default {
  name: 'Popup',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    fixedPosition: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      popupRect: null,
      relativeElement: null,
    }
  },
  watch: {
    visible: {
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
    this.relativeElement = this.$parent.$el
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
    displayPopup() {
      if (this.inline || !this.visible) return
      const popup = this.$el
      const relativeElement = this.$parent.$el

      if (!this.popupRect) {
        this.popupRect = getPopupElementSize(popup)
      }
      const { width, height } = this.popupRect
      const { left, top } = getRelativePosition({
        el: relativeElement,
        targetWidth: width,
        targetHeight: height,
        fixed: this.appendToBody,
        fixedPosition: this.fixedPosition,
      })

      this.$el.style.left = left
      this.$el.style.top = top
    },
  },
  render() {
    return this.$slots.default
  },
}
</script>
