import { shallowMount } from '@vue/test-utils'
import PickerYear from '~/components/PickerYear.vue'
import { en } from '~/locale'

describe('PickerYear', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerYear, {
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

  it("can't select a disabled year", () => {
    wrapper.vm.selectYear({ isDisabled: true })
    expect(wrapper.emitted()['select-year']).toBeFalsy()
  })

  it("can't navigate to a disabled year", () => {
    wrapper.vm.previousDecade()
    expect(wrapper.emitted()['changed-decade']).toBeFalsy()

    wrapper.vm.nextDecade()
    expect(wrapper.emitted()['changed-decade']).toBeFalsy()
  })

  it("can't change decade when previous or next decades are disabled", () => {
    wrapper.setProps({
      pageDate: new Date(2010, 9, 1),
      disabledDates: {
        to: new Date(2010, 8, 6),
        from: new Date(2017, 10, 24),
      },
    })
    expect(wrapper.vm.isPreviousDisabled).toEqual(true)
    expect(wrapper.vm.isNextDisabled).toEqual(true)
  })

  it('can change decade despite having a disabled decade', () => {
    wrapper.setProps({
      pageDate: new Date(2010, 9, 1),
      disabledDates: {
        to: new Date(2000, 11, 19),
        from: new Date(2021, 11, 19),
      },
    })
    expect(wrapper.vm.isPreviousDisabled).toEqual(false)
    expect(wrapper.vm.isNextDisabled).toEqual(false)
  })

  it('can accept a customPredictor to check if the year is disabled', () => {
    wrapper.setProps({
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

  it('should close without warning when its undefined', () => {
    wrapper.setProps({
      disabledDates: undefined,
    })
    expect(wrapper.vm.isDisabledYear(new Date(2016, 8, 29))).toEqual(false)
  })

  it('should not disable everything for from', () => {
    wrapper.setProps({
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
