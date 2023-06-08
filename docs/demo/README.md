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

<style scoped>
  h2 {
    margin-bottom: 0.5em;
    border-bottom: none;
  }
</style>
