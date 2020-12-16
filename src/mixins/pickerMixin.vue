<script>
import PickerHeader from '~/components/PickerHeader.vue'
import makeDateUtils from '~/utils/DateUtils'

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
    // eslint-disable-next-line complexity
    disabledConfig() {
      const dd = this.disabledDates
      const exists = typeof dd !== 'undefined' && Object.keys(dd).length > 0
      const isDefined = (prop) => {
        return exists && typeof dd[prop] !== 'undefined'
      }
      const hasFrom = isDefined('from')
      const hasTo = isDefined('to')

      return {
        exists,
        disabledDates: dd,
        to: {
          day: hasTo ? this.utils.getDate(dd.to) : null,
          month: hasTo ? this.utils.getMonth(dd.to) : null,
          year: hasTo ? this.utils.getFullYear(dd.to) : null,
        },
        from: {
          day: hasFrom ? this.utils.getDate(dd.from) : null,
          month: hasFrom ? this.utils.getMonth(dd.from) : null,
          year: hasFrom ? this.utils.getFullYear(dd.from) : null,
        },
        has: {
          customPredictor: isDefined('customPredictor'),
          daysOfMonth: isDefined('daysOfMonth'),
          daysOfWeek: isDefined('days'),
          from: hasFrom,
          ranges: isDefined('ranges') && dd.ranges.length > 0,
          specificDates: isDefined('dates') && dd.dates.length > 0,
          to: hasTo,
        },
        utils: this.utils,
      }
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
