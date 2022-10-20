import { mount } from '@vue/test-utils'
import PickerYear from '~/components/PickerYear.vue'
import { en } from '~/locale'

describe('PickerYear mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PickerYear, {
      propsData: {
        pageDate: new Date(2016, 9, 1),
        translation: en,
        view: 'year',
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('disables years from a given date', async () => {
    await wrapper.setProps({
      disabledDates: {
        from: new Date(2016, 0, 1),
      },
    })

    expect(wrapper.vm.isDisabledYear(new Date(2016, 0, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2017, 0, 1))).toEqual(true)
  })

  it('disables months to a given date', async () => {
    await wrapper.setProps({
      disabledDates: {
        to: new Date(2017, 0, 1),
      },
    })

    expect(wrapper.vm.isDisabledYear(new Date(2016, 0, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledYear(new Date(2017, 0, 1))).toEqual(false)
  })

  it('accepts an array of disabled dates in a range', async () => {
    await wrapper.setProps({
      disabledDates: {
        ranges: [
          {
            from: new Date(2005, 0, 1),
            to: new Date(2016, 0, 1),
          },
          {
            from: new Date(2016, 0, 1),
            to: new Date(2030, 0, 1),
          },
        ],
      },
    })

    expect(wrapper.vm.isDisabledYear(new Date(2005, 0, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2006, 0, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledYear(new Date(2029, 0, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledYear(new Date(2030, 0, 1))).toEqual(false)
  })

  it('accepts a customPredictor to check if the year is disabled', async () => {
    await wrapper.setProps({
      disabledDates: {
        customPredictor(date) {
          return date.getYear() % 4 === 0
        },
      },
    })

    expect(wrapper.vm.isDisabledYear(new Date(2016, 0, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledYear(new Date(2017, 0, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2018, 0, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2019, 0, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2020, 0, 1))).toEqual(true)
  })

  it('sets `isNextDisabled` and `isPreviousDisabled` correctly', async () => {
    await wrapper.setProps({
      disabledDates: {
        from: new Date(2019, 0, 1),
        to: new Date(2010, 0, 1),
      },
    })

    expect(wrapper.vm.isNextDisabled).toBeTruthy()
    expect(wrapper.vm.isPreviousDisabled).toBeTruthy()
  })

  it('knows the earliest possible year', async () => {
    expect(wrapper.vm.earliestPossibleDate).toBeNull()

    await wrapper.setProps({
      disabledDates: {
        to: new Date(2016, 0, 1),
      },
    })

    expect(wrapper.vm.earliestPossibleDate.getFullYear()).toEqual(2016)

    await wrapper.setProps({
      disabledDates: {
        ranges: [
          {
            from: new Date(2015, 0, 1),
            to: new Date(2019, 0, 1),
          },
        ],
        to: new Date(2016, 0, 1),
      },
    })

    expect(wrapper.vm.earliestPossibleDate.getFullYear()).toEqual(2019)
  })

  it('knows the latest possible year', async () => {
    expect(wrapper.vm.latestPossibleDate).toBeNull()

    await wrapper.setProps({
      disabledDates: {
        from: new Date(2015, 11, 31),
      },
    })

    expect(wrapper.vm.latestPossibleDate.getFullYear()).toEqual(2015)

    await wrapper.setProps({
      disabledDates: {
        ranges: [
          {
            from: new Date(2013, 11, 31),
            to: new Date(2016, 0, 1),
          },
        ],
        from: new Date(2015, 11, 31),
      },
    })

    expect(wrapper.vm.latestPossibleDate.getFullYear()).toEqual(2013)
  })
})
