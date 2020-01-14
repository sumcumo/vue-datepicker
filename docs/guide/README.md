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
import '@sum.cumo/vue-datepicker/dist/vuejs-datepicker.css'

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
```

To load the CSS you can import it inside the script tag like above.
Another option is to use webpacks [css-loader](https://webpack.js.org/loaders/css-loader/)
```vue
<style>
@import '~@sum.cumo/vue-datepicker/dist/vuejs-datepicker.css';
</style>
```

If you use [SASS](https://sass-lang.com/) you can directly import the src file.

```vue
<style lang="scss">
@import '~@sumcumo/vue-datepicker/src/styles/style.scss';
</style>
```
