<script>
export default {
  name: 'trapFocus',
  data() {
    return {
      fistFocusable: null,
      focusableElements: null,
      lastFocusable: null,
      trappedElement: null,
    }
  },
  methods: {
    findFocusable(el) {
      return el.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, [tabindex="0"], [contenteditable]',
      )
    },
    keyboardHandler(e) {
      if (e.key === 'Tab' || e.code === 'Tab') {
        if (e.shiftKey && document.activeElement === this.fistFocusable) {
          e.preventDefault()
          this.lastFocusable.focus()
        } else if (
          !e.shiftKey &&
          document.activeElement === this.lastFocusable
        ) {
          e.preventDefault()
          this.fistFocusable.focus()
        }
      }
    },
    trapFocus(target = null) {
      this.$nextTick().then(() => {
        if (target) {
          this.focusableElements = this.findFocusable(target)

          if (this.focusableElements.length > 0) {
            this.fistFocusable = this.focusableElements[0]
            this.lastFocusable = this.focusableElements[
              this.focusableElements.length - 1
            ]
            this.fistFocusable.focus()

            this.trappedElement = target
            this.trappedElement.addEventListener(
              'keydown',
              this.keyboardHandler,
            )
          }
        }
        if (!target) {
          if (this.trappedElement) {
            this.trappedElement.removeEventListener(
              'keydown',
              this.keyboardHandler,
            )
          }
        }
      })
    },
  },
}
</script>
