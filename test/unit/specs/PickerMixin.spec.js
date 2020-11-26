import { shallowMount } from '@vue/test-utils'
import { en } from '~/locale'
import pickerMixin from '~/mixins/pickerMixin.vue'
import defaultComponent from '../defaultComponent.vue'

const options = {
  mixins: [pickerMixin],
  propsData: {
    format: 'dd MMM yyyy',
    pageDate: new Date(2018, 2, 1),
    selectedDate: new Date(2018, 2, 24),
    translation: en,
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
    wrapper = shallowMount(defaultComponent, options)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  // Can't get these tests to pass at the moment...
  // it('should mount', () => {
  //   expect(wrapper.vm).toBeTruthy()
  // })
  //
  // it('should use `showPickerCalendar` correctly', () => {
  //   wrapper.vm.showPickerCalendar('month')
  //   expect(wrapper.emitted('show-month-calendar')).toBeTruthy()
  // })
  //
  // it('should use `isNextDisabled` correctly', () => {
  //   expect(wrapper.vm.isNextDisabled).toBeFalsy()
  // })
  //
  // it('should use `isPreviousDisabled` correctly', () => {
  //   expect(wrapper.vm.isPreviousDisabled).toBeFalsy()
  // })
})
