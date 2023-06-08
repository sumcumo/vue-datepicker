<template>
  <div class="example">
    <DatePicker
      :open-date="openDate"
      placeholder="Select Date"
    />

    <div class="settings">
      <h5>Settings</h5>
      <div class="form-group">
        <label>Open date:</label>
        <DatePicker
          v-model="openDate"
          placeholder="Select open Date"
        />
      </div>
      <pre>openDate="{{ openDateFormatted }}"</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatePickerOpenDate',
  data() {
    return {
      openDate: null,
    }
  },
  computed: {
    openDateFormatted() {
      if (!this.openDate) return ''
      return `new Date(${this.openDate.getFullYear()}, ${this.openDate.getMonth()}, ${this.openDate.getDate()})`
    },
  },
}
</script>
