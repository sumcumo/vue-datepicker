<template>
  <div class="form-group">
    <label>Format</label>
    <select v-model="format">
      <option v-for="(fmt, key) in formats" :key="key" :value="fmt.value">
        {{ fmt.text }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'DateFormats',
  props: {
    formatInit: {
      type: String,
      required: true,
    },
  },
  emits: ['selected'],
  data() {
    return {
      format: '',
      formats: [
        {
          text: 'MMMM d, yyyy e.g. February 6, 2022',
          value: 'MMMM d, yyyy',
        },
        {
          text: 'do MMM yyyy e.g. 6th Feb 2022',
          value: 'do MMM yyyy',
        },
        {
          text: 'yyyy-MM-dd e.g. 2022-02-06',
          value: 'yyyy-MM-dd',
        },
        {
          text: 'E do MMM yyyy e.g. Sun 6th Feb 2022',
          value: 'E do MMM yyyy',
        },
        {
          text: 'dd/MM/yy e.g. 06/02/22',
          value: 'dd/MM/yy',
        },
        {
          text: 'dd.MM.yyyy e.g. 06.02.2022',
          value: 'dd.MM.yyyy',
        },
        {
          text: 'M/d/yyyy e.g. 2/6/2022',
          value: 'M/d/yyyy',
        },
      ],
    }
  },
  watch: {
    format(newVal) {
      this.$emit('selected', newVal)
    },
  },
  mounted() {
    this.format = this.formatInit
  },
}
</script>
