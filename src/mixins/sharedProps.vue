<script>
export default ({
  props: {
    openDate: {
      type: [
        String,
        Date,
        Number,
      ],
      default: null,
      validator: (val) => val === null
        || val instanceof Date
        || typeof val === 'string'
        || typeof val === 'number',
    },
    useUtc: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
