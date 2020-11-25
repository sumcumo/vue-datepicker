<template>
  <Datepicker :language="$datepickerLocals.he" />
</template>

<script>
export default {
  name: 'DatepickerOpenDate',
  data() {
    return {
      openDate: null
    }
  },
}
</script>
