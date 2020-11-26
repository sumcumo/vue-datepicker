import { shallowMount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth.vue'
import { en } from '~/locale'

describe('PickerMonth', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerMonth, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 3, 1),
        selectedDate: new Date(2018, 3, 19),
        disabledDates: {
          to: new Date(2018, 2, 14),
          from: new Date(2018, 4, 15),
        },
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('can\'t select a disabled month', () => {
    wrapper.vm.selectMonth({ isDisabled: true })
    expect(wrapper.emitted['select-month']).toBeFalsy()
  })

  it('should close without warning when its undefined', () => {
    wrapper.setProps({
      disabledDates: undefined,
    })
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 8, 29))).toEqual(false)
  })

  it('should disable previous', () => {
    expect(wrapper.vm.isPreviousDisabled).toEqual(true)
  })

  it('should not disable previous', () => {
    wrapper.setProps({
      disabledDates: {},
    })
    expect(wrapper.vm.isPreviousDisabled).toEqual(false)
  })

  it('should disable next', () => {
    expect(wrapper.vm.isNextDisabled).toEqual(true)
  })

  it('should not disable next', () => {
    wrapper.setProps({
      disabledDates: {},
    })
    expect(wrapper.vm.isNextDisabled).toEqual(false)
  })
})
