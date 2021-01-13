<template>
  <div id="app">
    <h1>Datepicker Examples</h1>
    <div class="example">
      <h3>Default datepicker...</h3>
      <Datepicker
        placeholder="Select Date"
        :inline="false"
        :language="languages['de']"
        :disabled-dates="{
          // to: new Date(2020, 10, 15),
          // from: new Date(2021, 0, 15),
          // ranges: [
          //   {
          //     // Disable dates in given ranges (exclusive).
          //     from: new Date(2020, 9, 31),
          //     to: new Date(2021, 0, 1),
          //   },
          // {
          //   to: new Date(2020, 11, 5),
          //   from: new Date(2020, 10, 30),
          // },
          // ],
          // customPredictor: (date) => {
          //   return date.getDate() % 3 === 0
          // },
        }"
        :highlighted="{
          from: new Date(2020, 11, 20),
          to: new Date(2020, 11, 30),
          includeDisabled: true,
        }"
      />
      <code>
        &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;
      </code>
    </div>

<!--    <div class="example">-->
<!--      <h3>Custom first-day-of-week datepicker</h3>-->
<!--      <Datepicker placeholder="Type or select date" first-day-of-week="mon" />-->
<!--      <code>-->
<!--        &lt;datepicker placeholder="Type or select date" first-day-of-week="mon"-->
<!--        &gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Typeable datepicker</h3>-->
<!--      <Datepicker placeholder="Type or select date" :typeable="true" />-->
<!--      <code>-->
<!--        &lt;datepicker placeholder="Type or select date"-->
<!--        :typeable="true"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Only show dates from current month datepicker</h3>-->
<!--      <Datepicker placeholder="Type or select date" :show-edge-dates="false" />-->
<!--      <code>-->
<!--        &lt;datepicker placeholder="Type or select date"-->
<!--        :show-edge-dates="false"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Bootstrap styled datepicker</h3>-->
<!--      <Datepicker-->
<!--        :bootstrap-styling="true"-->
<!--        :calendar-button="true"-->
<!--        :clear-button="true"-->
<!--      />-->
<!--      <code>-->
<!--        &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>v-model datepicker</h3>-->
<!--      <Datepicker-->
<!--        v-model="vModelExample"-->
<!--        placeholder="Select Date"-->
<!--        :append-to-body="true"-->
<!--      />-->
<!--      <code>-->
<!--        &lt;datepicker placeholder="Select Date"-->
<!--        v-model="vmodelexample"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--      <hr />-->
<!--      <p>{{ vModelExample }}</p>-->
<!--    </div>-->

<!--    <div class="example overflow-scroll">-->
<!--      <h3>Append datepicker to body</h3>-->
<!--      <Datepicker :append-to-body="true" />-->
<!--      <h3>Don't append datepicker to body</h3>-->
<!--      <Datepicker />-->
<!--      <code>&lt;datepicker :append-to-body="true"&gt;&lt;/datepicker&gt;</code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Format datepicker</h3>-->
<!--      <Datepicker :format="format" />-->
<!--      <code>&lt;datepicker :format="format"&gt;&lt;/datepicker&gt;</code>-->
<!--      <div class="settings">-->
<!--        <h5>Settings</h5>-->
<!--        <div class="form-group">-->
<!--          <label>Format</label>-->
<!--          <select v-model="format">-->
<!--            <option value="d MMM yyyy" selected>-->
<!--              d MMM yyyy - e.g 12 Feb 2016-->
<!--            </option>-->
<!--            <option value="d MMMM yyyy">-->
<!--              d MMMM yyyy - e.g 12 February 2016-->
<!--            </option>-->
<!--            <option value="yyyy-MM-dd">yyyy-MM-dd - e.g 2016-02-12</option>-->
<!--            <option value="do MMM yyyy">do MMM yyyy - e.g 12th Feb 2016</option>-->
<!--            <option value="E do MMM yyyy">-->
<!--              E do MMM yyyy - e.g Sat 12th Feb 2016-->
<!--            </option>-->
<!--          </select>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>With minimum and maximum date range</h3>-->
<!--      <Datepicker :disabled-dates="disabledDates" />-->
<!--      <code>-->
<!--        &lt;datepicker :disabled-dates="disabledDates"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--      <div class="settings">-->
<!--        <h5>Settings</h5>-->
<!--        <div class="form-group">-->
<!--          <label>Disabled to:</label>-->
<!--          <Datepicker @selected="disableTo" />-->
<!--        </div>-->
<!--        <div class="form-group">-->
<!--          <label>Disabled from:</label>-->
<!--          <Datepicker @selected="disableFrom" />-->
<!--        </div>-->
<!--        <div class="form-group">-->
<!--          <label>Disabled Days of Month:</label>-->
<!--          <input-->
<!--            type="text"-->
<!--            value=""-->
<!--            placeholder="5,6,12,13"-->
<!--            @change="setDisabledDays"-->
<!--          />-->
<!--        </div>-->
<!--        <pre>disabledDates: {{ disabledDates }}</pre>-->

<!--        <h5>Resulting Date picker</h5>-->
<!--        <Datepicker :disabled-dates="disabledDates" />-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Disabled dates</h3>-->
<!--      <div class="settings">-->
<!--        <h5>Settings</h5>-->
<!--        <div class="form-group">-->
<!--          <label>Disabled Function:</label>-->
<!--        </div>-->
<!--        <pre>{{ disabledFnContent }}</pre>-->
<!--        <h5>Resulting Date picker</h5>-->
<!--        <Datepicker :disabled-dates="disabledFn" />-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Highlighting Dates Matching Given Function</h3>-->
<!--      <Datepicker :highlighted="highlighted" />-->
<!--      <code>-->
<!--        &lt;datepicker :highlighted="highlighted"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--      <div class="settings">-->
<!--        <h5>Settings</h5>-->
<!--        <pre>-->
<!--          highlighted: {-->
<!--            customPredictor: function (date) {-->
<!--              // highlights every day of a month which is a multiple of 4-->
<!--              if (date.getDate() % 4 === 0) {-->
<!--                return true-->
<!--              }-->
<!--            }-->
<!--          }-->
<!--        </pre>-->

<!--        <h5>Resulting Date picker</h5>-->
<!--        <Datepicker :highlighted="highlightedFn" />-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Highlighting Dates</h3>-->
<!--      <code>-->
<!--        &lt;datepicker :highlighted="highlighted"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--      <div class="settings">-->
<!--        <h5>Settings</h5>-->
<!--        <div class="form-group">-->
<!--          <label>Highlight from:</label>-->
<!--          <Datepicker @selected="highlightFrom" />-->
<!--        </div>-->
<!--        <div class="form-group">-->
<!--          <label>Highlight to:</label>-->
<!--          <Datepicker @selected="highlightTo" />-->
<!--        </div>-->
<!--        <div class="form-group">-->
<!--          <label>Highlight Days of Month:</label>-->
<!--          <input type="text" value="" @change="setHighlightedDays" />-->
<!--        </div>-->
<!--        <pre>highlighted: {{ highlighted }}</pre>-->

<!--        <h5>Resulting Date picker</h5>-->
<!--        <Datepicker :highlighted="highlighted" />-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>With default open date</h3>-->
<!--      <Datepicker :open-date="openDate" />-->
<!--      <code>&lt;datepicker :disabled="disabled"&gt;&lt;/datepicker&gt;</code>-->
<!--      <div class="settings">-->
<!--        <h5>Settings</h5>-->
<!--        <div class="form-group">-->
<!--          <label>Open date:</label>-->
<!--          <Datepicker v-model="openDate" />-->
<!--        </div>-->
<!--        <pre>open-date: {{ openDate }}</pre>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Translations</h3>-->
<!--      <h5>{{ languages[language].language }} datepicker</h5>-->

<!--      <Datepicker :language="languages[language]" format="d MMMM yyyy" />-->
<!--      <code>-->
<!--        &lt;datepicker :language="languages.{{-->
<!--          language-->
<!--        }}"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--      <div class="settings">-->
<!--        <h5>Settings</h5>-->
<!--        <select v-model="language">-->
<!--          <option v-for="(language, key) in languages" :key="key" :value="key">-->
<!--            {{ language.language }}-->
<!--          </option>-->
<!--        </select>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Inline datepicker</h3>-->
<!--      <Datepicker :inline="true" />-->
<!--      <code>&lt;datepicker :inline="true"&gt;&lt;/datepicker&gt;</code>-->
<!--    </div>-->
<!--    <div class="example">-->
<!--      <h3>RTL datepicker</h3>-->
<!--      <Datepicker :language="languages.he" />-->
<!--      <code>-->
<!--        &lt;datepicker :language="languages.he"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Day view only</h3>-->
<!--      <Datepicker minimum-view="day" maximum-view="day" />-->
<!--      <code>-->
<!--        &lt;datepicker minimum-view="day"-->
<!--        maximum-view="day"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Day view only RTL</h3>-->
<!--      <Datepicker-->
<!--        minimum-view="day"-->
<!--        maximum-view="day"-->
<!--        :language="languages.he"-->
<!--      />-->
<!--      <code>-->
<!--        &lt;datepicker minimum-view="day" maximum-view="day"-->
<!--        language="languages.he"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Month view only</h3>-->
<!--      <Datepicker minimum-view="month" maximum-view="month" />-->
<!--      <code>-->
<!--        &lt;datepicker minimum-view="month"-->
<!--        maximum-view="month"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Day and month view only</h3>-->
<!--      <Datepicker-->
<!--        minimum-view="day"-->
<!--        maximum-view="month"-->
<!--        initial-view="month"-->
<!--      />-->
<!--      <code>-->
<!--        &lt;datepicker minimum-view="day" maximum-view="month"-->
<!--        initial-view="month"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Year and month view only</h3>-->
<!--      <Datepicker-->
<!--        minimum-view="month"-->
<!--        maximum-view="year"-->
<!--        initial-view="year"-->
<!--      />-->
<!--      <code>-->
<!--        &lt;datepicker minimum-view="month" maximum-view="year"-->
<!--        initial-view="year"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Year picker range</h3>-->
<!--      <Datepicker :year-picker-range="yearPickerRange" />-->
<!--      <code>-->
<!--        &lt;datepicker-->
<!--        :year-picker-range="yearPickerRange"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--      <div class="settings">-->
<!--        <h5>Settings</h5>-->
<!--        <div class="form-group">-->
<!--          <label>Year picker range:</label>-->
<!--          <input v-model.number="yearPickerRange" type="number" />-->
<!--        </div>-->
<!--        <pre>yearPickerRange: {{ yearPickerRange }}</pre>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="example">-->
<!--      <h3>Fixed positions</h3>-->
<!--      <Datepicker :fixed-position="fixedPosition" :append-to-body="true" />-->
<!--      <code>-->
<!--        &lt;datepicker :fixed-position="fixedPosition"&gt;&lt;/datepicker&gt;-->
<!--      </code>-->
<!--      <div class="settings">-->
<!--        <h5>Settings</h5>-->
<!--        <select v-model="fixedPosition">-->
<!--          <option-->
<!--            v-for="position in fixedPositions"-->
<!--            :key="position"-->
<!--            :value="position"-->
<!--          >-->
<!--            {{ position }}-->
<!--          </option>-->
<!--        </select>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import Datepicker from '~/components/Datepicker.vue'
import * as lang from '~/locale/index'

const state = {
  date1: new Date(),
}

export default {
  name: 'Demo',
  components: {
    Datepicker,
  },
  data() {
    return {
      styleInput: null,
      format: 'd MMMM yyyy',
      disabledDates: {},
      openDate: null,
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
          if (month % 2 !== 0 && day < 15) {
            return true
          }
          return false
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
          if (month % 2 !== 0 && day < 15) {
            return true
          }
          return false
        }
      }`,
      highlightedFn: {
        customPredictor(date) {
          if (date.getDate() % 4 === 0) {
            return true
          }
          return false
        },
      },
      highlighted: {},
      eventMsg: null,
      state,
      vModelExample: null,
      languages: lang,
      language: 'en',
      yearPickerRange: 10,
      fixedPositions: [
        'bottom',
        'bottom-left',
        'bottom-right',
        'top',
        'top-left',
        'top-right',
      ],
      fixedPosition: 'bottom',
    }
  },
  computed: {
    getInputStyle() {
      return this.styleInput
    },
  },
  methods: {
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
  },
}
</script>

<style>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

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

select {
  height: 2.5em;
}

.example {
  background: #f2f2f2;
  border: 1px solid #ddd;
  padding: 0 1em 1em;
  margin-bottom: 2em;
}

code,
pre {
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
