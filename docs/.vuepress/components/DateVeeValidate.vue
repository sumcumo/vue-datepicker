<template>
  <DatePicker
    v-model="value"
    placeholder="Select a date (required)"
    name="datepicker"
    @blur="validateDate"
  />
  <div class="error">
    {{ errorMessage }}
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'

// Validator function
const isRequired = (value) => (value ? true : 'Please enter a date')

const { value, errorMessage, handleChange } = useField('datepicker', isRequired)

function validateDate() {
  const date = value.value
  handleChange()
  value.value = date
}
</script>
