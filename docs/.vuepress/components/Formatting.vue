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
import Format from '../../../docs/.vuepress/components/Formats'

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
  },
}
</script>

<style>
  @import 'style.css';
</style>
