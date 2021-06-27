import { shallowMount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay.vue'
import { en } from '~/locale'

describe('PickerDay: disabled', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        disabledDates: {
          to: new Date(2016, 9, 4),
          from: new Date(2016, 9, 26),
        },
        pageDate: new Date(2016, 9, 1),
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('detects a disabled date', () => {
    expect(wrapper.vm.isDisabledDate(new Date(2006, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2026, 9, 2))).toEqual(true)
  })

  it('does not select a disabled date', () => {
    wrapper.vm.select({ isDisabled: true })
    expect(wrapper.emitted('select')).toBeFalsy()
  })

  it('cannot change to a disabled month', () => {
    wrapper.vm.previousPage()
    expect(wrapper.vm.pageDate.getMonth()).toEqual(9)
    wrapper.vm.nextPage()
    expect(wrapper.vm.pageDate.getMonth()).toEqual(9)
  })

  it('can change month despite having a disabled month', () => {
    expect(wrapper.vm.isNextDisabled).toBeTruthy()
  })

  it('detects disabled dates', async () => {
    await wrapper.setProps({
      disabledDates: {
        ranges: [
          {
            from: new Date(2005, 6, 5),
            to: new Date(2016, 9, 4),
          },
          {
            from: new Date(2016, 9, 26),
            to: new Date(2030, 12, 25),
          },
        ],
      },
    })
    expect(wrapper.vm.isDisabledDate(new Date(2006, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2026, 9, 2))).toEqual(true)
  })

  it('accepts an array of disabled dates', async () => {
    await wrapper.setProps({
      disabledDates: {
        dates: [
          new Date(2016, 9, 2),
          new Date(2016, 9, 9),
          new Date(2016, 9, 16),
        ],
      },
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('accepts an array of disabled days of the week', async () => {
    await wrapper.setProps({
      disabledDates: {
        days: [6, 0],
      },
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('accepts an array of disabled days of the month', async () => {
    await wrapper.setProps({
      disabledDates: {
        daysOfMonth: [29, 30, 31],
      },
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 8, 29))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 31))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 10, 30))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 11))).toEqual(false)
  })

  it('accepts a customPredictor to check if the date is disabled', async () => {
    await wrapper.setProps({
      disabledDates: {
        customPredictor(date) {
          if (date.getDate() % 4 === 0) {
            return true
          }
          return false
        },
      },
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 8, 29))).toEqual(false)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 28))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 10, 24))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 11))).toEqual(false)
  })

  it('emits a select-disabled event for a disabled date', () => {
    wrapper.vm.select({ isDisabled: true })
    expect(wrapper.emitted('select-disabled')).toBeTruthy()
  })

  it('closes without warning when disabledDates is undefined', async () => {
    await wrapper.setProps({
      disabledDates: undefined,
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 8, 29))).toEqual(false)
  })
})
