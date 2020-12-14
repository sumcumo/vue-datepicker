<template>
  <div class="overflow-scroll">
    <h3>Don't append datepicker to body</h3>
    <Datepicker />
    <h3>Append to body</h3>
    <Datepicker :append-to-body="true" />
  </div>
</template>

<script>
export default {
  name: 'DatepickerOpenDate',
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
}
</style>
