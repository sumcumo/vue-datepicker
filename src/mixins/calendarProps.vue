<script>
export default ({
  props: {
    calendarClass: {
      type: [
        String,
        Object,
        Array,
      ],
      default: '',
    },
    dayCellContent: {
      type: Function,
      default: (day) => day.date,
    },

    disabledDates: {
      type: Object,
      default() {
        return {}
      },
    },

    fixedPosition: {
      type: String,
      default: '',
      validator: (val) => val === ''
        || val === 'bottom'
        || val === 'bottom-left'
        || val === 'bottom-right'
        || val === 'top'
        || val === 'top-left'
        || val === 'top-right',
    },
    fullMonthName: {
      type: Boolean,
      default: false,
    },
    highlighted: {
      type: Object,
      default() {
        return {}
      },
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    mondayFirst: {
      type: Boolean,
      default: false,
    },

    initialView: {
      type: String,
      default: '',
    },
    maximumView: {
      type: String,
      default: 'year',
    },
    minimumView: {
      type: String,
      default: 'day',
    },
  },
  computed: {
    isRtl() {
      return this.translation.rtl === true
    },
  },
})
</script>
