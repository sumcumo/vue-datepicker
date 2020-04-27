import { shallowMount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth'
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

  it('cant select a disabled month', () => {
    const month = { isDisabled: true }
    expect(wrapper.vm.selectMonth(month)).toEqual(false)
  })

  it('can accept a customPredictor to check if the month is disabled', () => {
    wrapper.setProps({
      disabledDates: {
        customPredictor(date) {
          if (date.getMonth() % 4 === 0) {
            return true
          }
          return false
        },
      },
    })
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 4, 29))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 9, 28))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 8, 24))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 2, 11))).toEqual(false)
  })

  it('should close without warning when its undefined', () => {
    wrapper.setProps({
      disabledDates: undefined,
    })
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 8, 29))).toEqual(false)
  })

  it('should disable previous', () => {
    expect(wrapper.vm.isPreviousDisabled()).toEqual(true)
  })

  it('should not disable previous', () => {
    wrapper.setProps({
      disabledDates: {},
    })
    expect(wrapper.vm.isPreviousDisabled()).toEqual(false)
  })

  it('should disable next', () => {
    expect(wrapper.vm.isNextDisabled()).toEqual(true)
  })

  it('should not disable next', () => {
    wrapper.setProps({
      disabledDates: {},
    })
    expect(wrapper.vm.isNextDisabled()).toEqual(false)
  })
})
