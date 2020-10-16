import { shallowMount } from '@vue/test-utils'
import PickerHeader from '~/components/PickerHeader.vue'

describe('PickerHeader unmounted', () => {
  it('sets the correct default data', () => {
    const { props } = PickerHeader
    expect(typeof props.config.default).toEqual('function')
    const configDefault = props.config.default()
    expect(configDefault.showHeader).toBeTruthy()
    expect(configDefault.isRtl).toBeFalsy()
    expect(typeof configDefault.isNextDisabled).toEqual('function')
    expect(configDefault.isNextDisabled()).toBeFalsy()
    expect(typeof configDefault.isPreviousDisabled).toEqual('function')
    expect(configDefault.isPreviousDisabled()).toBeFalsy()
    expect(typeof props.next.default).toEqual('function')
    expect(props.next.default()).toBeFalsy()
    expect(typeof props.previous.default).toEqual('function')
    expect(props.previous.default()).toBeFalsy()
  })
})

describe('PickerHeader mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerHeader, {})
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should use `isLeftNavDisabled` correctly', async () => {
    const spyPrevious = jest.spyOn(wrapper.vm.config, 'isPreviousDisabled')
    const spyNext = jest.spyOn(wrapper.vm.config, 'isNextDisabled')
    expect(wrapper.vm.isLeftNavDisabled).toBeFalsy()
    expect(spyPrevious).toHaveBeenCalled()
    wrapper.setProps({
      config: {
        isRtl: true,
        isNextDisabled() {
          return false
        },
        isPreviousDisabled() {
          return false
        },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isLeftNavDisabled).toBeFalsy()
    expect(spyNext).toHaveBeenCalled()
  })

  it('should use `isRightNavDisabled` correctly', async () => {
    const spyPrevious = jest.spyOn(wrapper.vm.config, 'isPreviousDisabled')
    const spyNext = jest.spyOn(wrapper.vm.config, 'isNextDisabled')

    expect(wrapper.vm.isRightNavDisabled).toBeFalsy()
    expect(spyNext).toHaveBeenCalled()
    wrapper.setProps({
      config: {
        isRtl: true,
        isNextDisabled() {
          return false
        },
        isPreviousDisabled() {
          return false
        },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isRightNavDisabled).toBeFalsy()
    expect(spyPrevious).toHaveBeenCalled()
  })
})
