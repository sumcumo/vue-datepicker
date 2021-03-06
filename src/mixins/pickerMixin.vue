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
    transitionName: {
      type: String,
      default: '',
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
    view: {
      type: String,
      default: 'day',
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
      const { pageDate, utils } = this
      const units =
        this.view === 'year' ? incrementBy * this.yearRange : incrementBy

      this.$emit('set-transition-name', incrementBy)

      if (this.view === 'day') {
        utils.setMonth(pageDate, utils.getMonth(pageDate) + units)
      } else {
        utils.setFullYear(pageDate, utils.getFullYear(pageDate) + units)
      }

      this.$emit('page-change', pageDate)
    },
    /**
     * Determines which transition to use (for edge dates) and emits a 'select' or 'select-disabled' event
     * @param {Object} cell
     */
    select(cell) {
      if (cell.isDisabled) {
        this.$emit('select-disabled', cell)
        return
      }

      if (cell.isPreviousMonth) {
        this.$emit('set-transition-name', -1)
      }

      if (cell.isNextMonth) {
        this.$emit('set-transition-name', 1)
      }

      this.$emit('select', cell)
    },
  },
}
</script>
