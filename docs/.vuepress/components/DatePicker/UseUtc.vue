<template>
  <div class="example">
    <h3>Browser Timezone</h3>
    <DatePicker
      v-model="normalDate"
      placeholder="Select browser timezone date"
    />
    <pre>
Browser timezone date:
{{ normalDate }}
    </pre>
  </div>

  <div class="example">
    <h3>UTC</h3>
    <DatePicker
      v-model="utcDate"
      :use-utc="true"
      placeholder="Select utc date"
    />
    <pre>
UTC date:
{{ utcDate }}</pre>
  </div>
</template>

<script>
export default {
  name: 'DatePickerUserUtc',
  data() {
    return {
      utcDate: null,
      normalDate: null,
    }
  },
}
</script>
