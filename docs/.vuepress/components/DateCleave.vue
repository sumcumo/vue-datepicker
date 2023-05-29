<template>
  <div class="example">
    <DatePicker
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
export default {
  name: 'DateCleave',
  inject: ['$validator'],
  data() {
    return {
      model: '',
      name: 'datepicker',
      format: 'dd.MM.yyyy',
      options: {
        delimiter: '.',
        date: true,
        datePattern: ['d', 'm', 'Y'],
      },
    }
  },
}
</script>
<style>
@import 'style.css';
</style>
