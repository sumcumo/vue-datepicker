<template>
  <DatePicker :language="$datepickerLocales.he" />
</template>

<script>
export default {
  name: 'DatePickerRtlLanguage',
  data() {
    return {
      openDate: null,
    }
  },
}
</script>
