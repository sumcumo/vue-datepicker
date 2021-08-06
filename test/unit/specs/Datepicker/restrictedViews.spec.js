import { mount } from '@vue/test-utils'
import Datepicker from '~/components/Datepicker.vue'

describe('Datepicker with restricted views', () => {
  let wrapper

  it('sets initialView to minimumView by default', () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'month',
      },
    })
    expect(wrapper.vm.computedInitialView).toEqual('month')
  })

  it('saves and closes when selecting on minimum-view "month"', async () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
      },
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
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'year',
      },
    })
    const date = new Date(2016, 9, 12)

    await wrapper.vm.setView('year')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.handleSelect({ timestamp: date.valueOf() })
    expect(wrapper.vm.isOpen).toEqual(false)
    expect(date.getFullYear()).toEqual(wrapper.vm.selectedDate.getFullYear())
  })

  it('only allows views within the min-max range', async () => {
    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'month',
      },
    })

    await wrapper.vm.open()

    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.picker).toBe('PickerDay')
    let upButton = wrapper.find('.day__month_btn')
    await upButton.trigger('click')
    expect(wrapper.vm.picker).toBe('PickerMonth')
    upButton = wrapper.find('.month__year_btn')
    expect(upButton.element.tabIndex).toBe(-1)

    wrapper.destroy()

    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'month',
        maximumView: 'month',
      },
    })
    await wrapper.vm.open()

    expect(wrapper.vm.allowedToShowView('day')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.picker).toBe('PickerMonth')

    wrapper = mount(Datepicker, {
      propsData: {
        minimumView: 'day',
        maximumView: 'year',
      },
    })
    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
  })

  it('throws an error on disallowed initial views', () => {
    wrapper = mount(Datepicker, {
      propsData: {
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
