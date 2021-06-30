<script>
export default {
  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
    bootstrapStyling: {
      type: Boolean,
      default: false,
    },
    clearButton: {
      type: Boolean,
      default: false,
    },
    clearButtonIcon: {
      type: String,
      default: '',
    },
    calendarButton: {
      type: Boolean,
      default: false,
    },
    calendarButtonIcon: {
      type: String,
      default: '',
    },
    calendarButtonIconContent: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    format: {
      type: [String, Function],
      default: 'dd MMM yyyy',
    },
    id: {
      type: String,
      default: null,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    inputClass: {
      type: [String, Object, Array],
      default: null,
    },
    maxlength: {
      type: [Number, String],
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    openDate: {
      type: [String, Date, Number],
      default: null,
      validator: (val) =>
        val === null ||
        val instanceof Date ||
        typeof val === 'string' ||
        typeof val === 'number',
    },
    parser: {
      type: Function,
      default: null,
    },
    pattern: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    refName: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    showCalendarOnButtonClick: {
      type: Boolean,
      default: false,
    },
    showCalendarOnFocus: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: [Number, String],
      default: null,
    },
    typeable: {
      type: Boolean,
      default: false,
    },
    useUtc: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
