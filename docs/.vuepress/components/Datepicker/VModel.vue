<template>
  <div>
    <Datepicker v-model="vModelExample" placeholder="Select Date" />
    <hr />
    <p>{{ vModelExample }}</p>
  </div>
</template>

<script>
export default {
  name: 'DatepickerVModel',
  data() {
    return {
      vModelExample: new Date()
    }
  },
}
</script>
