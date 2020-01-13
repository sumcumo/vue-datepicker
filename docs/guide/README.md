# Getting started

## Demo

To view demo examples locally, clone the repo and run `npm run install && npm run serve`

## Install

#### npm:

`npm install @sum.cumo/vue-datepicker --save`

#### yarn:

`yarn add @sum.cumo/vue-datepicker`

#### old school:

Download the latest release from github

## Usage

```vue
<template>
  <DatePicker v-model="date"></DatePicker>
</template>

<script>
import DatePicker from '@sum.cumo/vue-datepicker'

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
@import '@sum.cumo/vue-datepicker/dist/vuejs-datepicker.css'
</style>
```
