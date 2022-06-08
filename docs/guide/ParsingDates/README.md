# Parsing typed input

## Default parsing
When you type into a `typeable` datepicker, each time you 'key-up', the datepicker
will try to parse your input to a valid date. When the input field loses focus, the
date is either formatted, or cleared if no valid is found.

*N.B. Since version 5.0, the datepicker no longer submits the date each time a valid date
is typed; a typed date is only submitted a) on pressing the enter key, or b) when
the datepicker loses focus entirely.*


```vue
<template>
  <DatePicker :typeable="true"></DatePicker>
</template>
```
The parser doesn't always get it right! For example, it doesn't like date
suffixes such as 1st, 2nd or 3rd. And dates such as 02/07/2022 are currently
interpreted as 07 Feb 2022, not 02 Jul 2022 - which may, or may not, be what
you were expecting? If you'd like to help improve the parser, please feel free
to submit a PR!

## Parser function

If you know the format in which you expect a date to be typed, you can provide a
function for parsing the date via the `parser` prop. This function will then be
called instead of the default parser. We can use moment, date-fns, globalize or
any other library to parse the input, so long as it returns a date from string.

Here is an example using [date-fns](https://date-fns.org/):

```vue
<template>
  <DatePicker :parser="customParser"></DatePicker>
</template>

<script>
import { parse } from 'date-fns'

export default {
  data() {
    return {
      format: 'dd.MM.yyyy',
    }
  },
  methods: {
    customParser(date) {
      return parse(date, this.format, new Date())
    },
  },
}
</script>
```
