// import { getDirname, path } from '@vuepress/utils'
// import { searchPlugin } from '@vuepress/plugin-search'
import VeeValidate from 'vee-validate'
import Cleave from 'cleave.js'
import * as lang from '../../dist/locale/index.mjs'
import Datepicker from '../../dist/vue-datepicker.mjs'
import AppendToBody from './components/Datepicker/AppendToBody.vue'
import OpenDate from './components/Datepicker/OpenDate.vue'
import Rtl from './components/Datepicker/Rtl.vue'
import UseUtc from './components/Datepicker/UseUtc.vue'
import VModel from './components/Datepicker/VModel.vue'
import YearPickerRange from './components/Datepicker/YearPickerRange.vue'
import Disabled from './components/Disabled.vue'
import Highlighted from './components/Highlighted.vue'
import Formatting from './components/Formatting.vue'
import Language from './components/Language.vue'
import Typeable from './components/Typeable.vue'
import { defineClientConfig } from '@vuepress/client'
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
//   Vue.component('Datepicker', Datepicker)
//   Vue.prototype.$datepickerLocals = lang
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

const config = {
  aria: true,
  classNames: {},
  classes: true,
  delay: 0,
  dictionary: null,
  errorBagName: 'errors', // change if property conflicts
  events: 'input|blur',
  fieldsBagName: 'fields',
  i18n: null, // the vue-i18n plugin instance
  i18nRootKey: 'validations', // the key under which nested validation messages will be located
  inject: true,
  locale: 'en',
  validity: false,
  useConstraintAttrs: true,
}

export default defineClientConfig({
  // plugins: [
  //   searchPlugin({}),
  //   registerComponentsPlugin({
  //     componentsDir: path.resolve(__dirname, './components'),
  //   }),
  // ],

  // enhance({ app, router, siteData }) {},

  enhance({ app }) {
    app.component('Datepicker', Datepicker)
    app.component('Datepicker-AppendToBody', AppendToBody)
    app.component('Datepicker-OpenDate', OpenDate)
    app.component('Datepicker-Rtl', Rtl)
    app.component('Datepicker-UseUtc', UseUtc)
    app.component('Datepicker-VModel', VModel)
    app.component('Datepicker-YearPickerRange', YearPickerRange)
    app.component('Disabled', Disabled)
    app.component('Highlighted', Highlighted)
    app.component('Formatting', Formatting)
    app.component('Language', Language)
    app.component('Typeable', Typeable)
    app.component('VeeValidate', VeeValidate)

    // app.use(VeeValidate, config)
    app.config.globalProperties.$datepickerLocals = lang
    app.directive('cleave', {
      inserted(el, binding) {
        // If the bound element is not an input field, search for one.
        // This is for cases where the input is inside a wrapper
        if (el.tagName !== 'INPUT') {
          el = el.querySelector('input')
        }
        // Only apply Cleave if it is an input field and the options are set
        if (
          el.tagName === 'INPUT' &&
          Object.keys(binding.value).length !== 0 &&
          binding.value.constructor === Object
        ) {
          new Cleave(el, binding.value)
        }
      },
    })
  },
  setup() {},
  rootComponents: [],
})
