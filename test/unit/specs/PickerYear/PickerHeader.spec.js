import { shallowMount } from '@vue/test-utils'
import PickerHeader from '~/components/PickerHeader.vue'

describe('PickerHeader', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerHeader, {
      propsData: {
        isRtl: false,
        isNextDisabled: false,
        isPreviousDisabled: false,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should set `isLeftNavDisabled` correctly', () => {
    expect(wrapper.vm.isLeftNavDisabled).toBeFalsy()
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
