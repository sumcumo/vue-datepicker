import { mount } from '@vue/test-utils'
import PickerDay from '~/components/PickerDay.vue'
import { en } from '~/locale'

describe('PickerDay mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PickerDay, {
      propsData: {
        pageDate: new Date(2016, 9, 1),
        translation: en,
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('highlights dates from a given date', async () => {
    await wrapper.setProps({
      highlighted: {
        from: new Date(2016, 9, 26),
      },
    })

    expect(wrapper.vm.isHighlightedDate(new Date(2006, 9, 25))).toEqual(false)
    expect(wrapper.vm.isHighlightedDate(new Date(2026, 9, 26))).toEqual(true)
  })

  it('highlights dates to a given date', async () => {
    await wrapper.setProps({
      highlighted: {
        to: new Date(2016, 9, 4),
      },
    })

    expect(wrapper.vm.isHighlightedDate(new Date(2006, 9, 3))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2026, 9, 4))).toEqual(false)
  })

  it('accepts an array of highlighted dates', async () => {
    await wrapper.setProps({
      highlighted: {
        dates: [
          new Date(2016, 9, 2),
          new Date(2016, 9, 9),
          new Date(2016, 9, 16),
        ],
      },
    })

    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('accepts an array of highlighted dates in a range', async () => {
    await wrapper.setProps({
      highlighted: {
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

    expect(wrapper.vm.isHighlightedDate(new Date(2006, 9, 2))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2026, 9, 2))).toEqual(true)
  })

  it('accepts an array of highlighted days of the week', async () => {
    await wrapper.setProps({
      highlighted: {
        days: [6, 0],
      },
    })

    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 2))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 3))).toEqual(false)
  })

  it('accepts an array of highlighted days of the month', async () => {
    await wrapper.setProps({
      highlighted: {
        daysOfMonth: [1, 10, 31],
      },
    })

    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 1))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 10, 10))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 11, 31))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2017, 8, 10))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 8, 7))).toEqual(false)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 7, 20))).toEqual(false)
  })

  it('accepts a customPredictor to check if the date is highlighted', async () => {
    await wrapper.setProps({
      highlighted: {
        customPredictor(date) {
          return date.getDate() % 5 === 0
        },
      },
    })

    expect(wrapper.vm.isHighlightedDate(new Date(2016, 8, 30))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 28))).toEqual(false)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 10, 20))).toEqual(true)
    expect(wrapper.vm.isHighlightedDate(new Date(2016, 9, 11))).toEqual(false)
  })

  it('does not highlight a disabled date', async () => {
    await wrapper.setProps({
      disabledDates: {
        dates: [new Date(2016, 11, 5)],
      },
      highlighted: {
        from: new Date(2016, 11, 4),
        to: new Date(2016, 11, 8),
      },
    })

    expect(wrapper.vm.isHighlightedDate(new Date(2016, 11, 5))).toEqual(false)
  })

  it('highlights a disabled date when explicitly configured to do so', async () => {
    await wrapper.setProps({
      highlighted: {
        to: new Date(2016, 11, 8),
        from: new Date(2016, 11, 4),
        includeDisabled: true,
      },
    })

    expect(wrapper.vm.isHighlightedDate(new Date(2016, 11, 5))).toEqual(true)
  })

  it('detects the first date of the highlighted dates', async () => {
    await wrapper.setProps({
      highlighted: {
        from: new Date(2016, 11, 4),
        to: new Date(2016, 11, 8),
      },
    })

    expect(wrapper.vm.isHighlightStart(new Date(2016, 11, 4))).toEqual(true)
    expect(wrapper.vm.isHighlightStart(new Date(2016, 11, 3))).toEqual(false)
    expect(wrapper.vm.isHighlightStart(new Date(2016, 11, 5))).toEqual(false)
  })

  it('detects the last date of the highlighted dates', async () => {
    await wrapper.setProps({
      highlighted: {
        from: new Date(2016, 11, 4),
        to: new Date(2016, 11, 8),
      },
    })

    expect(wrapper.vm.isHighlightEnd(new Date(2016, 11, 8))).toEqual(true)
    expect(wrapper.vm.isHighlightEnd(new Date(2016, 11, 6))).toEqual(false)
    expect(wrapper.vm.isHighlightEnd(new Date(2016, 11, 7))).toEqual(false)
  })
})
