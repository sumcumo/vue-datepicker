<template>
  <div class="example overflow-scroll">
    <h3>Don't append datepicker to body</h3>
    <DatePicker placeholder="Select date" />
    <h3>Append to body</h3>
    <DatePicker
      :append-to-body="true"
      placeholder="Select date"
    />
  </div>
</template>

<script>
export default {
  name: 'DatePickerAppendToBody',
  data() {
    return {
      openDate: null,
    }
  },
}
</script>

<style>
.overflow-scroll {
  overflow: scroll;
  padding-bottom: 3em;
}
</style>
