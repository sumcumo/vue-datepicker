# Demo

## Default

<ClientOnly>
  <DatePicker placeholder="Select Date" />
</ClientOnly>

```vue
<DatePicker placeholder="Select Date" />
```

## v-model

<ClientOnly>
  <DatePicker-VModel/>
</ClientOnly>

```vue
<DatePicker v-model="vModelExample" />
```

## First day of week

<ClientOnly>
  <DatePicker
    placeholder="Select Date"
    first-day-of-week="mon"
  />
</ClientOnly>

```vue
<DatePicker first-day-of-week="mon" />
```

## Don't show edge dates

<ClientOnly>
  <DatePicker
    placeholder="Select Date"
    :show-edge-dates="false"
  />
</ClientOnly>

```vue
<DatePicker :show-edge-dates="false" />
```

## Custom open date

<ClientOnly>
  <DatePicker-OpenDate/>
</ClientOnly>

```vue
<DatePicker :open-date="openDate" />
```

## Inline

<ClientOnly>
  <DatePicker
    placeholder="Select Date"
    :inline="true"
  />
</ClientOnly>

```vue
<DatePicker :inline="true" />
```

## Fixed position

<ClientOnly>
  <DatePicker
    placeholder="Select Date"
    fixed-position="top-right"
  />
</ClientOnly>

```vue
<DatePicker fixed-position="top-right" />
```

## Rtl

<ClientOnly>
  <DatePicker
    :language="$datepickerLocales.he"
  />
</ClientOnly>

```vue
<DatePicker :language="$datepickerLocales.he" />
```

## Day view only

<ClientOnly>
  <DatePicker
    minimum-view="day"
    maximum-view="day"
  />
</ClientOnly>

```vue
<DatePicker minimum-view="day" maximum-view="day" />
```

## Day and month view only

<ClientOnly>
  <DatePicker
    minimum-view="day"
    maximum-view="month"
    initial-view="month"
  />
</ClientOnly>

```vue
<DatePicker minimum-view="day" maximum-view="month" initial-view="month" />
```

## With button

<ClientOnly>
  <DatePicker
    :calendar-button="true"
    :show-calendar-on-button-click="true"
  />
</ClientOnly>

```vue
<DatePicker :calendar-button="true" :show-calendar-on-button-click="true" />
```

## Year picker range

<ClientOnly>
  <DatePicker-YearPickerRange/>
</ClientOnly>

```vue
<DatePicker :year-picker-range="yearPickerRange" />
```

## Comparison append picker to body

<ClientOnly>
  <DatePicker-AppendToBody/>
</ClientOnly>

```vue
<DatePicker :append-to-body="true" />
```

## Comparison use utc or not

<ClientOnly>
  <DatePicker-UseUtc/>
</ClientOnly>

```vue
<DatePicker :use-utc="true" />
```

<style>
/* @import '../../dist/style.css'; */

.rtl {
  direction: rtl;
}
.vdp-datepicker {
  font-family: Arial, serif;
  position: relative;
  text-align: left;
  box-sizing: border-box;
}
.vdp-datepicker__calendar {
  background: #fff;
  border: 1px solid #ccc;
  position: absolute;
  width: 300px;
  z-index: 10000;
}
.vdp-datepicker__calendar > div {
  background: #fff;
  width: 298px;
}
.vdp-datepicker__calendar .today {
  background-color: #eee;
}
.vdp-datepicker__calendar * {
  box-sizing: border-box;
}
.vdp-datepicker__calendar.vdp-datepicker__calendar--inline {
  position: static;
}
.vdp-datepicker__calendar button {
  background: inherit;
  text-align: center;
}
.vdp-datepicker__calendar button:disabled {
  color: #ddd;
}
.vdp-datepicker__calendar header {
  display: flex;
  height: 40px;
  justify-content: space-between;
}
.vdp-datepicker__calendar header button {
  border: none;
}
.vdp-datepicker__calendar header button:hover:not(:disabled) {
  background: #eee;
  cursor: pointer;
}
.vdp-datepicker__calendar header button.vdp-datepicker__up {
  color: #000;
  flex-grow: 5;
}
.vdp-datepicker__calendar header .prev,
.vdp-datepicker__calendar header .next {
  flex-grow: 1;
  max-height: 40px;
  position: relative;
}
.vdp-datepicker__calendar header .prev .default,
.vdp-datepicker__calendar header .next .default {
  display: flex;
  text-indent: -10000px;
}
.vdp-datepicker__calendar header .prev .default:after,
.vdp-datepicker__calendar header .next .default:after {
  border: 6px solid transparent;
  content: "";
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.vdp-datepicker__calendar header .prev.rtl,
.vdp-datepicker__calendar header .next.rtl {
  transform: rotate(180deg);
}
.vdp-datepicker__calendar header .prev .default:after {
  border-right: 10px solid #000;
  margin-left: -5px;
}
.vdp-datepicker__calendar header .prev:disabled .default:after {
  border-right: 10px solid #ddd;
}
.vdp-datepicker__calendar header .next .default:after {
  border-left: 10px solid #000;
  margin-left: 5px;
}
.vdp-datepicker__calendar header .next:disabled .default:after {
  border-left: 10px solid #ddd;
}
.vdp-datepicker__calendar .cell {
  border: 1px solid transparent;
  display: inline-block;
  height: 40px;
  padding: 0 5px;
  position: relative;
  text-align: center;
  vertical-align: middle;
  width: 14.2857142857%;
}
.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year {
  cursor: pointer;
}
.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {
  border: 1px solid #4bd;
}
.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:focus, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:focus, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:focus {
  z-index: 1;
}
.vdp-datepicker__calendar .cell.selected {
  background: #4bd;
  color: #104756;
}
.vdp-datepicker__calendar .cell.selected:hover {
  background: #4bd;
}
.vdp-datepicker__calendar .cell.selected.highlighted {
  background: #4bd;
}
.vdp-datepicker__calendar .cell.highlighted {
  background: #cae5ed;
  color: #104756;
}
.vdp-datepicker__calendar .cell.highlighted.disabled {
  color: #accad2;
}
.vdp-datepicker__calendar .cell.muted {
  color: #757575;
}
.vdp-datepicker__calendar .cell.muted.selected {
  color: #104756;
}
.vdp-datepicker__calendar .cell.muted.disabled:not(.selected) {
  color: #ddd;
}
.vdp-datepicker__calendar .cell.muted.disabled:not(.selected).highlighted {
  color: #accad2;
}
.vdp-datepicker__calendar .day-header span {
  display: inline-block;
  font-size: 75%;
  height: 40px;
  line-height: 40px;
  padding: 0 5px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  width: 14.2857142857%;
}
.vdp-datepicker__calendar .month,
.vdp-datepicker__calendar .year {
  width: 33.333%;
}
.vdp-datepicker__calendar .picker-view {
  width: inherit;
}
.vdp-datepicker__calendar .picker-view .cells-wrapper {
  overflow: hidden;
  position: relative;
}
.vdp-datepicker__calendar .picker-view .cells-wrapper .picker-cells {
  transition: all 250ms ease-in-out;
}
.vdp-datepicker__calendar .picker-view .slide-right-enter-active {
  top: 0;
}
.vdp-datepicker__calendar .picker-view .slide-right-leave-active {
  position: absolute;
  top: 0;
}
.vdp-datepicker__calendar .picker-view .slide-right-enter-from {
  transform: translate(100%, 0);
}
.vdp-datepicker__calendar .picker-view .slide-right-leave-to {
  transform: translate(-100%, 0);
}
.vdp-datepicker__calendar .picker-view .slide-left-enter-active {
  top: 0;
}
.vdp-datepicker__calendar .picker-view .slide-left-leave-active {
  position: absolute;
  top: 0;
}
.vdp-datepicker__calendar .picker-view .slide-left-enter-from {
  transform: translate(-100%, 0);
}
.vdp-datepicker__calendar .picker-view .slide-left-leave-to {
  transform: translate(100%, 0);
}
.toggle-enter-active,
.toggle-leave-active {
  transition: all 250ms ease;
}
.toggle-enter-from,
.toggle-leave-to {
  opacity: 0;
}
.view-leave-active {
  position: absolute;
}
.view-enter-active,
.view-leave-active {
  transition: all 250ms ease;
}
.view-enter-from,
.view-leave-to {
  opacity: 0;
}
.vdp-datepicker__clear-button,
.vdp-datepicker__calendar-button {
  border: none;
  font-style: normal;
}
.vdp-datepicker__clear-button.input-group-prepend, .vdp-datepicker__clear-button.input-group-append,
.vdp-datepicker__calendar-button.input-group-prepend,
.vdp-datepicker__calendar-button.input-group-append {
  padding: 0;
}
</style>
