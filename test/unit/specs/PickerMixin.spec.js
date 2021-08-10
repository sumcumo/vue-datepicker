import { shallowMount } from '@vue/test-utils'
import pickerMixin from '~/mixins/pickerMixin.vue'

const Component = {
  render() {},
  mixins: [pickerMixin],
}

const options = {
  mixins: [pickerMixin],
  propsData: {
    selectedDate: new Date(2018, 2, 24),
  },
}

describe('pickerMixin unmounted', () => {
  it('checks props default', () => {
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

  it('mounts', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  it('uses `isNextDisabled` correctly', () => {
    expect(wrapper.vm.isNextDisabled).toBeFalsy()
  })

  it('uses `isPreviousDisabled` correctly', () => {
    expect(wrapper.vm.isPreviousDisabled).toBeFalsy()
  })
})
