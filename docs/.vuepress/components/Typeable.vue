<template>
  <div class="example">
    <Datepicker
      placeholder="Type or select date"
      :typeable="true"
      :format="format"
    />
    <code>
      &lt;datepicker placeholder="Type or select date"
      :typeable="true"&gt;&lt;/datepicker&gt;
    </code>
    <div class="settings">
      <h5>Settings</h5>
      <Format @selected="selected" :format-init="format" />
    </div>
  </div>
</template>

<script>
import Format from '../components/Formats.vue'

export default {
  name: 'Typeable',
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
  },
}
</script>

<style>
@import 'style.css';
</style>
