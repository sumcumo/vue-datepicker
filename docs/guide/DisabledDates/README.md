# Disabled Dates

Dates can be disabled via the `disabled-dates` prop in a number of ways.

```vue
<template>
  <DatePicker :disabled-dates="state.disabledDates"></DatePicker>
</template>
```

::: tip NOTE
Since version 5, the `disabled-dates` prop is constantly watched for any changes.
If/when a date is disabled, its value becomes `null` and both `input` and `changed`
events are emitted. These same events are emitted again if/when the date is no
longer disabled.
:::

## Disable up to a specific date

```js
var state = {
  disabledDates: {
    to: new Date(2016, 0, 5),
  },
}
```

All dates before 2016-01-05 are disabled.

## Disable from a specific date

```js
var state = {
  disabledDates: {
    from: new Date(2016, 0, 26),
  },
}
```

All dates after 2016-01-26 are disabled.

## Disable specific days in each week

```js
var state = {
  disabledDates: {
    days: [6, 0],
  },
}
```

Every Saturday and Sunday is disabled.

## Disable specific days of each month

```js
var state = {
  disabledDates: {
    daysOfMonth: [29, 30, 31],
  },
}
```

29th, 30th and 31st of each month are disabled.

## Disable specific days from an array

```js
var state = {
  disabledDates: {
    dates: [
      new Date(2016, 9, 16),
      new Date(2016, 9, 17),
      new Date(2016, 9, 18),
    ],
  },
}
```

The following dates are disabled: 2016-10-16, 2016-10-17, 2016-10-18.

## Disable within given ranges

::: tip IMPORTANT
Both `to` and `from` properties are required to define a range of dates to highlight.
:::

```js
var state = {
  disabledDates: {
    ranges: [
      {
        from: new Date(2016, 11, 25),
        to: new Date(2016, 11, 30),
      },
      {
        from: new Date(2017, 1, 12),
        to: new Date(2017, 2, 25),
      },
    ],
  },
}
```

The dates from 2016-12-26 to 2016-12-29 (inclusive) and 2017-02-13 to 2017-03-24
(inclusive) are disabled.

## Disable based on custom logic

If none of the above scenarios serve your purpose, you can write your own
`customPredictor` function to determine when a date should be disabled. This
should accept a date and return `true` if it is disabled.

```js
var state = {
  disabledDates: {
    customPredictor: function (date) {
      // disables the date if it is a multiple of 5
      if (date.getDate() % 5 == 0) {
        return true
      }
    },
  },
}
```

Every date that is a multiple of 5 is disabled.
