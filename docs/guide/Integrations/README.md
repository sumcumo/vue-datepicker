# Integrations

## [cleave.js](https://github.com/nosir/cleave.js)

For formatting while typing.

The easiest way to integrate Cleave is to use a directive:

```vue
<template>
  <DatePicker
    v-model="model"
    v-cleave="{ delimiter: '.', date: true, datePattern: ['d', 'm', 'Y'] }"
    :typeable="true"
    :format="format"
    :name="name"
  />
</template>

<script>
import Cleave from 'cleave.js'
import { createApp } from 'vue'

const app = createApp({})

app.directive('cleave', {
  inserted(el, binding) {
    // If the bound element is not an input field search for one
    // this is for cases where the input is inside a wrapper
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

## [vee-validate](https://github.com/logaretm/vee-validate) 2.x.x

::: warning Version
This integration only applies for vee-validate 2.x, and not the latest 3.x version!
:::

For input validation.
You can use `v-validate` with `:input-class="fields[name]"` to add validation classes to the input field.
But the touched event needs to be set manually.

```vue
<template>
  <div class="example">
    <DatePicker
      v-model="model"
      v-validate="'required'"
      :typeable="true"
      :format="format"
      :input-class="fields[name]"
      :name="name"
      @blur="touched"
      placeholder="Type or select date"
    />
    <div class="error">
      <span>{{ errors.first(name) }}</span>
    </div>
  </div>
</template>

<script>
import DatePicker from '@sum.cumo/vue-datepicker'

export default {
  name: 'VeeValidate',
  components: {
    DatePicker,
  },
  data() {
    return {
      model: '',
      name: 'datepicker',
      format: 'dd.MM.yyyy',
    }
  },
  methods: {
    touched() {
      this.$validator.flag(this.name, {
        untouched: false,
        touched: true,
      })
    },
  },
  inject: ['$validator'],
}
</script>
```
