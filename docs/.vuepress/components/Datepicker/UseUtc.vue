<template>
  <div>
    <h3>UTC</h3>
    <Datepicker
      :use-utc="true"
      placeholder="Select utc date"
      v-model="utcDate"
    />
    <pre>UTC date: {{ utcDate }}</pre>
    <h3>Browser Timezone</h3>
    <Datepicker
      placeholder="Select browser timezone date"
      v-model="normalDate"
    />
    <pre>Browser timezone date: {{ normalDate }}</pre>
  </div>
</template>

<script>
export default {
  name: 'DatepickerOpenDate',
  data() {
    return {
      utcDate: null,
      normalDate: null,
    }
  },
}
</script>
