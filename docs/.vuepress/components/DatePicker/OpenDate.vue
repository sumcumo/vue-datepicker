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
      <pre>openDate: {{ openDate }}</pre>
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
}
</script>
