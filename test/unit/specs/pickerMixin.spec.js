import { shallowMount } from '@vue/test-utils'
import pickerMixin from '~/mixins/pickerMixin.vue'

const Component = {
  render() {},
  mixins: [pickerMixin],
}

const options = {
  mixins: [pickerMixin],
  props: {
    selectedDate: new Date(2018, 2, 24),
  },
}

describe('pickerMixin unmounted', () => {
  it('checks props default', () => {
    expect(pickerMixin.props.disabledDates.default).toEqual(null)
    expect(typeof pickerMixin.props.translation.default).toEqual('function')
    expect(pickerMixin.props.translation.default()).toEqual({})
  })
})

describe('pickerMixin shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Component, options)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('mounts', () => {
    expect(wrapper.vm).toBeTruthy()
  })
})
