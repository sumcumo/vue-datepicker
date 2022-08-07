import { mount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay.vue'
import { en } from '~/locale'

describe('PickerDay mounted with disabled dates', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PickerDay, {
      propsData: {
        disabledDates: {
          from: new Date(2016, 9, 26),
          to: new Date(2016, 9, 4),
        },
        pageDate: new Date(2016, 9, 1),
        translation: en,
        view: 'day',
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

  it('sets `isNextDisabled` and `isPreviousDisabled` correctly', () => {
    expect(wrapper.vm.isNextDisabled).toBeTruthy()
    expect(wrapper.vm.isPreviousDisabled).toBeTruthy()
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

  it('accepts an array of disabled dates in a range', async () => {
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
          return date.getDate() % 4 === 0
        },
      },
    })
    expect(wrapper.vm.isDisabledDate(new Date(2016, 8, 29))).toEqual(false)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 28))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 10, 24))).toEqual(true)
    expect(wrapper.vm.isDisabledDate(new Date(2016, 9, 11))).toEqual(false)
  })

  it('knows the earliest possible date', async () => {
    expect(wrapper.vm.earliestPossibleDate).toEqual(new Date(2016, 9, 4))

    await wrapper.setProps({
      disabledDates: {
        dates: [new Date(2016, 9, 4)],
        to: new Date(2016, 9, 4),
      },
    })

    expect(wrapper.vm.earliestPossibleDate).toEqual(new Date(2016, 9, 5))

    await wrapper.setProps({
      disabledDates: {
        dates: [new Date(2016, 9, 4)],
        ranges: [
          {
            from: new Date(2016, 9, 4),
            to: new Date(2016, 9, 8),
          },
        ],
        to: new Date(2016, 9, 4),
      },
    })

    expect(wrapper.vm.earliestPossibleDate).toEqual(new Date(2016, 9, 8))
  })

  it('knows the latest possible date', async () => {
    expect(wrapper.vm.latestPossibleDate).toEqual(new Date(2016, 9, 26))

    await wrapper.setProps({
      disabledDates: {
        dates: [new Date(2016, 9, 26)],
        from: new Date(2016, 9, 26),
      },
    })

    expect(wrapper.vm.latestPossibleDate).toEqual(new Date(2016, 9, 25))

    await wrapper.setProps({
      disabledDates: {
        dates: [new Date(2016, 9, 26)],
        ranges: [
          {
            from: new Date(2016, 9, 20),
            to: new Date(2016, 9, 28),
          },
        ],
        from: new Date(2016, 9, 26),
      },
    })

    expect(wrapper.vm.latestPossibleDate).toEqual(new Date(2016, 9, 20))
  })
})
