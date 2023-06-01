import Cleave from 'cleave.js'
import { defineClientConfig } from '@vuepress/client'
import * as lang from '../../dist/locale/index.mjs'
import DatePicker from '../../dist/vue-datepicker.mjs'
import AppendToBody from './components/DatePicker/AppendToBody.vue'
import OpenDate from './components/DatePicker/OpenDate.vue'
import RtlLanguage from './components/DatePicker/RtlLanguage.vue'
import UseUtc from './components/DatePicker/UseUtc.vue'
import VModel from './components/DatePicker/VModel.vue'
import YearPickerRange from './components/DatePicker/YearPickerRange.vue'
import DateDisabled from './components/DateDisabled.vue'
import DateHighlighted from './components/DateHighlighted.vue'
import DateFormatting from './components/DateFormatting.vue'
import DateLanguage from './components/DateLanguage.vue'
import DateTypeable from './components/DateTypeable.vue'
import DateCleave from './components/DateCleave.vue'
import DateVeeValidate from './components/DateVeeValidate.vue'

export default defineClientConfig({
  // enhance({ app, router, siteData }) {},
  // eslint-disable-next-line max-statements, no-param-reassign
  enhance({ app }) {
    app.component('DatePicker', DatePicker)
    app.component('DatePickerAppendToBody', AppendToBody)
    app.component('DatePickerOpenDate', OpenDate)
    app.component('DatePickerRtlLanguage', RtlLanguage)
    app.component('DatePickerUseUtc', UseUtc)
    app.component('DatePickerVModel', VModel)
    app.component('DatePickerYearPickerRange', YearPickerRange)
    app.component('DateDisabled', DateDisabled)
    app.component('DateHighlighted', DateHighlighted)
    app.component('DateFormatting', DateFormatting)
    app.component('DateLanguage', DateLanguage)
    app.component('DateTypeable', DateTypeable)
    app.component('DateVeeValidate', DateVeeValidate)
    app.component('DateCleave', DateCleave)

    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$datepickerLocales = lang
    app.directive('cleave', {
      mounted(el, binding) {
        // If the bound element is not an input field, search for one.
        // This is for cases where the input is inside a wrapper
        if (el.tagName !== 'INPUT') {
          // eslint-disable-next-line no-param-reassign
          el = el.querySelector('input')
        }
        // Only apply Cleave if it is an input field and the options are set
        if (
          el.tagName === 'INPUT' &&
          Object.keys(binding.value).length !== 0 &&
          binding.value.constructor === Object
        ) {
          // eslint-disable-next-line no-new
          new Cleave(el, binding.value)
        }
      },
    })
  },
  setup() {},
  rootComponents: [],
})
