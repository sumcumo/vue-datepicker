<script>
import PickerHeader from '~/components/PickerHeader.vue'
import makeDateUtils from '~/utils/DateUtils'
import DisabledDate from '~/utils/DisabledDate'
import { setFocusToAvailableCell } from '../../KeyFunctions'

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
  mounted() {
    this.$refs.pickerView.addEventListener('keyup', (event) => {
      const code = event.keyCode ? event.keyCode : event.which
      const minSteps = this.pickerType === 'day' ? 7 : 3
      const arrowKeys = [37, 38, 39, 40]
      const options = {
        changePage: this.changePage,
      }
      if (code === 37 || code === 38) {
        options.type = 'previous'
      }
      if (code === 39 || code === 40) {
        options.type = 'next'
      }
      if (code === 38 || code === 40) {
        options.minSteps = minSteps
      }
      if (arrowKeys.includes(code)) {
        setFocusToAvailableCell(options)
      }
    })
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
