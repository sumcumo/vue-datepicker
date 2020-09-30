import { shallowMount } from '@vue/test-utils'
import PickerHeader from '~/components/PickerHeader'

describe('PickerHeader unmounted', () => {
  it('sets the correct default data', () => {
    const { props } = PickerHeader
    expect(typeof props.config.default)
      .toEqual('function')
    const configDefault = props.config.default()
    expect(configDefault.showHeader)
      .toBeTruthy()
    expect(configDefault.isRtl)
      .toBeFalsy()
    expect(configDefault.upIsDisabled)
      .toBeFalsy()
  })
})

describe('PickerHeader mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerHeader, {
      propsData: {
        previous: () => {},
        next: () => {},
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should set `leftNavIsDisabled` correctly', () => {
    expect(wrapper.vm.leftNavIsDisabled)
      .toBeFalsy()
    wrapper.setProps({
      config: {
        isRtl: true,
        isNextDisabled: false,
        isPreviousDisabled: false,
      },
    })
    expect(wrapper.vm.leftNavIsDisabled)
      .toBeFalsy()
  })

  it('should set `rightNavIsDisabled` correctly', () => {
    expect(wrapper.vm.rightNavIsDisabled)
      .toBeFalsy()
    wrapper.setProps({
      config: {
        isRtl: true,
        isNextDisabled: false,
        isPreviousDisabled: false,
      },
    })
    expect(wrapper.vm.rightNavIsDisabled)
      .toBeFalsy()
  })
})
