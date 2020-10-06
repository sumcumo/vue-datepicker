import { shallowMount } from '@vue/test-utils'
import PickerHeader from '~/components/PickerHeader'

describe('PickerHeader unmounted', () => {
  it('sets the correct default data', () => {
    const { props } = PickerHeader
    expect(typeof props.config.default).toEqual('function')
    const configDefault = props.config.default()
    expect(configDefault.showHeader).toBeTruthy()
    expect(configDefault.isRtl).toBeFalsy()
    expect(configDefault.isNextDisabled).toBeFalsy()
    expect(configDefault.isPreviousDisabled).toBeFalsy()
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

  it('should set `isLeftNavDisabled` correctly', () => {
    expect(wrapper.vm.isLeftNavDisabled)
      .toBeFalsy()
    wrapper.setProps({
      config: {
        isRtl: true,
        isNextDisabled: false,
        isPreviousDisabled: false,
      },
    })
    expect(wrapper.vm.isLeftNavDisabled).toBeFalsy()
  })

  it('should set `isRightNavDisabled` correctly', () => {
    expect(wrapper.vm.isRightNavDisabled).toBeFalsy()
    wrapper.setProps({
      config: {
        isRtl: true,
        isNextDisabled: false,
        isPreviousDisabled: false,
      },
    })
    expect(wrapper.vm.isRightNavDisabled).toBeFalsy()
  })
})
