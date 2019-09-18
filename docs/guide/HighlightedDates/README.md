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
<script>
var state = {
  highlighted: {
    to: new Date(2016, 0, 5), // Highlight all dates up to specific date
    from: new Date(2016, 0, 26), // Highlight all dates after specific date
    days: [6, 0], // Highlight Saturday's and Sunday's
    daysOfMonth: [15, 20, 31], // Highlight 15th, 20th and 31st of each month
    dates: [ // Highlight an array of dates
      new Date(2016, 9, 16),
      new Date(2016, 9, 17),
      new Date(2016, 9, 18)
    ],
    // a custom function that returns true if the date is highlighted
    // this can be used for wiring your own logic to highlight a date if none
    // of the above conditions serve your purpose
    // this function should accept a date and return true if is highlighted
    customPredictor: function(date) {
      // highlights the date if it is a multiple of 4
      if(date.getDate() % 4 == 0){
        return true
      }
    },
    includeDisabled: true // Highlight disabled dates
  }
}
</script>
```
