import VeeValidate from 'vee-validate'
import Cleave from 'cleave.js'

export default ({
  Vue,
}) => {
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


  Vue.use(VeeValidate, config)

  Vue.directive('cleave', {
    inserted(el, binding) {
      // if the bound element is not an input field search for one
      // this is for cases where the input is inside a wrapper
      if (el.tagName !== 'INPUT') {
        el = el.querySelector('input')
      }
      // only apply cleave if it is an input field and the options are set
      if (
        el.tagName === 'INPUT'
        && Object.keys(binding.value).length !== 0
        && binding.value.constructor === Object
      ) {
        new Cleave(el, binding.value)
      }
    },
  })
}
