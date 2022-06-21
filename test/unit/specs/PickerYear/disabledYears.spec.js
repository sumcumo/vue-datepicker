import { mount } from '@vue/test-utils'
import PickerYear from '~/components/PickerYear.vue'
import { en } from '~/locale'

describe('PickerYear mounted with disabled dates', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PickerYear, {
      propsData: {
        translation: en,
        disabledDates: {
          to: new Date(2018, 2, 14),
          from: new Date(2018, 4, 15),
        },
        pageDate: new Date(2018, 3, 1),
        view: 'year',
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it("can't navigate to a disabled year", () => {
    wrapper.vm.changePage({ incrementBy: -1, focusRefs: ['prev'] })
    expect(wrapper.emitted('changed-decade')).toBeFalsy()

    wrapper.vm.changePage({ incrementBy: 1, focusRefs: ['next'] })
    expect(wrapper.emitted('changed-decade')).toBeFalsy()
  })

  it("can't change decade when previous or next decades are disabled", async () => {
    await wrapper.setProps({
      pageDate: new Date(2010, 9, 1),
      disabledDates: {
        to: new Date(2010, 8, 6),
        from: new Date(2017, 10, 24),
      },
    })
    expect(wrapper.vm.isPreviousDisabled).toEqual(true)
    expect(wrapper.vm.isNextDisabled).toEqual(true)
  })

  it('can change decade despite having a disabled decade', async () => {
    await wrapper.setProps({
      pageDate: new Date(2010, 9, 1),
      disabledDates: {
        to: new Date(2000, 11, 19),
        from: new Date(2021, 11, 19),
      },
    })
    expect(wrapper.vm.isPreviousDisabled).toEqual(false)
    expect(wrapper.vm.isNextDisabled).toEqual(false)
  })

  it('accepts a customPredictor to check if the year is disabled', async () => {
    await wrapper.setProps({
      disabledDates: {
        customPredictor(date) {
          if (date.getFullYear() % 3 === 0) {
            return true
          }
          return false
        },
      },
    })
    expect(wrapper.vm.isDisabledYear(new Date(2018, 4, 29))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2019, 9, 28))).toEqual(true)
    expect(wrapper.vm.isDisabledYear(new Date(2020, 8, 24))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2021, 2, 11))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2022, 2, 11))).toEqual(true)
  })

  it('closes without warning when it is undefined', async () => {
    await wrapper.setProps({
      disabledDates: undefined,
    })
    expect(wrapper.vm.isDisabledYear(new Date(2016, 8, 29))).toEqual(false)
  })

  it('does not disable everything for from', async () => {
    await wrapper.setProps({
      disabledDates: {
        to: undefined,
        from: new Date(2018, 4, 15),
      },
    })
    expect(wrapper.vm.isDisabledYear(new Date(2020, 4, 29))).toEqual(true)
    expect(wrapper.vm.isDisabledYear(new Date(2019, 4, 29))).toEqual(true)
    expect(wrapper.vm.isDisabledYear(new Date(2018, 4, 29))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2017, 4, 29))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2016, 4, 29))).toEqual(false)
  })
})
