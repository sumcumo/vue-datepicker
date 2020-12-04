<script>
import PickerHeader from '~/components/PickerHeader.vue'
import { makeDateUtils } from '~/utils/DateUtils'

export default {
  components: { PickerHeader },
  inheritAttrs: false,
  props: {
    allowedToShowView: {
      type: Function,
      default() {},
    },
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
    pageDate: {
      type: Date,
      default: null,
    },
    pageTimestamp: {
      type: Number,
      default: 0,
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
      headerConfig: {
        showHeader: this.showHeader,
        isRtl: this.isRtl,
        /**
         * Need to be set inside the different pickers for month, year, decade
         */
        isNextDisabled: this.isNextDisabled,
        isPreviousDisabled: this.isPreviousDisabled,
      },
      utils: makeDateUtils(this.useUtc),
    }
  },
  computed: {
    disabledFromDay() {
      return this.hasDisabledFrom
        ? this.utils.getDate(this.disabledDates.from)
        : null
    },
    disabledFromMonth() {
      return this.hasDisabledFrom
        ? this.utils.getMonth(this.disabledDates.from)
        : null
    },
    disabledFromYear() {
      return this.hasDisabledFrom
        ? this.utils.getFullYear(this.disabledDates.from)
        : null
    },
    disabledToDay() {
      return this.hasDisabledTo
        ? this.utils.getDate(this.disabledDates.to)
        : null
    },
    disabledToMonth() {
      return this.hasDisabledTo
        ? this.utils.getMonth(this.disabledDates.to)
        : null
    },
    disabledToYear() {
      return this.hasDisabledTo
        ? this.utils.getFullYear(this.disabledDates.to)
        : null
    },
    hasDisabledFrom() {
      return typeof this.disabledDates.from !== 'undefined'
    },
    hasDisabledTo() {
      return typeof this.disabledDates.to !== 'undefined'
    },
    pageMonth() {
      return this.utils.getMonth(this.pageDate)
    },
    pageYear() {
      return this.utils.getFullYear(this.pageDate)
    },
    pageDecadeStart() {
      return Math.floor(this.pageYear / this.yearRange) * this.yearRange
    },
    pageDecadeEnd() {
      return this.pageDecadeStart + this.yearRange - 1
    },
  },
  methods: {
    /**
     * Emit an event to show the month picker
     */
    showPickerCalendar(type) {
      this.$emit(`show-${type}-calendar`)
    },
  },
}
</script>
