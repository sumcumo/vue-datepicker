<template>
  <div>
    <div class="example">
      <h3>With minimum and maximum date range</h3>
      <Datepicker :disabled-dates="disabledDates"></Datepicker>
      <code>
        &lt;datepicker :disabledDates="disabledDates"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Disabled to:</label>
          <Datepicker @selected="disableTo"></Datepicker>
        </div>
        <div class="form-group">
          <label>Disabled from:</label>
          <Datepicker @selected="disableFrom"></Datepicker>
        </div>
        <div class="form-group">
          <label>Disabled Days of Month:</label>
          <input
            type="text"
            value=""
            placeholder="5,6,12,13"
            @change="setDisabledDays"
          >
        </div>
        <pre>disabled: {{ disabledDates }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>Disabled dates</h3>
      <Datepicker :disabled-dates="disabledFn"></Datepicker>
      <code>
        &lt;datepicker :disabled-dates="disabledFn"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <pre>
  disabledDates: {
    customPredictor: function (date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      // disable every years that are a multiple of 2
      if (year % 2 === 0) {
        return true
      }
      // disable every months that are a multiple of 3
      if (month % 3 === 0) {
        return true
      }
      // disable first half of the month when it is a multiple of 2
      if (month % 2 !== 0 && day < 15) {
        return true
      }
    }
  }
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from '../../../dist/vuejs-datepicker'

export default {
  name: 'Disabled',
  components: {
    Datepicker,
  },
  data() {
    return {
      disabledDates: {},
      disabledFn: {
        customPredictor(date) {
          const year = date.getFullYear()
          const month = date.getMonth()
          const day = date.getDate()
          // disable every years that are a multiple of 2
          if (year % 2 === 0) {
            return true
          }
          // disable every months that are a multiple of 3
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
      disabledFnContent: ``,
    }
  },
  methods: {
    setDisabledDays(elem) {
      if (elem.target.value === 'undefined') {
        return
      }
      const disabledDays = elem.target.value.split(',').map(day => parseInt(day, 10))
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
  @import 'style.css';
</style>
