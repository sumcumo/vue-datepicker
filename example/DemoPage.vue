<template>
  <div>
    <h1>Datepicker Examples</h1>
    <div class="example">
      <h3>Default datepicker...</h3>
      <DatePicker placeholder="Select Date" />
      <code>
        &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Custom first-day-of-week datepicker</h3>
      <DatePicker
        placeholder="Select date"
        first-day-of-week="mon"
      />
      <code>
        &lt;datepicker placeholder="Select date"
        first-day-of-week="mon"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Typeable datepicker</h3>
      <DatePicker
        placeholder="Type or select date"
        :typeable="true"
      />
      <code>
        &lt;datepicker placeholder="Type or select date"
        :typeable="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Only show dates from current month datepicker</h3>
      <DatePicker
        placeholder="Select date"
        :show-edge-dates="false"
      />
      <code>
        &lt;datepicker placeholder="Select date"
        :show-edge-dates="false"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Datepicker with slots</h3>
      <DatePicker placeholder="Select Date">
        <template #beforeCalendarHeader>
          <div class="slot">
            Read all about:
            <a
              href="https://sumcumo.github.io/vue-datepicker/guide/Slots/"
              tabindex="0"
              target="_blank"
            >
              available slots
            </a>
          </div>
        </template>

        <template #calendarFooter>
          <div class="slot">
            They're very flexible. Here's that link again:
            <a
              href="https://sumcumo.github.io/vue-datepicker/guide/Slots/"
              tabindex="0"
              target="_blank"
            >
              available slots
            </a>
          </div>
        </template>
      </DatePicker>
      <pre>
&lt;datepicker placeholder="Select Date"&gt;
  &lt;template #beforeCalendarHeader&gt;
    &lt;div&gt;
      Read all about: &lt;a href="https://sumcumo.github.io/vue-datepicker/guide/Slots/"
      tabindex="0"&gt;available slots&lt;/a&gt;
    &lt;/div&gt;
  &lt;/template&gt;

  &lt;template #calendarFooter&gt;
    &lt;div&gt;
      They're very flexible. Here's that link again:
      &lt;a href="https://sumcumo.github.io/vue-datepicker/guide/Slots/"
      tabindex="0"&gt;available slots&lt;/a&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/datepicker&gt;
      </pre>
    </div>

    <div class="example">
      <h3>Bootstrap styled datepicker</h3>
      <DatePicker
        :bootstrap-styling="true"
        :calendar-button="true"
        :clear-button="true"
      />
      <code>
        &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>v-model datepicker</h3>
      <DatePicker
        v-model="vModelExample"
        placeholder="Select Date"
      />
      <code>
        &lt;datepicker placeholder="Select Date"
        v-model="vModelExample"&gt;&lt;/datepicker&gt;
      </code>
      <p>{{ vModelExample }}</p>
    </div>

    <div class="example overflow-scroll">
      <h3>Append datepicker to body</h3>
      <DatePicker :append-to-body="true" />
      <h3>Don't append datepicker to body</h3>
      <DatePicker />
      <code>&lt;datepicker :append-to-body="true"&gt;&lt;/datepicker&gt;</code>
    </div>

    <div class="example">
      <h3>Format datepicker</h3>
      <DatePicker :format="format" />
      <code>&lt;datepicker format="format"&gt;&lt;/datepicker&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Format</label>
          <select v-model="format">
            <option value="MMMM d, yyyy">
              MMMM d, yyyy e.g. February 6, 2022
            </option>
            <option value="do MMM yyyy">do MMM yyyy e.g. 6th Feb 2022</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd e.g. 2022-02-06</option>
            <option value="E do MMM yyyy">
              E do MMM yyyy e.g. Sun 6th Feb 2022
            </option>
            <option value="dd/MM/yy">dd/MM/yy e.g. 06/02/22</option>
            <option value="dd.MM.yyyy">dd.MM.yyyy e.g. 06.02.2022</option>
            <option value="M/d/yyyy">M/d/yyyy e.g. 2/6/2022</option>
          </select>
        </div>
      </div>
    </div>

    <div class="example">
      <h3>Format a date with the date-fns library</h3>
      <DatePicker
        v-model="state"
        :format="customFormatter"
      />
      <code>
        &lt;datepicker :format="customFormatter"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Format</label>
          <select v-model="formatDateFns">
            <option value="qqq yyyy">qqq yyyy e.g. Q1 2022</option>
            <option value="EEEE do MMMM yyyy">
              EEEE do MMMM yyyy e.g. Sunday 6th February 2022
            </option>
            <option value="MMMM d, yyyy">
              MMMM d, yyyy e.g. February 6, 2022
            </option>
            <option value="do MMM yyyy">do MMM yyyy e.g. 6th Feb 2022</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd e.g. 2022-02-06</option>
            <option value="E do MMM yyyy">
              E do MMM yyyy e.g. Sun 6th Feb 2022
            </option>
            <option value="dd/MM/yy">dd/MM/yy e.g. 06/02/22</option>
            <option value="dd.MM.yyyy">dd.MM.yyyy e.g. 06.02.2022</option>
            <option value="M/d/yyyy">M/d/yyyy e.g. 2/6/2022</option>
          </select>
        </div>
      </div>
    </div>

    <div class="example">
      <h3>With minimum and maximum date range</h3>
      <DatePicker :disabled-dates="disabledDates" />
      <code>
        &lt;datepicker :disabled-dates="disabledDates"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Disabled to:</label>
          <DatePicker @selected="disableTo" />
        </div>
        <div class="form-group">
          <label>Disabled from:</label>
          <DatePicker @selected="disableFrom" />
        </div>
        <div class="form-group">
          <label>Disabled Days of Month:</label>
          <input
            type="text"
            value=""
            placeholder="5,6,12,13"
            @change="setDisabledDays"
          />
        </div>
        <pre>disabledDates: {{ disabledDates }}</pre>

        <h5>Resulting Date picker</h5>
        <DatePicker :disabled-dates="disabledDates" />
      </div>
    </div>

    <div class="example">
      <h3>Disabled dates</h3>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Disabled Function:</label>
        </div>
        <pre>{{ disabledFnContent }}</pre>
        <h5>Resulting Date picker</h5>
        <DatePicker :disabled-dates="disabledFn" />
      </div>
    </div>

    <div class="example">
      <h3>Highlighting Dates Matching Given Function</h3>
      <DatePicker :highlighted="highlighted" />
      <code>
        &lt;datepicker :highlighted="highlighted"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <pre>
          highlighted: {
            customPredictor: function (date) {
              // highlights every day of a month which is a multiple of 4
              return date.getDate() % 4 === 0
            }
          }
        </pre>

        <h5>Resulting Date picker</h5>
        <DatePicker :highlighted="highlightedFn" />
      </div>
    </div>

    <div class="example">
      <h3>Highlighting Dates</h3>
      <code>
        &lt;datepicker :highlighted="highlighted"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Highlight from:</label>
          <DatePicker @selected="highlightFrom" />
        </div>
        <div class="form-group">
          <label>Highlight to:</label>
          <DatePicker @selected="highlightTo" />
        </div>
        <div class="form-group">
          <label>Highlight Days of Month:</label>
          <input
            type="text"
            value=""
            @change="setHighlightedDays"
          />
        </div>
        <pre>highlighted: {{ highlighted }}</pre>

        <h5>Resulting Date picker</h5>
        <DatePicker :highlighted="highlighted" />
      </div>
    </div>

    <div class="example">
      <h3>With default open date</h3>
      <DatePicker :open-date="openDate" />
      <code>&lt;datepicker :disabled="disabled"&gt;&lt;/datepicker&gt;</code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Open date:</label>
          <DatePicker v-model="openDate" />
        </div>
        <pre>open-date: {{ openDate }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>Translations</h3>
      <h5>{{ languages[language].language }} datepicker</h5>

      <DatePicker
        :language="languages[language]"
        format="d MMMM yyyy"
      />
      <code>
        &lt;datepicker :language="languages.{{
          language
        }}"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <select v-model="language">
          <option
            v-for="(lang, key) in languages"
            :key="key"
            :value="key"
          >
            {{ lang.language }}
          </option>
        </select>
      </div>
    </div>

    <div class="example">
      <h3>Inline datepicker</h3>
      <DatePicker :inline="true" />
      <code>&lt;datepicker :inline="true"&gt;&lt;/datepicker&gt;</code>
    </div>

    <div class="example">
      <h3>RTL datepicker</h3>
      <DatePicker :language="languages.he" />
      <code>
        &lt;datepicker :language="languages.he"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day view only</h3>
      <DatePicker
        minimum-view="day"
        maximum-view="day"
      />
      <code>
        &lt;datepicker minimum-view="day"
        maximum-view="day"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day view only RTL</h3>
      <DatePicker
        minimum-view="day"
        maximum-view="day"
        :language="languages.he"
      />
      <code>
        &lt;datepicker minimum-view="day" maximum-view="day"
        language="languages.he"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Month view only</h3>
      <DatePicker
        minimum-view="month"
        maximum-view="month"
      />
      <code>
        &lt;datepicker minimum-view="month"
        maximum-view="month"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day and month view only</h3>
      <DatePicker
        minimum-view="day"
        maximum-view="month"
        initial-view="month"
      />
      <code>
        &lt;datepicker minimum-view="day" maximum-view="month"
        initial-view="month"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Year and month view only</h3>
      <DatePicker
        minimum-view="month"
        maximum-view="year"
        initial-view="year"
      />
      <code>
        &lt;datepicker minimum-view="month" maximum-view="year"
        initial-view="year"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Year picker range</h3>
      <DatePicker :year-picker-range="yearPickerRange" />
      <code>
        &lt;datepicker
        :year-picker-range="yearPickerRange"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Year picker range:</label>
          <input
            v-model.number="yearPickerRange"
            type="number"
          />
        </div>
        <pre>yearPickerRange: {{ yearPickerRange }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>Fixed positions</h3>
      <DatePicker :fixed-position="fixedPosition" />
      <code>
        &lt;datepicker :fixed-position="fixedPosition"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <select v-model="fixedPosition">
          <option
            v-for="position in fixedPositions"
            :key="position"
            :value="position"
          >
            {{ position }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from '~/components/DatePicker.vue'
import { format, parse } from 'date-fns'
import * as lang from '~/locale/index'

export default {
  name: 'DemoPage',
  components: {
    DatePicker,
  },
  data() {
    return {
      disabledDates: {},
      disabledFn: {
        customPredictor(date) {
          const year = date.getFullYear()
          const month = date.getMonth()
          const day = date.getDate()
          // disable every year that is a multiple of 2
          if (year % 2 === 0) {
            return true
          }
          // disable every month that is a multiple of 3
          if (month % 3 === 0) {
            return true
          }
          // disable first half of the month when it is a multiple of 2
          return month % 2 !== 0 && day < 15
        },
      },
      disabledFnContent: `disabledDates: {
        customPredictor: function (date) {
          const year = date.getFullYear()
          const month = date.getMonth()
          const day = date.getDate()
          // disable every year that is a multiple of 2
          if (year % 2 === 0) {
            return true
          }
          // disable every month that is a multiple of 3
          if (month % 3 === 0) {
            return true
          }
          // disable first half of the month when it is a multiple of 2
          return month % 2 !== 0 && day < 15
        }
      }`,
      eventMsg: null,
      fixedPosition: 'bottom',
      fixedPositions: [
        'bottom',
        'bottom-left',
        'bottom-right',
        'top',
        'top-left',
        'top-right',
      ],
      format: 'MMMM d, yyyy',
      formatDateFns: 'MMMM d, yyyy',
      highlighted: {},
      highlightedFn: {
        customPredictor(date) {
          return date.getDate() % 4 === 0
        },
      },
      language: 'en',
      languages: lang,
      openDate: null,
      state: new Date(),
      styleInput: null,
      vModelExample: null,
      yearPickerRange: 10,
    }
  },
  computed: {
    getInputStyle() {
      return this.styleInput
    },
  },
  methods: {
    customFormatter(date) {
      return format(date, this.formatDateFns)
    },
    customParser(date) {
      return parse(date, this.formatDateFns, new Date())
    },
    disableTo(val) {
      if (typeof this.disabledDates.to === 'undefined') {
        this.disabledDates = {
          to: null,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: this.disabledDates.from,
        }
      }
      this.disabledDates.to = val
    },
    disableFrom(val) {
      if (typeof this.disabledDates.from === 'undefined') {
        this.disabledDates = {
          to: this.disabledDates.to,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: null,
        }
      }
      this.disabledDates.from = val
    },
    highlightTo(val) {
      if (typeof this.highlighted.to === 'undefined') {
        this.highlighted = {
          to: null,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: this.highlighted.from,
        }
      }
      this.highlighted.to = val
    },
    highlightFrom(val) {
      if (typeof this.highlighted.from === 'undefined') {
        this.highlighted = {
          to: this.highlighted.to,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: null,
        }
      }
      this.highlighted.from = val
    },
    setDisabledDays(elem) {
      if (elem.target.value === 'undefined') {
        return
      }
      const disabledDays = elem.target.value
        .split(',')
        .map((day) => parseInt(day, 10))
      this.disabledDates = {
        from: this.disabledDates.from,
        to: this.disabledDates.to,
        daysOfMonth: disabledDays,
      }
    },
    setHighlightedDays(elem) {
      if (elem.target.value === 'undefined') {
        return
      }
      const highlightedDays = elem.target.value
        .split(',')
        .map((day) => parseInt(day, 10))
      this.highlighted = {
        from: this.highlighted.from,
        to: this.highlighted.to,
        daysOfMonth: highlightedDays,
      }
    },
  },
}
</script>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css');

body {
  font-family: 'Helvetica Neue Light', Helvetica, sans-serif;
  padding: 1em 2em 2em;
}

input,
select {
  padding: 0.75em 0.5em;
  font-size: 100%;
  border: 1px solid #ccc;
  width: 100%;
}

.example {
  background: #f2f2f2;
  border: 1px solid #ddd;
  padding: 0 1em 1em;
  margin-bottom: 2em;
}

.slot {
  background-color: #cae5ed;
  padding: 0.5em;
}

.slot > a {
  color: #176982;
  padding: 0.1em;
  border-radius: 0.1em;
}

code,
pre {
  color: #e83e8c;
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #bbb;
  display: block;
  background: #ddd;
  border-radius: 3px;
}

.settings {
  margin: 2em 0;
  border-top: 1px solid #bbb;
  background: #eee;
}

h5 {
  font-size: 100%;
  padding: 0;
}

h3 {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 1em;
}

.form-group label {
  font-size: 80%;
  display: block;
}

.overflow-scroll {
  overflow: scroll;
}
</style>
