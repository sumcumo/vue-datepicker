<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { getPopupElementSize, getRelativePosition } from '../utils/dom'
import { PopupRect } from '../../typings'

@Component
export default class Popup extends Vue {
  @Prop({ default: true }) appendToBody: boolean

  @Prop({ default: '' }) fixedPosition: string

  @Prop({ default: false }) inline: boolean

  @Prop({ default: false }) rtl: boolean

  @Prop({ default: false }) visible: boolean

  popupRect: PopupRect

  @Watch('visible', { immediate: true })
  onVisibleChanged(val: boolean) {
    if (val) {
      this.displayPopup()
    }
  }

  mounted() {
    if (this.inline) {
      return
    }
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
  }

  beforeDestroy() {
    if (this.inline) {
      return
    }
    if (this.appendToBody && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }

  /**
   * Adjusts the popup's `top` style attribute when `append-to-body` is true
   */
  setTopStyle() {
    if (this.appendToBody) {
      const relativeRect = this.$parent.$el.getBoundingClientRect()
      // @ts-ignore
      this.$el.style.top = `${relativeRect.bottom + window.scrollY}px`
    }
  }

  /**
   * Sets the `left` and `top` style attributes of the popup
   */
  displayPopup() {
    if (this.inline || !this.visible) return
    this.setTopStyle()
    const popup = this.$el as HTMLElement
    const relativeElement = this.$parent.$el
    if (!this.popupRect) {
      this.popupRect = getPopupElementSize(popup)
    }
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

    // @ts-ignore
    this.$el.style.left = left
    // @ts-ignore
    this.$el.style.top = top
  }

  render() {
    return this.$slots.default
  }
}
</script>
