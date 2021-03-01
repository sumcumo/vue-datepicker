<script>
import PickerHeader from '~/components/PickerHeader.vue'
import makeDateUtils from '~/utils/DateUtils'
import DisabledDate from '~/utils/DisabledDate'

export default {
  components: { PickerHeader },
  inheritAttrs: false,
  props: {
    disabledDates: {
      type: Object,
      default() {
        return {}
      },
    },
    isRtl: {
      type: Boolean,
      default: false,
    },
    isUpDisabled: {
      type: Boolean,
      default: false,
    },
    pageDate: {
      type: Date,
      default: null,
    },
    selectedDate: {
      type: Date,
      default: null,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    translation: {
      type: Object,
      default() {
        return {}
      },
    },
    useUtc: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      utils: makeDateUtils(this.useUtc),
    }
  },
  computed: {
    /**
     * A look-up object created from 'disabledDates' prop
     * @return {Object}
     */
    disabledConfig() {
      return new DisabledDate(this.utils, this.disabledDates).config
    },
    /**
     * Returns the current page's full year as an integer.
     * @return {Number}
     */
    pageYear() {
      return this.utils.getFullYear(this.pageDate)
    },
  },
  methods: {
    /**
     * Changes the page up or down
     * @param {Number} incrementBy
     */
    changePage(incrementBy) {
      const date = this.pageDate
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy)

      this.$emit('page-change', date)
    },
    /**
     * Emits a 'select' or 'select-disabled' event
     * @param {Object} cell
     */
    select(cell) {
      if (cell.isDisabled) {
        this.$emit('select-disabled', cell)
      } else {
        this.$emit('select', cell)
      }
    },
    /**
     * Increment the current page
     */
    nextPage() {
      if (!this.isNextDisabled) {
        this.changePage(+1)
      }
    },
    /**
     * Decrement the page
     */
    previousPage() {
      if (!this.isPreviousDisabled) {
        this.changePage(-1)
      }
    },
  },
}
</script>
