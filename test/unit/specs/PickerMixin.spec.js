import { mount } from '@vue/test-utils'
import { en } from '~/locale'
import pickerMixin from '~/mixins/pickerMixin'
import defaultComponent from '../defaultComponent'

const options = {
  mixins: [pickerMixin],
  name: 'PickerDay',
  propsData: {
    selectedDate: new Date(2018, 2, 24),
    format: 'dd MMM yyyy',
    translation: en,
  },
  data() {
    return {
      cells: [],
    }
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
    wrapper = mount(defaultComponent, options)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should mount', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('should use `showPickerCalendar` correctly', () => {
    wrapper.vm.showPickerCalendar('month')
    expect(wrapper.emitted('show-month-calendar')).toBeTruthy()
  })
})
