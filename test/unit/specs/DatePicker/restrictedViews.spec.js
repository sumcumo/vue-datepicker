import { mount } from '@vue/test-utils'
import DatePicker from '~/components/DatePicker.vue'

describe('Datepicker mounted with restricted views', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DatePicker)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('sets initialView to minimumView by default', async () => {
    await wrapper.setProps({
      minimumView: 'month',
    })

    expect(wrapper.vm.computedInitialView).toEqual('month')
  })

  it('saves and closes when selecting on minimum-view "month"', async () => {
    await wrapper.setProps({
      minimumView: 'month',
    })
    const date = new Date(2016, 9, 12)

    await wrapper.vm.setView('month')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.handleSelect({ timestamp: date.valueOf() })
    expect(date.getFullYear()).toEqual(wrapper.vm.selectedDate.getFullYear())
    expect(date.getMonth()).toEqual(wrapper.vm.selectedDate.getMonth())
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('saves and closes when selecting on minimum-view "year"', async () => {
    await wrapper.setProps({
      minimumView: 'year',
    })
    const date = new Date(2016, 9, 12)

    await wrapper.vm.setView('year')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.handleSelect({ timestamp: date.valueOf() })
    expect(wrapper.vm.isOpen).toEqual(false)
    expect(date.getFullYear()).toEqual(wrapper.vm.selectedDate.getFullYear())
  })

  it('only allows views within the min-max range', async () => {
    await wrapper.setProps({
      minimumView: 'day',
      maximumView: 'month',
    })

    await wrapper.vm.open()

    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.picker).toBe('PickerDay')

    let upButton = wrapper.find('.vdp-datepicker__up')
    await upButton.trigger('click')
    expect(wrapper.vm.picker).toBe('PickerMonth')

    upButton = wrapper.find('.vdp-datepicker__up')
    expect(upButton.element.disabled).toBe(true)

    await wrapper.setProps({
      minimumView: 'month',
      maximumView: 'month',
    })

    expect(wrapper.vm.allowedToShowView('day')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.picker).toBe('PickerMonth')

    await wrapper.setProps({
      minimumView: 'day',
      maximumView: 'year',
    })

    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
  })

  it('throws an error on disallowed initial views', () => {
    wrapper = mount(DatePicker, {
      props: {
        minimumView: 'day',
        maximumView: 'month',
        initialView: 'year',
      },
    })

    expect(() => {
      wrapper.vm.setInitialView()
    }).toThrow()
  })
})
