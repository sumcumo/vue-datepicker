// import { getDirname, path } from '@vuepress/utils'
// import { searchPlugin } from '@vuepress/plugin-search'
// import VeeValidate from 'vee-validate'
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
// import { registerComponentsPlugin } from '@vuepress/plugin-register-components'

// export default ({ Vue }) => {
// const config = {
//   aria: true,
//   classNames: {},
//   classes: true,
//   delay: 0,
//   dictionary: null,
//   errorBagName: 'errors', // change if property conflicts
//   events: 'input|blur',
//   fieldsBagName: 'fields',
//   i18n: null, // the vue-i18n plugin instance
//   i18nRootKey: 'validations', // the key under which nested validation messages will be located
//   inject: true,
//   locale: 'en',
//   validity: false,
//   useConstraintAttrs: true,
// }
//
//   Vue.use(VeeValidate, config)
//   Vue.component('DatePicker', DatePicker)
//   Vue.prototype.$datepickerLocales = lang
//
//   Vue.directive('cleave', {
//     inserted(el, binding) {
//       // if the bound element is not an input field search for one
//       // this is for cases where the input is inside a wrapper
//       if (el.tagName !== 'INPUT') {
//         el = el.querySelector('input')
//       }
//       // only apply cleave if it is an input field and the options are set
//       if (
//         el.tagName === 'INPUT' &&
//         Object.keys(binding.value).length !== 0 &&
//         binding.value.constructor === Object
//       ) {
//         new Cleave(el, binding.value)
//       }
//     },
//   })
// }

// const __dirname = getDirname(import.meta.url)

// const config = {
//   aria: true,
//   classNames: {},
//   classes: true,
//   delay: 0,
//   dictionary: null,
//   errorBagName: 'errors', // change if property conflicts
//   events: 'input|blur',
//   fieldsBagName: 'fields',
//   i18n: null, // the vue-i18n plugin instance
//   i18nRootKey: 'validations', // the key under which nested validation messages will be located
//   inject: true,
//   locale: 'en',
//   validity: false,
//   useConstraintAttrs: true,
// }

export default defineClientConfig({
  // plugins: [
  //   searchPlugin({}),
  //   registerComponentsPlugin({
  //     componentsDir: path.resolve(__dirname, './components'),
  //   }),
  // ],

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
    // app.component('DateVeeValidate', DateVeeValidate)

    // app.use(VeeValidate, config)
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$datepickerLocales = lang
    app.directive('cleave', {
      inserted(el, binding) {
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
