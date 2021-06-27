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

  it('detects a disabled month when the `to` year is in the past', async () => {
    await wrapper.setProps({
      disabledDates: {
        to: new Date(2017, 0, 1),
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2016, 0, 1))).toEqual(true)
  })

  it('detects a disabled month when the `from` year is in the future', async () => {
    await wrapper.setProps({
      disabledDates: {
        from: new Date(2019, 0, 1),
      },
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2020, 0, 1))).toEqual(true)
  })

  it('closes without warning when it is undefined', async () => {
    await wrapper.setProps({
      disabledDates: undefined,
    })
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 8, 29))).toEqual(false)
  })

  it('disables the `previous` button', () => {
    expect(wrapper.vm.isPreviousDisabled).toEqual(true)
  })

  it('does not disable the `previous` button', async () => {
    await wrapper.setProps({
      disabledDates: {},
    })
    expect(wrapper.vm.isPreviousDisabled).toEqual(false)
  })

  it('disables the `next` button', () => {
    expect(wrapper.vm.isNextDisabled).toEqual(true)
  })

  it('does not disable the `next` button', async () => {
    await wrapper.setProps({
      disabledDates: {},
    })
    expect(wrapper.vm.isNextDisabled).toEqual(false)
  })
})
