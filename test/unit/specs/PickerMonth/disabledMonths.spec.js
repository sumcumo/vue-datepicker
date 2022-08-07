import { mount } from '@vue/test-utils'
import PickerMonth from '~/components/PickerMonth.vue'
import { en } from '~/locale'

describe('PickerMonth mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PickerMonth, {
      propsData: {
        pageDate: new Date(2018, 3, 1),
        translation: en,
        view: 'month',
      },
    })
  })

  afterEach(() => {
    wrapper.destroy()
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

  it('disables the `previous` button', async () => {
    await wrapper.setProps({
      disabledDates: {
        from: new Date(2018, 4, 15),
        to: new Date(2018, 2, 14),
      },
    })

    expect(wrapper.vm.isPreviousDisabled).toEqual(true)
  })

  it('does not disable the `previous` button', async () => {
    await wrapper.setProps({
      disabledDates: {},
    })
    expect(wrapper.vm.isPreviousDisabled).toEqual(false)
  })

  it('disables the `next` button', async () => {
    await wrapper.setProps({
      disabledDates: {
        from: new Date(2018, 4, 15),
        to: new Date(2018, 2, 14),
      },
    })

    expect(wrapper.vm.isNextDisabled).toEqual(true)
  })

  it('does not disable the `next` button', async () => {
    await wrapper.setProps({
      disabledDates: {},
    })
    expect(wrapper.vm.isNextDisabled).toEqual(false)
  })
})
