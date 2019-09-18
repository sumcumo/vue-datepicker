<template>
  <div class="form-group">
    <label>Format</label>
    <select v-model="format">
      <option
        v-for="format in formats"
        :value="format.value"
      >
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
          text: 'd MMMM yyyy - e.g 12 February 2016',
          value: 'd MMMM yyyy',
        },
        {
          text: 'yyyy-MM-dd - e.g 2016-02-12',
          value: 'yyyy-MM-dd',
        },
        {
          text: 'dsu MMM yyyy - e.g 12th Feb 2016',
          value: 'dsu MMM yyyy',
        },
        {
          text: 'D dsu MMM yyyy - e.g Sat 12th Feb 2016',
          value: 'D dsu MMM yyyy',
        },
        {
          text: 'dd.MM.yyyy - 20.12.2019',
          value: 'dd.MM.yyyy',
        },
        {
          text: 'MM.dd.yyyy - 08.30.2019',
          value: 'MM.dd.yyyy',
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

