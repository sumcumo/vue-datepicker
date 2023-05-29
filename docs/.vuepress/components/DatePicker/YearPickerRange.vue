<template>
  <div>
    <div class="settings">
      <h5>Settings</h5>
      <div class="form-group">
        <label>Year picker range:</label>
        <input
          v-model.number="yearPickerRange"
          type="number"
        />
      </div>
      <pre>yearPickerRange: {{ yearPickerRange }}</pre>
    </div>
    <DatePicker :year-picker-range="yearPickerRange" />
    <hr />
  </div>
</template>

<script>
export default {
  name: 'DatePickerYearPickerRange',
  data() {
    return {
      yearPickerRange: 10,
    }
  },
}
</script>
