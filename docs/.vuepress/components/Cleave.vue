<template>
  <div class="example">
    <Datepicker
      v-model="model"
      v-cleave="options"
      :typeable="true"
      :format="format"
      :name="name"
      placeholder="Type or select date"
    />
  </div>
</template>

<script>
import Datepicker from '../../../dist/vuejs-datepicker'

// export component
export default {
  name: 'Cleave',
  components: {
    Datepicker,
  },
  data() {
    return {
      model: '',
      name: 'datepicker',
      format: 'dd.MM.yyyy',
      options: {
        delimiter: '.',
        date: true,
        datePattern: [
          'd',
          'm',
          'Y',
        ],
      },
    }
  },
  inject: ['$validator'],
}
</script>
<style>
  @import 'style.css';
</style>
