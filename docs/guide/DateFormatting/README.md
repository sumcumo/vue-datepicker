# Date formatting

## String formatter

The default format is 'dd MMM yyyy' e.g. 05 Jan 2022. However, you can use the following tokens to build up your own
`format` string:

| Token | Desc                   | Example     |
|-------|------------------------|-------------|
| d     | day                    | 1           |
| dd    | 0 prefixed day         | 01          |
| E     | abbr day               | Mon         |
| o     | date suffix            | st, nd, rd  |
| M     | month number (1 based) | 1 (for Jan) |
| MM    | 0 prefixed month       | 01          |
| MMM   | abbreviated month name | Jan         |
| MMMM  | month name             | January     |
| yy    | two digit year         | 16          |
| yyyy  | four digit year        | 2016        |

For example, the following string would format the date as 'January 5th, 2022':

```vue
<template>
  <DatePicker format="MMMM do, yyyy"></DatePicker>
</template>
```

## Function formatter

Delegates date formatting to a function provided by the `format` prop.
The function will be called with the date - and it has to return the formatted date as a string.
This allows us to use moment, date-fns, globalize or any other library to format the date.

Here is an example using [date-fns](https://date-fns.org/):

```vue
<template>
  <DatePicker :format="customFormatter"></DatePicker>
</template>

<script>
import { format } from 'date-fns'

export default {
  data() {
    return {
      format: 'dd.MM.yyyy',
    }
  },
  methods: {
    customFormatter(date) {
      return format(date, this.format)
    },
  },
}
</script>
```
