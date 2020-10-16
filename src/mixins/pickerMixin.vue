<script>
import PickerHeader from '~/components/PickerHeader.vue'
import { makeDateUtils } from '~/utils/DateUtils'

export default ({
  components: { PickerHeader },
  inheritAttrs: false,
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
    allowedToShowView: {
      type: Function,
      default() {
      },
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
      headerConfig: {
        showHeader: this.showHeader,
        isRtl: this.isRtl,
        isNextDisabled: this.isNextDisabled,
        isPreviousDisabled: this.isPreviousDisabled,
      },
    }
  },
  methods: {
    /**
     * Emit an event to show the month picker
     */
    showPickerCalendar(type) {
      this.$emit(`show-${type}-calendar`)
    },
    /**
     * Need to be set inside the different pickers for month, year, decade
     */
    isNextDisabled() {
      return false
    },
    isPreviousDisabled() {
      return false
    },
  },
})
</script>
