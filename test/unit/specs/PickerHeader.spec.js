import { shallowMount } from '@vue/test-utils'
import PickerHeader from '~/components/PickerHeader.vue'

describe('PickerHeader', () => {
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

  it('sets focus from `prev` and `next` buttons', async () => {
    const prevButton = wrapper.findComponent({ ref: 'prev' })
    const nextButton = wrapper.findComponent({ ref: 'next' })

    jest.spyOn(wrapper.vm, 'focusUpFrom')

    await prevButton.trigger('keydown.right')
    expect(wrapper.vm.focusUpFrom).toHaveBeenCalledWith('prev')

    await nextButton.trigger('keydown.left')
    expect(wrapper.vm.focusUpFrom).toHaveBeenCalledWith('next')

    wrapper.setProps({
      isRtl: true,
    })

    await nextButton.trigger('keydown.right')
    expect(wrapper.vm.focusUpFrom).toHaveBeenCalledWith('prev')

    await prevButton.trigger('keydown.left')
    expect(wrapper.vm.focusUpFrom).toHaveBeenCalledWith('next')
  })

  it('sets focus from `prev` and `next` buttons when up button is disabled', async () => {
    wrapper.setProps({
      isUpDisabled: true,
    })

    const prevButton = wrapper.findComponent({ ref: 'prev' })
    const nextButton = wrapper.findComponent({ ref: 'next' })

    jest.spyOn(wrapper.vm, 'focusUpFrom')

    await prevButton.trigger('keydown.right')
    expect(wrapper.vm.focusUpFrom).toHaveBeenCalledWith('prev')

    await nextButton.trigger('keydown.left')
    expect(wrapper.vm.focusUpFrom).toHaveBeenCalledWith('next')

    wrapper.setProps({
      isRtl: true,
    })

    await nextButton.trigger('keydown.right')
    expect(wrapper.vm.focusUpFrom).toHaveBeenCalledWith('prev')

    await prevButton.trigger('keydown.left')
    expect(wrapper.vm.focusUpFrom).toHaveBeenCalledWith('next')
  })
})
