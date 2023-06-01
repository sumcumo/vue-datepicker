# Integrations

## [cleave.js](https://github.com/nosir/cleave.js)

For formatting while typing. Click here to see a [working example](../../demo/Integrations#cleave-js).

The easiest way to integrate Cleave is to use a directive:

```vue
<template>
  <DatePicker
    v-model="model"
    v-cleave="{
      date: true,
      delimiter: '-',
      datePattern: ['Y', 'm', 'd'],
    }"
    format="yyyy-MM-dd"
  />
</template>

<script>
import Cleave from 'cleave.js'
import { createApp } from 'vue'

const app = createApp({})

app.directive('cleave', {
  mounted(el, binding) {
    // If the bound element is not an input field, search for one.
    // This is for cases where the input is inside a wrapper
    if (el.tagName !== 'INPUT') {
      el = el.querySelector('input')
    }
    // Only apply Cleave if it is an input field and the options are set
    if (
      el.tagName === 'INPUT' &&
      Object.keys(binding.value).length !== 0 &&
      binding.value.constructor === Object
    ) {
      new Cleave(el, binding.value)
    }
  },
})
</script>
```

## [vee-validate](https://github.com/logaretm/vee-validate) 4.x.x

For input validation. For example, we can check whether the user has selected a date by firing
vee-validate's `handleChange` function when the datepicker is blurred.

Click here to see a [working example](../../demo/Integrations#vee-validate/).

```vue
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
import DatePicker from '@sum.cumo/vue-datepicker'

// Validator function
const isRequired = (value) => (value ? true : 'Please enter a date')

const { value, errorMessage, handleChange } = useField('datepicker', isRequired)

// TODO
// For some reason, whenever the `handleChange` function fires, it clears the date.
// Therefore I've reset the date to its original value.
// But surely, this step should not be necessary?!
function validateDate() {
  const date = value.value
  handleChange()
  value.value = date
}
</script>
```
