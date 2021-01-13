import { shallowMount } from '@vue/test-utils'
import { en } from '~/locale'
import pickerMixin from '~/mixins/pickerMixin.vue'

const Component = {
  render() {},
  mixins: [pickerMixin],
}

const options = {
  name: 'PickerDay',
  mixins: [pickerMixin],
  propsData: {
    format: 'dd MMM yyyy',
    selectedDate: new Date(2018, 2, 24),
    translation: en,
  },
  computed: {
    cells() {
      return Array(35)
        .fill({})
        .map((v, i) => {
          return {
            id: i,
          }
        })
    },
  },
}

describe('pickerMixin unmounted', () => {
  it('check props default', () => {
    expect(typeof pickerMixin.props.disabledDates.default).toEqual('function')
    expect(pickerMixin.props.disabledDates.default()).toEqual({})
    expect(typeof pickerMixin.props.translation.default).toEqual('function')
    expect(pickerMixin.props.translation.default()).toEqual({})
  })
})

describe('pickerMixin', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Component, options)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should mount', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  it('should use `showPickerCalendar` correctly', () => {
    wrapper.vm.showPickerCalendar('month')
    expect(wrapper.emitted('show-month-calendar')).toBeTruthy()
  })

  it('should use `isNextDisabled` correctly', () => {
    expect(wrapper.vm.isNextDisabled).toBeFalsy()
  })

  it('should use `isPreviousDisabled` correctly', () => {
    expect(wrapper.vm.isPreviousDisabled).toBeFalsy()
  })
})
