<template>
  <div class="example">
    <Datepicker :format="format"/>
    <code>
      &lt;datepicker :format="format"&gt;&lt;/datepicker&gt;
    </code>
    <div class="settings">
      <h5>Settings</h5>
      <Format
        @selected="selected"
        :format-init="format"
      />
    </div>

    <Datepicker :format="customFormatter" :typeable="true"/>
    <code>
      &lt;datepicker :format="format"&gt;&lt;/datepicker&gt;
    </code>
  </div>
</template>

<script>
import Format from '../../../docs/.vuepress/components/Formats'
import { format } from "date-fns";

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
      return format(new Date(date), "dd.MM.yyyy");
    }
  },
}
</script>

<style>
  @import 'style.css';
</style>
