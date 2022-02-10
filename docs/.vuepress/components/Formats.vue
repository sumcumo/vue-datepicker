<template>
  <div class="form-group">
    <label>Format</label>
    <select v-model="format">
      <option v-for="format in formats" :value="format.value">
        {{ format.text }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Formats',
  props: {
    formatInit: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      format: '',
      formats: [
        {
          text: 'MMMM d, yyyy &nbsp;&nbsp;&nbsp; e.g. February 6, 2022',
          value: 'MMMM d, yyyy',
        },
        {
          text: 'do MMM yyyy &nbsp;&nbsp;&nbsp; e.g. 6th Feb 2022',
          value: 'do MMM yyyy',
        },
        {
          text: 'yyyy-MM-dd &nbsp;&nbsp;&nbsp; e.g. 2022-02-06',
          value: 'yyyy-MM-dd',
        },
        {
          text: 'E do MMM yyyy &nbsp;&nbsp;&nbsp; e.g. Sun 6th Feb 2022',
          value: 'E do MMM yyyy',
        },
        {
          text: 'dd/MM/yy &nbsp;&nbsp;&nbsp; e.g. 06/02/22',
          value: 'dd/MM/yy',
        },
        {
          text: 'dd.MM.yyyy &nbsp;&nbsp;&nbsp; e.g. 06.02.2022',
          value: 'dd.MM.yyyy',
        },
        {
          text: 'M/d/yyyy &nbsp;&nbsp;&nbsp; e.g. 2/6/2022',
          value: 'M/d/yyyy',
        },
      ],
    }
  },
  mounted() {
    this.format = this.formatInit
  },
  watch: {
    format(newVal) {
      this.$emit('selected', newVal)
    },
  },
}
</script>

<style>
@import 'style.css';
</style>
