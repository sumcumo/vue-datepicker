<template>
  <div>
    <div class="settings">
      <h5>Settings</h5>
      <div class="form-group">
        <label>Open date:</label>
        <Datepicker v-model="openDate" placeholder="Select open Date" />
      </div>
      <pre>openDate: {{ openDate }}</pre>
    </div>
    <Datepicker :open-date="openDate" placeholder="Select Date" />
    <hr />
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
