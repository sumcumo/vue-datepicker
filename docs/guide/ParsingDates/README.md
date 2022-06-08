# Parsing typed input

## Default parsing
When you type into a `typeable` datepicker, each time you 'key-up', the datepicker
will try to parse your input to a valid date. When the input field loses focus, the
date is either formatted, or cleared if no valid is found.

*N.B. Since version 5.0, the datepicker no longer submits the date each time a valid
date is typed. A typed date is only submitted - and a `selected` event fired - a) on pressing
the enter key, or b) when the datepicker loses focus entirely. `input` events, however,
continue to be fired each time a change in the input field occurs and a valid date is detected.*


```vue
<template>
  <DatePicker :typeable="true"></DatePicker>
</template>
```
The parser doesn't always get it right! For example, it doesn't like date
suffixes such as 1st, 2nd or 3rd. And dates such as 02/07/2022 are currently
interpreted as 07 Feb 2022, not 02 Jul 2022 - which may, or may not, be what
you were expecting. If you'd like to help improve the parser, please feel free
to submit a PR!

## Parser function

If you know the format in which you expect a date to be typed, you can provide a
function for parsing the date via the `parser` prop. This function will then be
called instead of the default parser. We can use moment, date-fns, globalize or
any other library to parse the input, so long as it returns a date from string.

Be aware of the fact that if you use a custom parsing function, you will also
need to pass in a custom `format` function in order for the formatted date to be
correctly parsed back to a date object.

Here is an example using [date-fns](https://date-fns.org/):

```vue
<template>
  <DatePicker :format="customFormatter" :parser="customParser"></DatePicker>
</template>

<script>
import { format, parse } from 'date-fns'

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
    customParser(date) {
      return parse(date, this.format, new Date())
    },
  },
}
</script>
```
