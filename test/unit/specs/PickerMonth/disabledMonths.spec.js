import { shallowMount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth.vue'
import { en } from '~/locale'

describe('PickerMonth', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerMonth, {
      propsData: {
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

  it("can't select a disabled month", () => {
    wrapper.vm.select({ isDisabled: true })
    expect(wrapper.emitted('select')).toBeFalsy()
  })

  it('should detect a disabled month when the `to` year is in the past', () => {
    wrapper.setProps({
      disabledDates: {
        to: new Date(2017, 0, 1),
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2016, 0, 1))).toEqual(true)
  })

  it('should detect a disabled month when the `from` year is in the future', () => {
    wrapper.setProps({
      disabledDates: {
        from: new Date(2019, 0, 1),
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2020, 0, 1))).toEqual(true)
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
