# Demo

## Default
<ClientOnly>
  <Datepicker placeholder="Select Date" :append-to-body="true"/>
</ClientOnly>

```html
<Datepicker placeholder="Select Date" />
```

## v-model
<ClientOnly>
  <Datepicker-VModel/>
</ClientOnly>

```html
<Datepicker
  v-model="vModelExample"
/>
```


## First day of Week
<ClientOnly>
  <Datepicker
    placeholder="Select Date"
    first-day-of-week="mon"
  />
</ClientOnly>

```html
<Datepicker
  first-day-of-week="mon"
/>
```

## Don't show edge dates
<ClientOnly>
  <Datepicker
    placeholder="Select Date"
    :show-edge-dates="false"
  />
</ClientOnly>

```html
<Datepicker
  :show-edge-dates="false"
/>
```


## Custom open Date
<ClientOnly>
  <Datepicker-OpenDate/>
</ClientOnly>

```html
<Datepicker
  :open-date="openDate"
/>
```


## Inline
<ClientOnly>
  <Datepicker
    placeholder="Select Date"
    :inline="true"
  />
</ClientOnly>

```html
<Datepicker
  :inline="true"
/>
```

## Fixed position
<ClientOnly>
  <Datepicker
    placeholder="Select Date"
    fixed-position="top-right"
  />
</ClientOnly>

```html
<Datepicker
  fixed-position="top-right"
/>
```


## Rtl
<ClientOnly>
  <Datepicker
    :language="$datepickerLocals.he"
  />
</ClientOnly>

```html
<Datepicker
  :language="$datepickerLocals.he"
/>
```


## Day view only
<ClientOnly>
  <Datepicker
    minimum-view="day"
    maximum-view="day"
  />
</ClientOnly>

```html
<Datepicker
  minimum-view="day"
  maximum-view="day"
/>
```


## Day and month view only
<ClientOnly>
  <Datepicker
    minimum-view="day"
    maximum-view="month"
    initial-view="month"
  />
</ClientOnly>

```html
<Datepicker
  minimum-view="day"
  maximum-view="month"
  initial-view="month"
/>
```


## With Button
<ClientOnly>
  <Datepicker
    :calendar-button="true"
    :show-calendar-on-button-click="true"
  />
</ClientOnly>

```html
<Datepicker
  :calendar-button="true"
  :show-calendar-on-button-click="true"
/>
```


## Year picker range
<ClientOnly>
  <Datepicker-YearPickerRange/>
</ClientOnly>

```html
<Datepicker
  :year-picker-range="yearPickerRange"
/>
```


## Comparison append picker to body
<ClientOnly>
  <Datepicker-AppendToBody/>
</ClientOnly>

```html
<Datepicker
 :append-to-body="true"
/>
```

## Comparison use utc or not
<ClientOnly>
  <Datepicker-UseUtc/>
</ClientOnly>

```html
<Datepicker
  :use-utc="true"
/>
```

<style>
@import '../../dist/vuejs-datepicker.css';
input, select {
  padding: .75em .5em;
  font-size: 100%;
  border: 1px solid #cccccc;
  width: 100%;
  box-sizing: border-box;
}
pre {
  color: #ffffff;
}
.settings {
  margin: 2em 0;
  background: #eeeeee;
}
</style>
