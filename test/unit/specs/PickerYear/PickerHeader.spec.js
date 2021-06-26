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

  it('sets `isLeftNavDisabled` correctly', () => {
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

  it('sets `isRightNavDisabled` correctly', () => {
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
