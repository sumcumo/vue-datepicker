import { shallowMount } from '@vue/test-utils'
import PickerHeader from '~/components/PickerHeader'

describe('PickerHeader mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerHeader, {
      propsData: {
        isNextDisabled: false,
        isPreviousDisabled: false,
        isRtl: false,
        isUpDisabled: false,
        previous: () => {},
        next: () => {},
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should be visible by default', () => {
    expect(wrapper.vm.showHeader).toBeTruthy()
    wrapper.setProps({
      showHeader: false,
    })
    expect(wrapper.vm.showHeader).toBeFalsy()
  })

  it('should set `isLeftNavDisabled` correctly', () => {
    expect(wrapper.vm.isLeftNavDisabled).toBeFalsy()
    wrapper.setProps({
      isPreviousDisabled: true,
    })
    expect(wrapper.vm.isLeftNavDisabled).toBeTruthy()

    wrapper.setProps({
      isRtl: true,
      isPreviousDisabled: true,
    })
    expect(wrapper.vm.isLeftNavDisabled).toBeFalsy()
  })

  it('should set `isRightNavDisabled` correctly', () => {
    expect(wrapper.vm.isRightNavDisabled).toBeFalsy()
    wrapper.setProps({
      isNextDisabled: true,
    })
    expect(wrapper.vm.isRightNavDisabled).toBeTruthy()

    wrapper.setProps({
      isRtl: true,
      isNextDisabled: true,
    })
    expect(wrapper.vm.isRightNavDisabled).toBeFalsy()
  })
})
