<script>
export default ({
  props: {
    format: {
      type: [
        String,
        Function,
      ],
      default: 'dd MMM yyyy',
    },
    parser: {
      type: Function,
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    refName: {
      type: String,
      default: '',
    },
    openDate: {
      type: [
        String,
        Date,
        Number,
      ],
      default: null,
      validator:
        (val) => val === null
          || val instanceof Date
          || typeof val === 'string'
          || typeof val === 'number',
    },
    placeholder: {
      type: String,
      default: null,
    },
    tabindex: {
      type: [
        Number,
        String,
      ],
      default: null,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    inputClass: {
      type: [
        String,
        Object,
        Array,
      ],
      default: null,
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
    required: {
      type: Boolean,
      default: false,
    },
    typeable: {
      type: Boolean,
      default: false,
    },
    bootstrapStyling: {
      type: Boolean,
      default: false,
    },
    useUtc: {
      type: Boolean,
      default: false,
    },
    showCalendarOnFocus: {
      type: Boolean,
      default: false,
    },
    showCalendarOnButtonClick: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: [
        Number,
        String,
      ],
      default: null,
    },
    pattern: {
      type: String,
      default: null,
    },
  },
})
</script>
