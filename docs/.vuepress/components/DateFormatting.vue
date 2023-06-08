<template>
  <div class="example">
    <h3>Default formatter</h3>
    <DatePicker
      :format="format"
      placeholder="Datepicker based on settings below..."
    />
    <code>&lt;DatePicker :format="format"/&gt;</code>

    <div class="settings">
      <h5>Settings</h5>
      <DateFormats
        :format-init="format"
        @selected="selected"
      />
    </div>
  </div>

  <div class="example">
    <h3>Custom formatter</h3>
    <DatePicker
      :format="customFormatter"
      :parser="customParser"
      :typeable="true"
      placeholder="Datepicker based on settings below..."
    />
    <code>
      &lt;DatePicker :format="customFormatter" :parser="customParser"/&gt;
    </code>

    <div class="settings">
      <h5>Settings</h5>
      <pre>
import { format, parse } from 'date-fns'

export default {
  data() {
    return {
      format: 'dd.MM.yyyy',
    }
  },
  methods: {
    customFormatter(date) {
      return format(date, this.format)
    },
    customParser(date) {
      return parse(date, this.format, new Date())
    },
  },
}
      </pre>
    </div>
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
