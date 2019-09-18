<template>
  <div class="example">
    <Datepicker :format="format"></Datepicker>
    <code>
      &lt;datepicker :format="format"&gt;&lt;/datepicker&gt;
    </code>
    <div class="settings">
      <h5>Settings</h5>
      <Format
        @selected="selected"
        :format-init="format"
      ></Format>
    </div>
  </div>
</template>

<script>
import Datepicker from '../../../dist/vuejs-datepicker'
import Format from '../../../docs/.vuepress/components/Formats'

export default {
  name: 'Formatting',
  components: {
    Datepicker,
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
