<template>
  <DatePicker
    v-model="date"
    v-cleave="cleaveOptions"
    :typeable="true"
    format="yyyy-MM-dd"
    placeholder="YYYY-MM-DD"
  />
</template>

<script>
export default {
  name: 'DateCleave',
  data() {
    return {
      date: null,
      cleaveOptions: {
        date: true,
        delimiter: '-',
        datePattern: ['Y', 'm', 'd'],
      },
    }
  },
}
</script>
<style>
@import 'style.css';
</style>
