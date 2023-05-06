<template>
  <div class="example">
    <div class="settings">
      <h5>Settings</h5>
      <Format @selected="selected" :format-init="format" />
    </div>
    <h3>Default formatter</h3>
    <Datepicker :format="format" />
    <code>&lt;Datepicker :format="format"/&gt;</code>
    <h3>Custom formatter</h3>
    <Datepicker
      :format="customFormatter"
      :parser="customParser"
      :typeable="true"
    />
    <code>
      &lt;Datepicker :format="customFormatter" :parser="customParser"/&gt;
    </code>
  </div>
</template>

<script>
import Format from '../components/Formats.vue'
import { format, parse } from 'date-fns'

export default {
  name: 'Formatting',
  components: {
    Format,
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
