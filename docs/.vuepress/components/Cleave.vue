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
export default {
  name: 'Cleave',
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
  inject: ['$validator'],
}
</script>
<style>
@import 'style.css';
</style>
