import { mount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth.vue'
import { en } from '~/locale'

describe('PickerMonth mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PickerMonth, {
      propsData: {
        pageDate: new Date(2016, 9, 1),
        translation: en,
        view: 'month',
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('disables months from a given date', async () => {
    await wrapper.setProps({
      disabledDates: {
        from: new Date(2015, 9, 1),
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2015, 9, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2015, 10, 1))).toEqual(true)
  })

  it('disables months to a given date', async () => {
    await wrapper.setProps({
      disabledDates: {
        to: new Date(2017, 9, 1),
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2017, 8, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2017, 9, 1))).toEqual(false)
  })

  it('accepts an array of disabled dates', async () => {
    const dates = Array.from(new Array(31), (val, index) => {
      return new Date(2016, 9, index + 1)
    })

    await wrapper.setProps({
      disabledDates: {
        dates,
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2016, 8, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 9, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 10, 1))).toEqual(false)

    await wrapper.setProps({
      disabledDates: {
        dates: dates.pop(),
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2016, 9, 1))).toEqual(false)
  })

  it('accepts an array of disabled dates in a range', async () => {
    await wrapper.setProps({
      disabledDates: {
        ranges: [
          {
            from: new Date(2005, 6, 1),
            to: new Date(2016, 9, 1),
          },
          {
            from: new Date(2016, 10, 1),
            to: new Date(2030, 11, 1),
          },
        ],
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2005, 5, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2006, 6, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2030, 10, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2030, 11, 1))).toEqual(false)
  })

  it('accepts a customPredictor to check if the month is disabled', async () => {
    await wrapper.setProps({
      disabledDates: {
        customPredictor(date) {
          return date.getMonth() % 4 === 0
        },
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2016, 0, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 1, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 2, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 3, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 4, 1))).toEqual(true)
  })

  it('sets `isNextDisabled` and `isPreviousDisabled` correctly', async () => {
    await wrapper.setProps({
      disabledDates: {
        from: new Date(2016, 11, 1),
        to: new Date(2016, 0, 1),
      },
    })

    expect(wrapper.vm.isNextDisabled).toBeTruthy()
    expect(wrapper.vm.isPreviousDisabled).toBeTruthy()
  })

  it('knows the earliest possible month', async () => {
    expect(wrapper.vm.earliestPossibleDate).toBeNull()

    await wrapper.setProps({
      disabledDates: {
        to: new Date(2016, 9, 1),
      },
    })

    expect(wrapper.vm.earliestPossibleDate.getMonth()).toEqual(9)

    await wrapper.setProps({
      disabledDates: {
        ranges: [
          {
            from: new Date(2016, 8, 30),
            to: new Date(2016, 10, 15),
          },
        ],
        to: new Date(2016, 9, 1),
      },
    })

    expect(wrapper.vm.earliestPossibleDate.getMonth()).toEqual(10)
  })

  it('knows the latest possible month', async () => {
    expect(wrapper.vm.latestPossibleDate).toBeNull()

    await wrapper.setProps({
      disabledDates: {
        from: new Date(2016, 8, 30),
      },
    })

    expect(wrapper.vm.latestPossibleDate.getMonth()).toEqual(8)

    await wrapper.setProps({
      disabledDates: {
        ranges: [
          {
            from: new Date(2016, 6, 31),
            to: new Date(2016, 9, 1),
          },
        ],
        from: new Date(2016, 8, 30),
      },
    })

    expect(wrapper.vm.latestPossibleDate.getMonth()).toEqual(6)
  })
})
