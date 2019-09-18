# Getting started

## Demo

To view demo examples locally, clone the repo and run `npm run install && npm run serve`

## Install

#### npm:

`npm install @sumcumo/vue-datepicker --save`

#### yarn:

`yarn add @sumcumo/vue-datepicker`

#### old school:

Download the latest release from github

## Usage

```vue
<template>
  <DatePicker v-model="date"></DatePicker>
</template>

<script>
import DatePicker from '@sumcumo/vue-datepicker'

export default {
  name: 'Example',
  components: {
    DatePicker,
  },
  data(){
    return {
      date: new Date()
    }
  }
}
</script>

<style>
@import '@sumcumo/vue-datepicker/dist/vuejs-datepicker.css'
</style>
```
