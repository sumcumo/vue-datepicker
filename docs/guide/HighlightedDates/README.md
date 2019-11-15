# Highlighted Dates
Dates can be highlighted (e.g. for marking an appointment) in a number of ways. 
####Important:
By default disabled dates are ignored, to highlight disabled dates set the `includeDisabled`
property to `true`. Note: Both `to` and `from` properties are required to define a range of
dates to highlight.

```vue
<template>
  <DatePicker :highlighted="state.highlighted"></DatePicker>
</template>
```

## Highlight up to a specific date
```js
var state = {
  highlighted: {
    to: new Date(2016, 0, 5),
  }
}
```
Everything before 2016-01-05 is highlighted


## Highlight from a specific date
```js
var state = {
  highlighted: {
    from: new Date(2016, 0, 26),
  }
}
```
Everything after 2016-01-26 is highlighted


## Highlight specific days in each week
```js
var state = {
  highlighted: {
     days: [6, 0],
  }
}
```
Every Saturday and Sunday is highlighted 

## Highlight specific days of each month
```js
var state = {
  highlighted: {
    daysOfMonth: [29, 30, 31],
  }
}
```
// Highlight 29th, 30th and 31st of each month

## Highlight specific days from an array
```js
var state = {
  highlighted: {
    dates: [
      new Date(2016, 9, 16),
      new Date(2016, 9, 17),
      new Date(2016, 9, 18)
    ],
  }
}
```
Following dates are highlighted:
2016-10-16
2016-10-17
2016-10-18

## Highlight in given ranges
```js
var state = {
  highlighted: {
    ranges: [{
      from: new Date(2016, 11, 25),
      to: new Date(2016, 11, 30)
    }, 
    {
      from: new Date(2017, 1, 12),
      to: new Date(2017, 2, 25)
    }],
  }
}
```
The dates between 2016-12-24 - 2016-12-31 and 2017-02-11 - 2017-03-26 are highlighted

## Highlight after own logic
A custom function that returns true if the date is highlighted.
This can be used for writing your own logic to highlight a date if none
of the above conditions serve your purpose.
This function should accept a date and return true if it is highlighted
```js
var state = {
  highlighted: {
    customPredictor: function(date) {
      // highlight the date if it is a multiple of 5
      if(date.getDate() % 5 == 0){
        return true
      }
    }
  }
}
```
Every date that is a multiple of 5 is highlighted
