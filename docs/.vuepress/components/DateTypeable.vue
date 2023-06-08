<template>
  <div class="example">
    <DatePicker
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
      <DateFormat :format-init="format" @selected="selected" />
    </div>
  </div>
</template>

<script>
import DateFormat from './DateFormats.vue'

export default {
  name: 'DateTypeable',
  components: {
    DateFormat,
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
