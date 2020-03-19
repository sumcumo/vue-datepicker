# Date formatting

## String formatter

NB. This is not very robust at all - use at your own risk! Needs a better implementation.

| Token | Desc                   | Example     |
|-------|------------------------|-------------|
| d     | day                    | 1           |
| dd    | 0 prefixed day         | 01          |
| D     | abbr day               | Mon         |
| su    | date suffix            | st, nd, rd  |
| M     | month number (1 based) | 1 (for Jan) |
| MM    | 0 prefixed month       | 01          |
| MMM   | abbreviated month name | Jan         |
| MMMM  | month name             | January     |
| yy    | two digit year         | 16          |
| yyyy  | four digit year        | 2016        |

## Function formatter

Delegates date formatting to provided function.
Function will be called with date and it has to return the formatted date as a string.
This allow us to use moment, date-fns, globalize or any other library to format date.
Be aware of the fact that if you use a typeable datepicker the formatting function will be
triggered on every input change.

```vue
<template>
  <DatePicker :format="customFormatter"></DatePicker>
</template>
<script>
import { format } from "date-fns";
export default {
  methods: {
     customFormatter(date) {
       return format(new Date(date), "dd-MM-yyyy");
     }
  }
}
</script>
```
