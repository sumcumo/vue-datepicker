<template>
  <div>
    <DatePicker
      v-model="vModelExample"
      placeholder="Select Date"
    />
    <p>{{ vModelExample }}</p>
  </div>
</template>

<script>
export default {
  name: 'DatePickerVModel',
  data() {
    return {
      vModelExample: new Date(),
    }
  },
}
</script>
