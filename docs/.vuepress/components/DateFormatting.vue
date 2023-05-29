<template>
  <div class="example">
    <div class="settings">
      <h5>Settings</h5>
      <DateFormats
        :format-init="format"
        @selected="selected"
      />
    </div>
    <h3>Default formatter</h3>
    <DatePicker
      :format="format"
      placeholder="Datepicker based on settings above..."
    />
    <code>&lt;DatePicker :format="format"/&gt;</code>
    <h3>Custom formatter</h3>
    <DatePicker
      :format="customFormatter"
      :parser="customParser"
      :typeable="true"
    />
    <code>
      &lt;DatePicker :format="customFormatter" :parser="customParser"/&gt;
    </code>
  </div>
</template>

<script>
import { format, parse } from 'date-fns'
import DateFormats from './DateFormats.vue'

export default {
  name: 'DateFormatting',
  components: {
    DateFormats,
  },
  data() {
    return {
      format: 'dd.MM.yyyy',
    }
  },
  methods: {
    selected(newVal) {
      this.format = newVal
    },
    customFormatter(date) {
      return format(date, this.format)
    },
    customParser(date) {
      return parse(date, this.format, new Date())
    },
  },
}
</script>

<style>
@import 'style.css';
</style>
