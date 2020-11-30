# Disabled Dates

Dates can be disabled in a number of ways.

```vue
<template>
  <DatePicker :disabled-dates="state.disabledDates"></DatePicker>
</template>
```

## Disable up to a specific date

```js
var state = {
  disabledDates: {
    to: new Date(2016, 0, 5),
  },
}
```

Everything before 2016-01-05 is disabled

## Disable from a specific date

```js
var state = {
  disabledDates: {
    from: new Date(2016, 0, 26),
  },
}
```

Everything after 2016-01-26 is disabled

## Disable specific days in each week

```js
var state = {
  disabledDates: {
    days: [6, 0],
  },
}
```

Every Saturday and Sunday is disabled

## Disable specific days of each month

```js
var state = {
  disabledDates: {
    daysOfMonth: [29, 30, 31],
  },
}
```

Disable 29th, 30th and 31st of each month

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

Following dates are disabled:
2016-10-16
2016-10-17
2016-10-18

## Disable in given ranges

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

The dates between 2016-12-24 - 2016-12-31 and 2017-02-11 - 2017-03-26 are disabled

## Disable after own logic

A custom function that returns `true` if the date is disabled.
This can be used for writing your own logic to disable a date if none
of the above conditions serve your purpose.
This function should accept a date and return `true` if it is disabled

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

Every date that is a multiple of 5 is disabled
